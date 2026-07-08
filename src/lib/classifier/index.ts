import * as tf from "@tensorflow/tfjs";
import cropAndResizeImage from "./cropAndResizeImage";
import getClasses from "./getClasses";
import train from "./train";
import translateImages, { IImageData } from "./translateImages";
import loadPretrainedModel from "./loadPretrainedModel";
// import log, { resetLog } from './log';
import { addData, addLabels } from "./prepareData";

import {
	IParams,
	// IConfigurationParams,
	IData,
	ICollectedData,
	IArgs,
	// DataType,
} from "./types";

// export { DataType } from './types';

class MLClassifier {
	// private pretrainedModel: typeof tf.model;
	// private pretrainedModel: any;
	private pretrainedModel!: tf.LayersModel;
	// private model: tf.Sequential;
	private model!: tf.LayersModel;
	private callbacks: Function[] = [];
	private args: IArgs;
	private data: IData = {
		classes: {},
	};

	constructor(args: IArgs) {
		this.args = args;
		this.init();
	}

	private callbackFn = (fn: string, type: string, ...args: any[]) => {
		const key = `${fn}${type.substring(0, 1).toUpperCase()}${type.substring(1)}`;
		const callbacks = this.args as Record<string, unknown>;
		if (callbacks[key] && typeof callbacks[key] === "function") {
			(callbacks[key] as (...cbArgs: any[]) => void)(...args);
		}
	};

	private init = async () => {
		this.callbackFn("onLoad", "start");
		this.pretrainedModel = await loadPretrainedModel(this.args.pretrainedModel);

		this.callbacks.map((callback) => callback());

		this.callbackFn("onLoad", "complete");

		// Warmup the model
		const dims = await this.getInputDims();
		tf.tidy(() => {
			this.pretrainedModel.predict(tf.zeros([1, ...dims, 3]));
		});
	};

	private loaded = async () =>
		new Promise<void>((resolve) => {
			if (this.pretrainedModel) {
				return resolve();
			}

			this.callbacks.push(() => {
				resolve();
			});
		});

	// private cropAndActivateImage = async (image: tf.Tensor3D) => {
	private cropAndActivateImage = async (image: any) => {
		await this.loaded();
		// const {
		//   inputLayers,
		// } = this.pretrainedModel;
		// const {
		//   batchInputShape,
		// } = inputLayers[0];
		const dims = await this.getInputDims();
		await tf.nextFrame();
		const processedImage = await cropAndResizeImage(image, dims);
		await tf.nextFrame();
		const pred = this.pretrainedModel.predict(processedImage);
		return pred;
	};

	private getInputDims = async (): Promise<[number, number]> => {
		await this.loaded();

		const { inputLayers } = this.pretrainedModel;

		// batchInputShape exists on the input layer at runtime but is absent from tf.layers.Layer's type
		const { batchInputShape } = inputLayers[0] as unknown as { batchInputShape: number[] };

		return [batchInputShape[1]!, batchInputShape[2]!];
	};

	private getData = async (dataType: string): Promise<ICollectedData> => {
		if (dataType !== "train" && dataType !== "eval") {
			throw new Error(`Datatype ${dataType} unsupported`);
		}

		return {
			xs: this.data[dataType]!.xs,
			ys: this.data[dataType]!.ys,
			classes: this.data.classes,
		};
	};

	public getModel = () => this.model;

