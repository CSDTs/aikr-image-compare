import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getFilesAsImageArray, IFileData, splitImagesFromLabels } from "../../../utils/getFilesAsImages";
import nextFrame from "../../../utils/nextFrame";
import Dropzone from "../Dropzone";

import TrainingPreview from "../../../features/TrainingPreview";

import MLClassifier from "../../../lib/ml-classifier";

import { Accuracy, ImageError, IParams, ITrainResult } from "../../../types";

import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./ClassifierCore.module.scss";

import Evaluation from "../../../features/Evaluation";
import { useClassifierStore } from "../../../store";

interface IProps {
	params: {
		train?: IParams;
		evaluate?: IParams;
		save?: IParams;
	};
	trainingState?: string;
	getMLClassifier?: Function;
	uploadFormat?: string;
	imagesFormats?: string[];
	showDownload?: boolean;
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
}

const defaultProps: Partial<IProps> = {
	params: {},
	uploadFormat: "nested",
	imagesFormats: undefined,
	showDownload: true,
};

const ClassifierCore: FC<IProps> = (propsIn) => {
	const props = useMemo(() => ({ ...defaultProps, ...propsIn }), [propsIn]);

	let classifier = useRef<any>(null);

	const [labels, setLabels] = useState<string[]>([]);
	const [files, setFiles] = useState<any[]>([]);
	const [errors, setErrors] = useState<ImageError[]>([]);
	const [status, setStatus] = useState<string>("empty");
	const [logs, setLogs] = useState<IParams>({});
	const [images, setImages] = useState<string[]>([]);
	const [downloading, setDownloading] = useState<boolean>(false);

	const setClassifierData = useClassifierStore((state) => state.setValue);

	const predictions = useClassifierStore((state) => state.predictions);
	const updatePredictions = useClassifierStore((state) => state.updatePredictions);
	const [accuracy, setAccuracy] = useState<Accuracy>({ training: undefined, evaluation: undefined });

	const { getMLClassifier, trainingState, showDownload } = props;

	const onPredictComplete = useCallback(
		async (src: string, label: string, pred: string | number, score: any) => {
			if (props.onPredictComplete) {
				props.onPredictComplete(src, label, pred);
			}
			const prediction = `${pred}`;

			let currentLabels = [...new Set(labels)];

			let temp = score;

			let outcome = [
				Math.max(temp[0], temp[1]),
				prediction,
				Math.min(temp[0], temp[1]),
				currentLabels.indexOf(prediction) === 0 ? currentLabels[1] : currentLabels[0],
			];

			score = outcome;

			updatePredictions({
				src,
				prediction,
				label,
				score,
			});
		},
		[props, labels, updatePredictions]
	);

	const predict = async (imageFiles: IFileData[]) => {
		for (let i = 0; i < imageFiles.length; i++) {
			const { src, label } = imageFiles[i];

			await classifier.current.predict(src, label);
		}
	};
	const onAddDataComplete = useCallback(
		async (imageSrcs: string[], labels: string[], dataType: string, errors?: ImageError[]) => {
			if (props.onAddDataComplete) {
				props.onAddDataComplete(imageSrcs, labels, dataType, errors);
			}
			if (dataType === "train") {
				setStatus("training");
				setLabels(labels);
				setImages(imageSrcs);
				setErrors(
					(errors || []).map((error: ImageError) => {
						return {
							...error,
							file: files[error.index],
						};
					})
				);

				const train = props.params.train || {};

				const result: ITrainResult = await classifier.current.train({
					...train,
					callbacks: {
						onBatchEnd: async (batch: any, logs: any) => {
							if (train.callbacks && train.callbacks.onBatchEnd) {
								train.callbacks.onBatchEnd(batch, logs);
							}
							const loss = logs.loss ? (logs.loss instanceof Array ? logs.loss : [logs.loss]) : [];
							setLogs({
								...logs,
								loss: loss.concat(logs.loss),
							});

							await nextFrame();
						},
					},
				});

				const {
					history: {
						acc,
						// loss,
					},
				} = result;

				const training = acc[acc.length - 1];

				setStatus("trained");
				setAccuracy({
					...accuracy,
					training,
				});
			}
		},
		[props, files, accuracy, classifier]
	);

	const onParseObject = (origFiles: Array<any>) => {
		let labels = new Array<string>();
		let images = new Array<string>();

		images = origFiles.map((file) => {
			return file.src;
		});
		labels = origFiles.map((file) => {
			return file.label;
		});

		return classifier.current.addData(images, labels, "train");
	};

	const onParseFiles = async (origFiles: FileList) => {
		const imageFiles: IFileData[] = await getFilesAsImageArray(origFiles);

		const { images, labels, files } = await splitImagesFromLabels(imageFiles);
		setFiles(files);

		return classifier.current.addData(images, labels, "train");
	};
	const onAddDataStart = useCallback(
		async (imageSrcs: string[], _labels: any, dataType: string) => {
			setStatus("parsing");

			if (props.onAddDataStart) {
				props.onAddDataStart();
			}

			if (dataType === "train") {
				setStatus("training");
				setImages(imageSrcs);
			}
		},
		[props]
	);

	const classifierOverrides = useMemo(
		() => ({
			onLoadStart: props.onLoadStart,
			onLoadComplete: props.onLoadComplete,
			onClearDataStart: props.onClearDataStart,
			onClearDataComplete: props.onClearDataComplete,
			onTrainStart: props.onTrainStart,
			onTrainComplete: props.onTrainComplete,
			onPredictStart: props.onPredictStart,
			onEvaluateStart: props.onEvaluateStart,
			onEvaluateComplete: props.onEvaluateComplete,
			onSaveStart: props.onSaveStart,
			onSaveComplete: props.onSaveComplete,
			onPredictComplete: onPredictComplete,
			onAddDataStart: onAddDataStart,
			onAddDataComplete: onAddDataComplete,
		}),
		[props, onPredictComplete, onAddDataStart, onAddDataComplete]
	);

	const onDrop = (files: FileList) => {
		setStatus("uploading");
	};
	const onClearPredictions = () => {
		setClassifierData("predictions", []);
	};

	const handleDownload = async () => {
		setDownloading(true);

		await classifier.current.save((props.params || {}).save);

		setDownloading(false);
	};

	useEffect(() => {
		classifier.current = new MLClassifier(classifierOverrides);

		if (getMLClassifier) getMLClassifier(classifier.current);
	}, []);

	return (
		<div className="row align-items-center">
			{(status === "empty" || trainingState === "selection") && (
				<div className={styles.classifierAlt + " col-md-6"}>
					<Dropzone onDrop={onDrop} onParseFiles={onParseFiles} onParseObject={onParseObject} />
				</div>
			)}
			{["training", "uploading", "parsing"].includes(status) && (
				<div className={styles.classifier + " col-md-6"}>
					<TrainingPreview images={images} />
				</div>
			)}

			{status === "trained" && trainingState === "evaluation" && images && (
				<div className={" col-md-12"}>
					<Evaluation
						logs={logs}
						labels={labels}
						downloading={downloading}
						onDownload={showDownload ? handleDownload : undefined}
						predict={predict}
						predictions={predictions}
						accuracy={accuracy}
						errors={errors}
						onButtonClick={onClearPredictions}
					/>
				</div>
			)}
		</div>
	);
};
export default ClassifierCore;
