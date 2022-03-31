import * as React from "react";

import styles from "./App.module.scss";
import MLClassifierUI from "../MLClassifierUI";
import Search, { IImage } from "../Search";
import SideNavigation from "../components/SideNavigation";
import ProgressBar from "../components/ProgressBar";

import Modal from "../components/Modal";
import Navigation from "../components/Navigation";
import SetSelect from "../components/SetSelect";

import { ProgressBar as Progress } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
}

class App extends React.Component {
	public state: IState = {
		training: false,
		evalImages: undefined,
		evaluation: false,
		trainingState: "selection",
	};

	private classifier: any;

	public getMLClassifier = (classifier: any) => {
		this.classifier = classifier;
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

	public render() {
		const processedImages = "My Context Value";
		const currentUserValue = localStorage.getItem("currentUser");
		// if (typeof currentUserValue === "string") {
		// 	// const parse = JSON.parse(value); // ok
		// 	console.log("currentUser: ", JSON.parse(currentUserValue));
		// }
		let trainingState = this.state.trainingState;
		return (
			<>
				<Navigation user={currentUserValue}></Navigation>

				<div className={styles.containerBody + " container"}>
					<div className={styles.containerRow + " row"}>
						<div className={`col-lg-2 d-none d-lg-flex ${styles.container__sidenav}`}>
							<SideNavigation />
						</div>
						<div className={`col-lg-10 ${styles.content__container}`}>
							<h1 className={styles.title}>Joe's Lunch</h1>

							<section className="row">
								<div className="col-md-12">
									<ProgressBar current={this.state.training === false ? 0 : this.state.evaluation === true ? 2 : 1} />

									<div className="row mt-4" hidden={this.state.training === true}>
										<div className="col-md-6">
											<SetSelect label="Home Cooked" currentGroup="good"></SetSelect>
										</div>
										<div className="col-md-6">
											<SetSelect label="Factory Made" currentGroup="bad"></SetSelect>
										</div>
									</div>

									{this.state.training === false && (
										<div className={`${styles.info} mt-4 col-md-12`}>
											<p>
												Select some images for each of the classes: home cooked and factory made foods. Once you do
												that, you can start training your model!
											</p>
										</div>
									)}
								</div>

								<div className="col-md-8 align-self-center mx-auto mt-3">
									<MLClassifierUI
										getMLClassifier={this.getMLClassifier}
										onAddDataStart={this.onBeginTraining}
										onTrainComplete={this.onTrainComplete}
										showDownload={!SHOW_DOWNLOAD}
										trainingState={trainingState}
										params={{
											train: {
												epochs: 20,
											},
											evaluate: {
												batchSize: 32,
											},
											save: {},
										}}
									/>
								</div>

								<div className="col-md-4" hidden>
									<div className={styles.classifierContainer}>
										<div className={`row ${SHOW_HELP ? null : styles.center}`}>
											<div className={`${styles.app} ${SHOW_HELP ? null : styles.centeredApp}`}></div>
											{SHOW_HELP && this.state.training === false && (
												<div className={styles.info}>
													<p>Drag and drop some labeled images below to begin training your classifier. </p>
													<p>
														<em>Organize your images into folders, where the folders' names are the desired labels.</em>
													</p>
													{/* <div className={styles.imgContainer}>
                <img src="https://github.com/thekevinscott/ml-classifier-ui/raw/master/example/public/example-600.gif" />
              </div> */}
												</div>
											)}
										</div>
										{/* {SHOW_HELP && this.state.training === false && (
          <React.Fragment>
            <hr />
            <div className={styles.info}>
              <p>
                Don't have any images handy? Search below for some images.
                Select up to 10 that match your query.
              </p>
              <p>
                <em>
                  <strong>Note</strong> This can be a little buggy at the moment
                  due to CORS issues. Working on making it better!
                </em>
              </p>
            </div>
            <Search train={this.train} />
          </React.Fragment>
        )} */}
									</div>
								</div>
							</section>
						</div>

						<Modal />
					</div>
				</div>
			</>
		);
	}
}

export default App;
