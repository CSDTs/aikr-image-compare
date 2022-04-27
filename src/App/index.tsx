import * as React from "react";

import styles from "./App.module.scss";
import MLClassifierUI from "../MLClassifierUI";
import Search, { IImage } from "../Search";
import SideNavigation from "../components/SideNavigation";
import ProgressBar from "../components/ProgressBar";

import Modal from "../components/Modal";
import AdvancedAccordion from "../components/AdvancedAccordion";
import MainNavigation from "../components/MainNavigation";
import DataSelection from "../components/DataSelection";

import { Accordion, Form, Button, OverlayTrigger, Popover } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { compareSets } from "./datasets";

const CORS_BYPASS = "https://fast-cove-30289.herokuapp.com/";

const qs: {
	SHOW_HELP?: string;
	SHOW_DOWNLOAD?: string;
} = (window.location.search.split("?").pop() || "")
	.split("&")
	.filter((p) => p)
	.map((p) => p.split("="))
	.reduce(
		(obj, [key, val]) => ({
			...obj,
			[key]: val === "1" || val === "true" ? true : false,
		}),
		{}
	);

const SHOW_HELP = qs.SHOW_HELP !== undefined ? qs.SHOW_HELP : true;
const SHOW_DOWNLOAD = qs.SHOW_DOWNLOAD !== undefined ? qs.SHOW_DOWNLOAD : true;

const splitImagesFromLabels = async (images: IImage[]) => {
	const origData: {
		images: string[];
		labels: string[];
	} = {
		images: [],
		labels: [],
	};

	return images.reduce(
		(data, image: IImage) => ({
			images: data.images.concat(`${CORS_BYPASS}${image.src}`),
			// images: data.images.concat(`${image.src}`),
			labels: data.labels.concat(image.label),
		}),
		origData
	);
};

interface IState {
	training: boolean;
	evalImages?: IImage[];
	evaluation: boolean;
	trainingState: string;
	epochs: number;
	batchSize: number;
}

interface IProps {
	dataType?: string;
}
class App extends React.Component<IProps> {
	// constructor(props: IProps) {
	// 	super(props);
	// }
	public state: IState = {
		training: false,
		evalImages: undefined,
		evaluation: false,
		trainingState: "selection",
		epochs: 20,
		batchSize: 32,
	};

	private classifier: any;

	public getMLClassifier = (classifier: any) => {
		this.classifier = classifier;
	};

	public restartTraining = () => {
		this.setState({
			training: false,
			evaluation: false,
			trainingState: "selection",
		});
	};

	public onBeginTraining = () => {
		this.setState({
			training: true,
			trainingState: "training",
		});
	};

	public train = async (trainImages: IImage[], evalImages?: IImage[]) => {
		this.onBeginTraining();
		const { images, labels } = await splitImagesFromLabels(trainImages);

		this.setState({
			evalImages,
		});

		await this.classifier.addData(images, labels, "train");
	};

	public onTrainComplete = async () => {
		this.setState({
			evaluation: true,
			trainingState: "evaluation",
		});
		if (this.state.evalImages && this.state.evalImages.length) {
			const { images, labels } = await splitImagesFromLabels(this.state.evalImages);

			for (let i = 0; i < images.length; i++) {
				const src = images[i];
				const label = labels[i];

				this.classifier.predict(src, label);

				// const prediction = await this.predictSingleImage(src, label);
				// callback({
				//   src,
				//   label,
				//   prediction,
				// });
			}

			// return await this.classifier.addData(images, labels, 'eval');
		}
	};

	// Handles user input for epoch and batch size
	private handleFieldChange(field: string, value: number) {
		this.setState({ [field]: value });
	}

	public render() {
		let trainingState = this.state.trainingState;

		const dataTy = this.props?.dataType || "lunch";

		let comparisonData = {
			title: "Classification with AI",
			homepagePrompt: "",
			groupALabel: "A",
			groupADataset: [],
			groupBLabel: "B",
			groupBDataset: [],
			validationPool: [],
			promptTitle: "",
			promptBody: "",
		};
		Object.assign(comparisonData, compareSets[dataTy]);

		return (
			<>
				<MainNavigation user={localStorage.getItem("currentUser")}></MainNavigation>

				<div className={`${styles.containerBody} container`}>
					<div className={`${styles.containerRow} row`}>
						<div className={`col-lg-2 d-none d-lg-flex ${styles.container__sidenav}`}>
							<SideNavigation />
						</div>
						<div className={`col-lg-10 ${styles.content__container}`}>
							<div className="row justify-content-between">
								<div className="col-auto">
									<h1 className={`${styles.title}`}>{comparisonData.title} </h1>
								</div>

								{this.state.trainingState === "evaluation" && (
									<div className="col-auto align-self-center">
										<button className="btn btn-secondary" onClick={this.restartTraining}>
											Retrain Model
										</button>
									</div>
								)}
							</div>

							<section className="row">
								<div className="col-md-12">
									<ProgressBar current={this.state.training === false ? 0 : this.state.evaluation === true ? 2 : 1} />

									{this.state.training === false && (
										<div className={`${styles.info} my-5 col-md-10 mx-auto`}>
											<p className="mx-auto">{comparisonData.homepagePrompt}</p>
										</div>
									)}

									<div className="row mt-4 justify-content-center" hidden={this.state.training === true}>
										<div className="col-md-5">
											<DataSelection
												label={comparisonData.groupALabel}
												currentGroup="good"
												dataset={comparisonData.groupADataset}
												mode="training"
											/>
										</div>
										<div className="col-md-5">
											<DataSelection
												label={comparisonData.groupBLabel}
												currentGroup="bad"
												dataset={comparisonData.groupBDataset}
												mode="training"
											/>
										</div>
									</div>
								</div>

								<div className="col-md-12 align-self-center mx-auto mt-5">
									<MLClassifierUI
										getMLClassifier={this.getMLClassifier}
										onAddDataStart={this.onBeginTraining}
										onTrainComplete={this.onTrainComplete}
										showDownload={!SHOW_DOWNLOAD}
										trainingState={trainingState}
										params={{
											train: {
												epochs: this.state.epochs,
											},
											evaluate: {
												batchSize: this.state.batchSize,
											},
											save: {},
										}}
										appValidationPool={comparisonData.validationPool}
									/>

									{this.state.training === false && <AdvancedAccordion onChange={this.handleFieldChange.bind(this)} />}
								</div>
							</section>
						</div>

						<Modal title={comparisonData.promptTitle} prompt={comparisonData.promptBody} />
					</div>
				</div>
			</>
		);
	}
}

export default App;
