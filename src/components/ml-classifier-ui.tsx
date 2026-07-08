import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import { useCallback, useEffect, useReducer, useRef } from "react";
import Dropzone from "../components/dropzone";
import { getFilesAsImageArray, IFileData, splitImagesFromLabels } from "../utils/getFilesAsImages";
import nextFrame from "../utils/nextFrame";

import { ImageError, ITrainResult } from "../types";

import Model from "../components/model";
import Preview from "../components/preview";

import MLClassifier from "../lib/classifier";

import styles from "../styles/MLClassifierUI.module.css";

interface IParams {
	[index: string]: any;
}

interface IState {
	status: string;
	images?: string[];
	files: any[];
	labels: string[];
	predictions: {
		src: string;
		prediction: string;
		label: string;
		score: Array<any>;
	}[];
	logs: {
		[index: string]: any;
	};
	accuracy: {
		training?: number;
		evaluation?: number;
	};
	errors?: ImageError[];
}

interface IProps {
	params: {
		train?: IParams;
		evaluate?: IParams;
		save?: IParams;
	};
	trainingState?: string;
	getMLClassifier?: Function;
	uploadFormat: string;
	imagesFormats: string[];
	onLoadStart?: Function;
	onLoadComplete?: Function;
	onAddDataStart?: Function;
	onAddDataComplete?: Function;
	onClearDataStart?: Function;
	onClearDataComplete?: Function;
	onTrainStart?: Function;
	onTrainComplete?: Function;
	onPredictComplete?: Function;
	onPredictStart?: Function;
	onEvaluateStart?: Function;
	onEvaluateComplete?: Function;
	onSaveStart?: Function;
	onSaveComplete?: Function;
	appValidationPool?: string[];
	onImagesUpdate?: (groupA: any[], groupB: any[]) => void;
}

type Action =
	| { type: "drop" }
	| { type: "addData-start"; images: string[]; dataType: string }
	| { type: "parse-object" }
	| { type: "set-files"; files: any[] }
	| { type: "addData-complete"; images: string[]; labels: string[]; errors?: ImageError[] }
	| { type: "train-batch"; loss: any }
	| { type: "train-complete"; training: number }
	| { type: "predict-complete"; prediction: IState["predictions"][number] }
	| { type: "clear-predictions" };

const initialState: IState = {
	errors: [],
	files: [],
	status: "empty",
	images: undefined,
	predictions: [],
	logs: {},
	labels: [],
	accuracy: {
		training: undefined,
		evaluation: undefined,
	},
};

const reducer = (state: IState, action: Action): IState => {
	switch (action.type) {
		case "drop":
			return { ...state, status: "uploading" };
		case "addData-start":
			return action.dataType === "train"
				? { ...state, status: "training", images: action.images }
				: { ...state, status: "parsing" };
		case "parse-object":
			return { ...state, predictions: [], status: "empty" };
		case "set-files":
			return { ...state, files: action.files };
		case "addData-complete":
			return {
				...state,
				status: "training",
				images: action.images,
				labels: action.labels,
				errors: (action.errors || []).map((error: ImageError) => ({
					...error,
					file: state.files[error.index],
				})),
			};
		case "train-batch":
			return {
				...state,
				logs: {
					...state.logs,
					loss: (state.logs.loss || []).concat(action.loss),
				},
			};
		case "train-complete":
			return {
				...state,
				status: "trained",
				accuracy: {
					...state.accuracy,
					training: action.training,
				},
			};
		case "predict-complete":
			return { ...state, predictions: state.predictions.concat(action.prediction) };
		case "clear-predictions":
			return { ...state, predictions: [] };
		default:
			return state;
	}
};

