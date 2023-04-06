import React, { useEffect, useRef, useState } from "react";

import ImageSelection from "../../components/core/ImageSelection";

import { MainNavigation, ModalPrompt, ProgressBar, SideNavigation } from "../../components/ui";
import { useDataStore } from "../../store";

import { imageCompareDataSets } from "../../data/";
import { qs, querySearch } from "../../utils/getSearchParams";

import "bootstrap/dist/css/bootstrap.min.css";
import ClassifierCore from "../../components/core/ClassifierCore/ClassifierCore";

import styles from "./App.module.scss";
const SHOW_DOWNLOAD = qs.SHOW_DOWNLOAD !== undefined ? qs.SHOW_DOWNLOAD : true;

// Based on url param, for workbooks
const embedded = querySearch.embedded;

// Based on url param, switch to existing dataset or default to Joes Lunch
const dataset = querySearch.dataset || "lunch";

interface IProps {
	dataType?: string;
}
const App: React.FC<IProps> = () => {
	const [training, setTraining] = useState<boolean>(false);

	const [evaluation, setEvaluation] = useState<boolean>(false);
	const [trainingState, setTrainingState] = useState<string>("selection");
	const [epochs, setEpochs] = useState<number>(20);
	const [batchSize, setBatchSize] = useState<number>(32);
	const setData = useDataStore((state) => state.setData);
	const data = useDataStore((state) => state.data);

	useEffect(() => {
		setData(dataset in imageCompareDataSets ? imageCompareDataSets[dataset] : imageCompareDataSets["lunch"]);
	}, [setData]);

	const classifierRef = useRef<any>(null);

	const getMLClassifier = (classifier: any) => {
		classifierRef.current = classifier;
	};

	const restartTraining = () => {
		setTraining(false);
		setEvaluation(false);
		setTrainingState("selection");
	};

	const onBeginTraining = () => {
		setTraining(true);
		setTrainingState("training");
	};

	const onTrainComplete = async () => {
		setEvaluation(true);
		setTrainingState("evaluation");
	};

	if (data?.header !== null)
		return (
			<>
				{!embedded && <MainNavigation user={localStorage.getItem("currentUser")}></MainNavigation>}

				<div className={`${styles.containerBody} container`}>
					<div className={`${!embedded ? styles.containerRow : "justify-content-center"} row`}>
						{!embedded && <SideNavigation />}

						<div className={`col-lg-10 ${!embedded ? styles.content__container : ""}`}>
							<div className="row justify-content-between">
								<div className="col-auto">
									<h1 className={`${styles.title}`}>{data["header"]}</h1>
								</div>

								{trainingState === "evaluation" && (
									<div className="col-auto align-self-center">
										<button className="btn btn-secondary" onClick={restartTraining}>
											Retrain Model
										</button>
									</div>
								)}
							</div>

							<section className="row">
								<div className="col-md-12">
									<ProgressBar current={training === false ? 0 : evaluation === true ? 2 : 1} />

									{training === false && (
										<div className={`${styles.info} my-5 col-md-10 mx-auto`}>
											<p className="mx-auto">{data["homepage_prompt"]}</p>
										</div>
									)}
									<div className="row mt-4 justify-content-center" hidden={training === true}>
										<div className="col-md-5">
											<ImageSelection set={"group_a"} mode="Training" />
										</div>

										<div className="col-md-5">
											<ImageSelection set={"group_b"} mode="Training" />
										</div>
									</div>
								</div>

								<div className="col-md-12 align-self-center mx-auto mt-5">
									<ClassifierCore
										getMLClassifier={getMLClassifier}
										onAddDataStart={onBeginTraining}
										onTrainComplete={onTrainComplete}
										showDownload={!SHOW_DOWNLOAD}
										trainingState={trainingState}
										params={{
											train: {
												epochs,
											},
											evaluate: {
												batchSize,
											},
											save: {},
										}}
									/>
								</div>
							</section>
						</div>

						<ModalPrompt />
					</div>
				</div>
			</>
		);
	else return <p>Loading..</p>;
};

export default App;
