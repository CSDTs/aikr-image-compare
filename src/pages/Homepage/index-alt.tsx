// import * as React from "react";
// import ClassifierCore from "../../components/core/ClassifierCore";
// import { IImage } from "../../components/core/Search";
// import ImageSelection from "../../components/ml/ImageSelection";
// import AdvancedAccordion from "../../components/ui/AdvancedOptions";
// import MainNavigation from "../../components/ui/MainNavigation";
// import Modal from "../../components/ui/ModalPrompt";
// import ProgressBar from "../../components/ui/ProgressBar";
// import SideNavigation from "../../components/ui/SideNavigation";
// import { useBearStore } from "../../store";

// import { imageCompareDataSets } from "../../data";
// import { qs, querySearch } from "../../utils/getSearchParams";

// import "bootstrap/dist/css/bootstrap.min.css";
// import styles from "./App.module.scss";

// const CORS_BYPASS = "https://fast-cove-30289.herokuapp.com/"; // Heroku app to bypass CORS
// const SHOW_DOWNLOAD = qs.SHOW_DOWNLOAD !== undefined ? qs.SHOW_DOWNLOAD : true;

// // Based on url param, for workbooks
// const embedded = querySearch.embedded;

// // Based on url param, switch to existing dataset or default to Joes Lunch
// const dataset = querySearch.dataset || "lunch";

// const splitImagesFromLabels = async (images: IImage[]) => {
// 	const origData: {
// 		images: string[];
// 		labels: string[];
// 	} = {
// 		images: [],
// 		labels: [],
// 	};

// 	return images.reduce(
// 		(data, image: IImage) => ({
// 			images: data.images.concat(`${CORS_BYPASS}${image.src}`),
// 			labels: data.labels.concat(image.label),
// 		}),
// 		origData
// 	);
// };

// interface IState {
// 	training: boolean;
// 	evalImages?: IImage[];
// 	evaluation: boolean;
// 	trainingState: string;
// 	epochs: number;
// 	batchSize: number;
// }

// interface IProps {
// 	dataType?: string;
// }
// class App extends React.Component<IProps> {
// 	public state: IState = {
// 		training: false,
// 		evalImages: undefined,
// 		evaluation: false,
// 		trainingState: "selection",
// 		epochs: 20,
// 		batchSize: 32,
// 	};

// 	private classifier: any;

// 	public getMLClassifier = (classifier: any) => {
// 		this.classifier = classifier;
// 	};

// 	public restartTraining = () => {
// 		this.setState({
// 			training: false,
// 			evaluation: false,
// 			trainingState: "selection",
// 		});
// 	};

// 	public onBeginTraining = () => {
// 		this.setState({
// 			training: true,
// 			trainingState: "training",
// 		});
// 	};

// 	public train = async (trainImages: IImage[], evalImages?: IImage[]) => {
// 		this.onBeginTraining();
// 		const { images, labels } = await splitImagesFromLabels(trainImages);

// 		this.setState({
// 			evalImages,
// 		});

// 		await this.classifier.addData(images, labels, "train");
// 	};

// 	public onTrainComplete = async () => {
// 		this.setState({
// 			evaluation: true,
// 			trainingState: "evaluation",
// 		});
// 		if (this.state.evalImages && this.state.evalImages.length) {
// 			const { images, labels } = await splitImagesFromLabels(this.state.evalImages);

// 			for (let i = 0; i < images.length; i++) {
// 				const src = images[i];
// 				const label = labels[i];

// 				this.classifier.predict(src, label);
// 			}
// 		}
// 	};

// 	// Given a field and value, sets state (useful for epoch and batch size)
// 	private handleFieldChange(field: string, value: number) {
// 		this.setState({ [field]: value });
// 	}

// 	public render() {
// 		let trainingState = this.state.trainingState;

// 		const dataType = dataset in imageCompareDataSets ? dataset : "lunch";

// 		let comparisonData = {
// 			title: "Classification with AI",
// 			homepagePrompt: "",
// 			groupALabel: "A",
// 			groupADataset: [],
// 			groupBLabel: "B",
// 			groupBDataset: [],
// 			validationPool: [],
// 			promptTitle: "",
// 			promptBody: "",
// 			embeddedPool: {},
// 			corporateScoreA: [1, 1, 1],
// 			corporateScoreB: [1, 1, 1],
// 		};
// 		Object.assign(comparisonData, imageCompareDataSets[dataType]);

// 		return (
// 			<>
// 				{!embedded && <MainNavigation user={localStorage.getItem("currentUser")}></MainNavigation>}

// 				<div className={`${styles.containerBody} container`}>
// 					<div className={`${!embedded ? styles.containerRow : "justify-content-center"} row`}>
// 						{!embedded && (
// 							<div className={`col-lg-2 d-none d-lg-flex ${styles.container__sidenav}`}>
// 								<SideNavigation />
// 							</div>
// 						)}

// 						<div className={`col-lg-10 ${!embedded ? styles.content__container : ""}`}>
// 							<div className="row justify-content-between">
// 								<div className="col-auto">
// 									<h1 className={`${styles.title}`}>{comparisonData.title}</h1>
// 								</div>

// 								{this.state.trainingState === "evaluation" && (
// 									<div className="col-auto align-self-center">
// 										<button className="btn btn-secondary" onClick={this.restartTraining}>
// 											Retrain Model
// 										</button>
// 									</div>
// 								)}
// 							</div>

// 							<section className="row">
// 								<div className="col-md-12">
// 									<ProgressBar current={this.state.training === false ? 0 : this.state.evaluation === true ? 2 : 1} />

// 									{this.state.training === false && (
// 										<div className={`${styles.info} my-5 col-md-10 mx-auto`}>
// 											<p className="mx-auto">{comparisonData.homepagePrompt}</p>
// 										</div>
// 									)}
// 									<div className="row mt-4 justify-content-center" hidden={this.state.training === true}>
// 										<div className="col-md-5">
// 											<ImageSelection
// 												label={comparisonData.groupALabel}
// 												set={comparisonData.groupADataset}
// 												selectCallback={console.log}
// 												mode="Training"
// 												score={comparisonData.corporateScoreA}
// 											/>
// 										</div>

// 										<div className="col-md-5">
// 											<ImageSelection
// 												label={comparisonData.groupBLabel}
// 												set={comparisonData.groupBDataset}
// 												selectCallback={console.log}
// 												mode="Training"
// 												score={comparisonData.corporateScoreB}
// 											/>
// 										</div>
// 									</div>
// 								</div>

// 								<div className="col-md-12 align-self-center mx-auto mt-5">
// 									<ClassifierCore
// 										getMLClassifier={this.getMLClassifier}
// 										onAddDataStart={this.onBeginTraining}
// 										onTrainComplete={this.onTrainComplete}
// 										showDownload={!SHOW_DOWNLOAD}
// 										trainingState={trainingState}
// 										params={{
// 											train: {
// 												epochs: this.state.epochs,
// 											},
// 											evaluate: {
// 												batchSize: this.state.batchSize,
// 											},
// 											save: {},
// 										}}
// 										appValidationPool={comparisonData.validationPool}
// 									/>

// 									{/* {this.state.training === false && <AdvancedAccordion onChange={this.handleFieldChange.bind(this)} />} */}
// 								</div>
// 							</section>
// 						</div>

// 						<Modal title={comparisonData.promptTitle} prompt={comparisonData.promptBody} />
// 					</div>
// 				</div>
// 			</>
// 		);
// 	}
// }

// // export default App;

// //TODO Fix batch and epoch