const MLClassifierUI: React.FC<IProps> = (props) => {
	const { params = {} } = props;

	const [state, dispatch] = useReducer(reducer, initialState);

	const classifierRef = useRef<MLClassifier | null>(null);

	// Keep the latest props/state available to the classifier callbacks, which are
	// frozen at construction time (the classifier is only built once — see below).
	const propsRef = useRef<IProps>(props);
	propsRef.current = { ...props, params };
	const stateRef = useRef<IState>(state);
	stateRef.current = state;

	const onDrop = useCallback(() => {
		dispatch({ type: "drop" });
	}, []);

	const onAddDataStart = useCallback(async (imageSrcs: string[], _labels: any, dataType: string) => {
		dispatch({ type: "addData-start", images: imageSrcs, dataType });

		if (propsRef.current.onAddDataStart) {
			propsRef.current.onAddDataStart();
		}
	}, []);

	const onParseFiles = useCallback(async (origFiles: FileList) => {
		const imageFiles: IFileData[] = await getFilesAsImageArray(origFiles);

		const { images, labels, files } = await splitImagesFromLabels(imageFiles);

		dispatch({ type: "set-files", files });
		return classifierRef.current!.addData(images, labels, "train");
	}, []);

	const onParseObject = useCallback((origFiles: Array<any>) => {
		dispatch({ type: "parse-object" });

		let labels = new Array<string>();
		let images = new Array<string>();

		images = origFiles.map((file) => {
			return file.src;
		});
		labels = origFiles.map((file) => {
			return file.label;
		});

		return classifierRef.current!.addData(images, labels, "train");
	}, []);

	const onAddDataComplete = useCallback(
		async (imageSrcs: string[], labels: string[], dataType: string, errors?: ImageError[]) => {
			if (propsRef.current.onAddDataComplete) {
				propsRef.current.onAddDataComplete(imageSrcs, labels, dataType, errors);
			}
			if (dataType === "train") {
				dispatch({ type: "addData-complete", images: imageSrcs, labels, errors });

				const train = propsRef.current.params.train || {};

				const result: ITrainResult = (await classifierRef.current!.train({
					...train,
					callbacks: {
						onBatchEnd: async (batch: any, logs: any) => {
							if (train.callbacks && train.callbacks.onBatchEnd) {
								train.callbacks.onBatchEnd(batch, logs);
							}
							const loss = logs.loss.toFixed(5);
							// console.log(logs);
							// log(batch, logs);
							// log('Loss is: ' + logs.loss.toFixed(5));
							dispatch({ type: "train-batch", loss });

							await nextFrame();
						},
					},
				})) as unknown as ITrainResult;

				const {
					history: {
						acc,
						// loss,
					},
				} = result;

				const training = acc[acc.length - 1]!;
				dispatch({ type: "train-complete", training });
			}
		},
		[]
	);

	const onPredictComplete = useCallback(
		async (src: string, label: string, pred: string | number, score: any) => {
			if (propsRef.current.onPredictComplete) {
				propsRef.current.onPredictComplete(src, label, pred);
			}
			const prediction = `${pred}`;

			const currentLabels = [...new Set(stateRef.current.labels)];

			const temp = score;

			const outcome = [
				Math.max(temp[0], temp[1]),
				prediction,
				Math.min(temp[0], temp[1]),
				currentLabels.indexOf(prediction) === 0 ? currentLabels[1] : currentLabels[0],
			];

			score = outcome;
			dispatch({
				type: "predict-complete",
				prediction: {
					src,
					prediction,
					label,
					score,
				},
			});
		},
		[]
	);

	const onClearPredictions = useCallback(() => {
		dispatch({ type: "clear-predictions" });
	}, []);

	const predict = useCallback(async (imageFiles: IFileData[]) => {
		for (let i = 0; i < imageFiles.length; i++) {
			const { src, label } = imageFiles[i]!;

			await classifierRef.current!.predict(src, label);
		}
	}, []);

	useEffect(() => {
		// React 18 StrictMode double-invokes effects in dev; guard so we only ever
		// construct a single TF.js classifier instance.
		if (classifierRef.current) {
			return;
		}

		const p = propsRef.current;
		const classifier = new MLClassifier({
			onLoadStart: p.onLoadStart,
			onLoadComplete: p.onLoadComplete,
			onAddDataStart: onAddDataStart,
			onAddDataComplete: onAddDataComplete,
			onClearDataStart: p.onClearDataStart,
			onClearDataComplete: p.onClearDataComplete,
			onTrainStart: p.onTrainStart,
			onTrainComplete: p.onTrainComplete,
			onPredictStart: p.onPredictStart,
			onPredictComplete: onPredictComplete,
			onEvaluateStart: p.onEvaluateStart,
			onEvaluateComplete: p.onEvaluateComplete,
		});
		classifierRef.current = classifier;

		if (p.getMLClassifier) {
			p.getMLClassifier(classifier);
		}
	}, [onAddDataStart, onAddDataComplete, onPredictComplete]);

	return (
		<div className="row align-items-center">
			{(state.status === "empty" ||
				// props.trainingState === "selection" ||
				props.trainingState === "train") && (
				<div className={styles.classifierAlt + " col-md-6"}>
					<Dropzone
						onDrop={onDrop}
						onParseFiles={onParseFiles}
						onParseObject={onParseObject}
						onImagesUpdate={props.onImagesUpdate}
						mode={props.trainingState}
					/>
				</div>
			)}
			{["training", "uploading", "parsing"].includes(state.status) && (
				<div className={styles.classifier + " col-md-6"}>
					<Preview images={state.images} />
				</div>
			)}

			{state.status === "trained" && props.trainingState === "evaluation" && state.images && (
				<div className={" col-md-12"}>
					<Model
						predict={predict}
						predictions={state.predictions}
						appValidationPool={props.appValidationPool}
						onButtonClick={onClearPredictions}
						onImagesUpdate={props.onImagesUpdate}
					/>
				</div>
			)}
		</div>
	);
};

export default MLClassifierUI;
