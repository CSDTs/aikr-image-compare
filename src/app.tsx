import * as React from "react";

import MLClassifierUI from "./components/ml-classifier-ui";
import ProgressBar from "./components/progress-bar";
import { type Image } from "./types";

import styles from "./styles/App.module.css";

import AdvancedAccordion from "./components/advanced-accordion";
import DataSelection from "./components/data-selection";

import IntroDialog from "./components/intro-dialog";

import "bootstrap/dist/css/bootstrap.min.css";

import { compareSets } from "./data/datasets";

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

const SHOW_DOWNLOAD = qs.SHOW_DOWNLOAD !== undefined ? qs.SHOW_DOWNLOAD : true;

const splitImagesFromLabels = async (images: Image[]) => {
	const origData: {
		images: string[];
		labels: string[];
	} = {
		images: [],
		labels: [],
	};

	return images.reduce(
		(data, image: Image) => ({
			images: data.images.concat(`${CORS_BYPASS}${image.src}`),
			// images: data.images.concat(`${image.src}`),
			labels: data.labels.concat(image.label),
		}),
		origData
	);
};

interface IState {
	training: boolean;
	evalImages?: Image[];
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

	public train = async (trainImages: Image[], evalImages?: Image[]) => {
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
	private handleFieldChange(field: string, value: string) {
		this.setState({ [field]: Number(value) });
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
		Object.assign(comparisonData, compareSets[dataTy as keyof typeof compareSets]);

		return (
			<>
				{/* <MainNavigation user={localStorage.getItem("currentUser")}></MainNavigation> */}

				<div className={`${styles.containerBody} container`}>
					<div className={`${styles.containerRow} row`}>
						{/* <div className={`col-lg-2 d-none d-lg-flex ${styles.container__sidenav}`}>
							<SideNavigation />
						</div> */}
						<div className={`col-lg-10 mx-auto ${styles.content__container}`}>
							<div className="row justify-content-between">
								<div className="col-auto pl-4">
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
												label={
													this.state.trainingState === "evaluation"
														? `Select ${comparisonData.groupALabel} test image`
														: `Select ${comparisonData.groupALabel} training image`
												}
												currentGroup="good"
												dataset={comparisonData.groupADataset}
												mode="training"
											/>
										</div>
										<div className="col-md-5">
											<DataSelection
												label={
													this.state.trainingState === "evaluation"
														? `Select ${comparisonData.groupBLabel} test image`
														: `Select ${comparisonData.groupBLabel} training image`
												}
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
										uploadFormat="image/*"
										imagesFormats={[".jpg", ".jpeg", ".png"]}
									/>

									{this.state.training === false && <AdvancedAccordion onChange={this.handleFieldChange.bind(this)} />}
								</div>
							</section>
						</div>

						<IntroDialog title={comparisonData.promptTitle} prompt={comparisonData.promptBody} />
					</div>
				</div>
			</>
		);
	}
}

export default App;
