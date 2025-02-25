import "bootstrap/dist/css/bootstrap.min.css";
import { FC, useEffect, useState } from "react";
import AdvancedAccordion from "./components/advanced-accordion";
import DataSelection from "./components/data-selection";
import IntroDialog from "./components/intro-dialog";
import MLClassifierUI from "./components/ml-classifier-ui";
// import ProgressBar from "./components/progress-bar";÷
import ProgressBarUpdated from "./components/progress-bar-updated";
import { compareSets } from "./data/datasets";
import styles from "./styles/App.module.css";
import { type Image } from "./types";

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
			[key as string]: val === "1" || val === "true" ? true : false,
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
			labels: data.labels.concat(image.label),
		}),
		origData
	);
};

interface Props {
	dataType?: string;
}

const App: FC<Props> = ({ dataType = "lunch" }) => {
	const [state, setState] = useState({
		training: false,
		evalImages: undefined as Image[] | undefined,
		evaluation: false,
		trainingState: "selection",
		epochs: 20,
		batchSize: 32,
		groupAImages: [] as any[],
		groupBImages: [] as any[],
	});

	let classifier: any;

	const getMLClassifier = (classifierInstance: any) => {
		classifier = classifierInstance;
	};

	const restartTraining = () => {
		setState((prev) => ({
			...prev,
			training: false,
			evaluation: false,
			trainingState: "train",
		}));
	};

	const onBeginTraining = () => {
		setState((prev) => ({
			...prev,
			training: true,
			trainingState: "training",
		}));
	};

	const onReadyToTrain = () => {
		setState((prev) => ({
			...prev,
			trainingState: "train",
		}));
	};

	const onSelectImages = () => {
		setState((prev) => ({
			...prev,
			trainingState: "selection",
		}));
	};

	// const train = async (trainImages: Image[], evalImages?: Image[]) => {
	// 	onBeginTraining();
	// 	const { images, labels } = await splitImagesFromLabels(trainImages);

	// 	setState((prev) => ({
	// 		...prev,
	// 		evalImages,
	// 	}));

	// 	await classifier.addData(images, labels, "train");
	// };

	const onTrainComplete = async () => {
		setState((prev) => ({
			...prev,
			evaluation: true,
			trainingState: "evaluation",
		}));

		if (state.evalImages && state.evalImages.length) {
			const { images, labels } = await splitImagesFromLabels(state.evalImages);

			for (let i = 0; i < images.length; i++) {
				const src = images[i];
				const label = labels[i];
				classifier.predict(src, label);
			}
		}
	};

	const handleFieldChange = (field: string, value: string) => {
		setState((prev) => ({
			...prev,
			[field]: Number(value),
		}));
	};

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

	Object.assign(comparisonData, compareSets[dataType as keyof typeof compareSets]);

	useEffect(() => {
		console.log(state);
		if (state.trainingState === "selection" || state.trainingState === "train") {
			if (state.groupAImages.length > 0 && state.groupBImages.length > 0) {
				onReadyToTrain();
			} else {
				onSelectImages();
			}
		}
	}, [state.trainingState, state.groupAImages.length, state.groupBImages.length]);

	const updateSelectedImages = (groupA: any[], groupB: any[]) => {
		setState((prev) => ({
			...prev,
			groupAImages: groupA,
			groupBImages: groupB,
		}));
	};

	return (
		<>
			<div className={`${styles.containerBody} container`}>
				<div className={`${styles.containerRow} row`}>
					<div className={`col-lg-10 mx-auto ${styles.content__container}`}>
						<div className="row justify-content-between">
							<div className="col-auto pl-4">
								<h1 className={`${styles.title}`}>
									{comparisonData.title}{" "}
									{state.training === false
										? state.groupAImages.length === 0 || state.groupBImages.length === 0
											? "1: Select Images"
											: state.groupAImages.length > 0 && state.groupBImages.length > 0
											? "2: Train Model"
											: "1: Select Images"
										: state.evaluation === true
										? "3: Evaluate Images"
										: "2: Train Model"}
								</h1>
							</div>

							{state.trainingState === "evaluation" && (
								<div className="col-auto align-self-center">
									<button className="btn btn-secondary" onClick={restartTraining}>
										Retrain Model
									</button>
								</div>
							)}
						</div>

						<section className="row">
							<div className="col-md-12">
								{/* <ProgressBar current={state.training === false ? 0 : state.evaluation === true ? 2 : 1} /> */}
								<ProgressBarUpdated
									current={
										state.training === false
											? state.groupAImages.length === 0 || state.groupBImages.length === 0
												? 0
												: state.groupAImages.length > 0 && state.groupBImages.length > 0
												? 1
												: 0
											: state.evaluation === true
											? 2
											: 1
									}
								/>

								{state.training === false && (
									<div className={`${styles.info} mt-2 mb-4 col-md-12  mx-auto`}>
										<p className="mx-auto text-center">{comparisonData.homepagePrompt}</p>
									</div>
								)}

								<div className="row mt-4 mb-3 justify-content-center" hidden={state.training === true}>
									<div className="col-md-6">
										<DataSelection
											label={
												state.trainingState === "evaluation"
													? `Select ${comparisonData.groupALabel} test image`
													: `Select ${comparisonData.groupALabel} training image`
											}
											currentGroup="good"
											dataset={comparisonData.groupADataset}
											mode="training"
											onImagesSelected={(images) => {
												setState((prev) => ({
													...prev,
													groupAImages: images,
												}));
											}}
										/>
									</div>
									<div className="col-md-6">
										<DataSelection
											label={
												state.trainingState === "evaluation"
													? `Select ${comparisonData.groupBLabel} test image`
													: `Select ${comparisonData.groupBLabel} training image`
											}
											currentGroup="bad"
											dataset={comparisonData.groupBDataset}
											mode="training"
											onImagesSelected={(images) => {
												setState((prev) => ({
													...prev,
													groupBImages: images,
												}));
											}}
										/>
									</div>
								</div>
							</div>

							<div className="col-md-12 align-self-center mx-auto mt-2">
								<MLClassifierUI
									getMLClassifier={getMLClassifier}
									onAddDataStart={onBeginTraining}
									onTrainComplete={onTrainComplete}
									showDownload={!SHOW_DOWNLOAD}
									trainingState={state.trainingState}
									params={{
										train: {
											epochs: state.epochs,
										},
										evaluate: {
											batchSize: state.batchSize,
										},
										save: {},
									}}
									appValidationPool={comparisonData.validationPool}
									uploadFormat="image/*"
									imagesFormats={[".jpg", ".jpeg", ".png"]}
									onImagesUpdate={state.trainingState === "train" ? updateSelectedImages : undefined}
								/>

								{state.training === false && state.trainingState !== "selection" && (
									<AdvancedAccordion onChange={handleFieldChange} />
								)}
							</div>
						</section>
					</div>

					<IntroDialog title={comparisonData.promptTitle} prompt={comparisonData.promptBody} />
				</div>
			</div>
		</>
	);
};

export default App;
