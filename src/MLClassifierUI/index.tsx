import * as React from "react";

import Dropzone from "../Dropzone";
import { getFilesAsImageArray, IFileData, splitImagesFromLabels } from "../utils/getFilesAsImages";
import nextFrame from "../utils/nextFrame";

import { ITrainResult } from "../types";

import Model from "../Model";
import { ImageError } from "../Model";
import Preview from "../Preview";
import SetSelect from "../components/SetSelect";
// import MLClassifier from "ml-classifier";
import MLClassifier from "../MLClassifier";

import styles from "./MLClassifierUI.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
export interface IImage {
	imageSrc: string;
	label: string;
}
interface IParams {
	[index: string]: any;
}

interface ImageList {
	[index: number]: {
		file: any;
		label: string;
		src: number;
	};
}

interface IState {
	status: string;
	images?: string[];
	files: any[];
	labels: string[];
	downloading: boolean;
	predictions: {
		src: string;
		prediction: string;
		label: string;
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

class MLClassifierUI extends React.Component<IProps, IState> {
	public static defaultProps: Partial<IProps> = {
		params: {},
		uploadFormat: "nested",
		imagesFormats: undefined,
		showDownload: true,
	};

	private classifier: any;

	constructor(props: IProps) {
		super(props);

		this.state = {
			errors: [],
			files: [],
			status: "empty",
			images: undefined,
			downloading: false,
			predictions: [],
			logs: {},
			labels: [],
			accuracy: {
				training: undefined,
				evaluation: undefined,
			},
		};
	}

	componentDidMount = async () => {
		this.classifier = new MLClassifier({
			onLoadStart: this.props.onLoadStart,
			onLoadComplete: this.props.onLoadComplete,
			onAddDataStart: this.onAddDataStart,
			onAddDataComplete: this.onAddDataComplete,
			onClearDataStart: this.props.onClearDataStart,
			onClearDataComplete: this.props.onClearDataComplete,
			onTrainStart: this.props.onTrainStart,
			onTrainComplete: this.props.onTrainComplete,
			onPredictStart: this.props.onPredictStart,
			onPredictComplete: this.onPredictComplete,
			onEvaluateStart: this.props.onEvaluateStart,
			onEvaluateComplete: this.props.onEvaluateComplete,
			onSaveStart: this.props.onSaveStart,
			onSaveComplete: this.props.onSaveComplete,
		});

		if (this.props.getMLClassifier) {
			this.props.getMLClassifier(this.classifier);
		}
	};

	private onDrop = (files: FileList) => {
		this.setState({
			status: "uploading",
		});
	};

	private onAddDataStart = async (imageSrcs: string[], _labels: any, dataType: string) => {
		this.setState({
			status: "parsing",
		});

		if (this.props.onAddDataStart) {
			this.props.onAddDataStart();
		}

		if (dataType === "train") {
			this.setState({
				status: "training",
				images: imageSrcs,
			});
		}
	};

	private onParseFiles = async (origFiles: FileList) => {
		const imageFiles: IFileData[] = await getFilesAsImageArray(origFiles);

		const { images, labels, files } = await splitImagesFromLabels(imageFiles);

		this.setState({
			files,
		});
		return this.classifier.addData(images, labels, "train");
	};

	private onParseObject = (origFiles: Array<any>) => {
		// const imageFiles: IFileData[] = await getFilesAsImageArray(origFiles);

		let files = new Array<object>();
		let labels = new Array<string>();
		let images = new Array<string>();

		files = origFiles.map((file) => {
			return {
				file: file.file,
				src: file.src,
				path: file.label,
			};
		});
		images = origFiles.map((file) => {
			return file.src;
		});
		labels = origFiles.map((file) => {
			return file.label;
		});

		// const { images, labels, files } = await splitImagesFromLabels(origFiles);

		// this.setState({
		//   files,
		// });

		// let files = [];
		// let images = [];
		// let labels = [];

		// for (let file of origFiles) {

		//   files.push(file.file);
		//   images.push(file.src);
		//   labels.push(file.label);
		// }

		// console.log(images);
		// console.log(labels);
		// console.log(files);

		return this.classifier.addData(images, labels, "train");
	};

	private onAddDataComplete = async (
		imageSrcs: string[],
		labels: string[],
		dataType: string,
		errors?: ImageError[]
	) => {
		if (this.props.onAddDataComplete) {
			this.props.onAddDataComplete(imageSrcs, labels, dataType, errors);
		}
		if (dataType === "train") {
			this.setState({
				status: "training",
				images: imageSrcs,
				labels,
				errors: (errors || []).map((error: ImageError) => {
					return {
						...error,
						file: this.state.files[error.index],
					};
				}),
			});

			const train = this.props.params.train || {};
			const result: ITrainResult = await this.classifier.train({
				...train,
				callbacks: {
					onBatchEnd: async (batch: any, logs: any) => {
						if (train.callbacks && train.callbacks.onBatchEnd) {
							train.callbacks.onBatchEnd(batch, logs);
						}
						const loss = logs.loss.toFixed(5);
						console.log(logs);
						// log(batch, logs);
						// log('Loss is: ' + logs.loss.toFixed(5));
						this.setState({
							logs: {
								...this.state.logs,
								loss: (this.state.logs.loss || []).concat(loss),
							},
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
			this.setState({
				status: "trained",
				accuracy: {
					...this.state.accuracy,
					training,
				},
			});
		}
	};

	public onPredictComplete = async (src: string, label: string, pred: string | number) => {
		if (this.props.onPredictComplete) {
			this.props.onPredictComplete(src, label, pred);
		}
		const prediction = `${pred}`;

		this.setState({
			predictions: this.state.predictions.concat({
				src,
				prediction,
				label,
			}),
		});
	};

	public predict = async (imageFiles: IFileData[]) => {
		for (let i = 0; i < imageFiles.length; i++) {
			const { src, label } = imageFiles[i];

			await this.classifier.predict(src, label);
		}
	};

	handleDownload = async () => {
		this.setState({
			downloading: true,
		});
		await this.classifier.save((this.props.params || {}).save);
		this.setState({
			downloading: false,
		});
	};

	public render() {
		return (
			<div className="row align-items-center">
				{this.state.status === "empty" && (
					<div className={styles.classifier + " col-md-6"}>
						<Dropzone onDrop={this.onDrop} onParseFiles={this.onParseFiles} onParseObject={this.onParseObject} />
					</div>
				)}
				{["training", "uploading", "parsing"].includes(this.state.status) && (
					<div className={styles.classifier + " col-md-6"}>
						<Preview images={this.state.images} />
					</div>
				)}

				{this.state.status === "trained" && this.state.images && (
					<div className={" col-md-12"}>
						<Model
							logs={this.state.logs}
							labels={this.state.labels}
							downloading={this.state.downloading}
							onDownload={this.props.showDownload ? this.handleDownload : undefined}
							predict={this.predict}
							predictions={this.state.predictions}
							accuracy={this.state.accuracy}
							errors={this.state.errors}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default MLClassifierUI;