	public addData = async (
		origImages: Array<tf.Tensor | IImageData | HTMLImageElement | string>,
		origLabels: string[],
		dataType = "train"
	) => {
		this.callbackFn("onAddData", "start", origImages, origLabels, dataType);
		if (!origImages) {
			throw new Error("You must supply images");
		}
		if (!origLabels) {
			throw new Error("You must supply labels");
		}

		const dims = await this.getInputDims();
		const { images, errors, labels } = await translateImages(origImages, dims, origLabels);
		if (images.length !== labels.length) {
			throw new Error("Class mismatch between labels and images");
		}

		if (dataType === "train" || dataType === "eval") {
			const activatedImages: tf.Tensor[] = [];
			for (let i = 0; i < images.length; i++) {
				const image = images[i];
				// TODO: Debug this any type
				const activatedImage: any = await this.cropAndActivateImage(image);
				activatedImages.push(activatedImage);
				await tf.nextFrame();
			}

			this.data.classes = getClasses(labels);
			const xs = addData(activatedImages);
			await tf.nextFrame();
			const ys = addLabels(labels, this.data.classes);
			await tf.nextFrame();
			this.data[dataType] = {
				xs,
				ys,
			};
		}

		await tf.nextFrame();
		this.callbackFn("onAddData", "complete", origImages, labels, dataType, errors);
	};

	public clearData = async (dataType?: string) => {
		this.callbackFn("onClearData", "start", dataType);
		if (dataType) {
			this.data[dataType] = {};
		}

		this.data["train"] = {};
		this.data["eval"] = {};

		this.callbackFn("onClearData", "complete", dataType);
	};

	public train = async (params: IParams = {}) => {
		this.callbackFn("onTrain", "start", params);
		await this.loaded();
		const data = await this.getData("train");

		if (!data.xs) {
			throw new Error("You must add some training examples");
		}
		if (!data.ys) {
			throw new Error("You must add some training labels");
		}

		const classes = Object.keys(data.classes).length;
		if (classes <= 1) {
			throw new Error("You must train with more than one class");
		}
		const { model, history } = await train(this.pretrainedModel, data, classes, params, this.args);

		this.model = model;
		this.callbackFn("onTrain", "complete", params, history);
		return history;
	};

	public predict = async (origImage: tf.Tensor | HTMLImageElement | string, label?: string) => {
		try {
			let score, convertedScore;
			this.callbackFn("onPredict", "start", origImage);
			await this.loaded();
			if (!this.model) {
				throw new Error("You must call train prior to calling predict");
			}
			const dims = await this.getInputDims();
			const { images, errors } = await translateImages([origImage], dims);
			if (errors && errors.length && !images[0]) {
				throw errors[0]!.error;
			}
			const data = images[0];
			const img = await this.cropAndActivateImage(data);
			// TODO: Do these images need to be activated?
			const predictedClass = tf.tidy(() => {
				const predictions = this.model.predict(img);

				score = predictions.toString();
				score = score.replace(/[[\]']+/g, "");
				score = score.replace(/["Tensor"]+/g, "");
				score = score.trim();
				score = score.replaceAll(",", "");
				score = score.split(" ");

				convertedScore = score.map((value) => (parseFloat(value.replace("-", "e-")) * 100).toFixed(2));

				// TODO: address this
				return (predictions as tf.Tensor).as1D().argMax();
			});

			const classId = (await predictedClass.data())[0]!;

			predictedClass.dispose();
			const prediction = Object.entries(this.data.classes).reduce<Record<number, string>>(
				(obj, [key, val]) => ({
					...obj,
					[val]: key,
				}),
				{}
			)[classId];
			this.callbackFn("onPredict", "complete", origImage, label, prediction, convertedScore);
			return prediction;
		} catch (err) {
			console.error(err, origImage, label);
			// throw new Error(err);
		}
	};

	public evaluate = async (params: IParams = {}) => {
		this.callbackFn("onEvaluate", "start", params);
		await this.loaded();
		if (!this.model) {
			throw new Error("You must call train prior to calling predict");
		}
		const data = await this.getData("eval");

		if (!data.xs || !data.ys) {
			throw new Error("You must add some evaluation examples");
		}

		const evaluation = await this.model.evaluate(data.xs, data.ys, params);
		this.callbackFn("onEvaluate", "complete", params, evaluation);
		return evaluation;
	};
}

export default MLClassifier;

export { PRETRAINED_MODELS_KEYS as PRETRAINED_MODELS } from "./loadPretrainedModel";
