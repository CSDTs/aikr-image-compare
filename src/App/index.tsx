import * as React from "react";

import styles from "./App.module.scss";
import MLClassifierUI from "../MLClassifierUI";
import Search, { IImage } from "../Search";
import SideNavigation from "../components/SideNavigation";
import ProgressBar from "../components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import Navigation from "../components/Navigation";
import SetSelect from "../components/SetSelect";
import { Accordion, Form, Button, OverlayTrigger, Popover } from "react-bootstrap";
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
	epochs: number;
	batchSize: number;
}

class App extends React.Component {
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

	private handleEpochChange(event: Event | any) {
		this.setState({
			epochs: parseInt(event.target.value),
		});
	}
	private handleBatchSizeChange(event: Event | any) {
		this.setState({
			batchSize: parseInt(event.target.value),
		});
	}
	public render() {
		const processedImages = "My Context Value";
		const currentUserValue = localStorage.getItem("currentUser");
		// if (typeof currentUserValue === "string") {
		// 	// const parse = JSON.parse(value); // ok
		// 	console.log("currentUser: ", JSON.parse(currentUserValue));
		// }
		let trainingState = this.state.trainingState;

		const epochPopover = (
			<Popover id="popover-basic">
				<Popover.Header as="h3">Epoch</Popover.Header>
				<Popover.Body>
					After running all the batches, we have completed one epoch. But random variation helps us to keep discovering
					new weighting strategies (e.g. "weigh green colors high but exclude gummy bear shapes"). So more epochs mean
					that we can increase our chances of an accurate classification. One downside is that it takes a longer time,
					and eventually it will not be adding any accuracy at all. Another downside is that there is no guarantee that
					accuracy will always improve. It is possible for learning to become worse over time.
				</Popover.Body>
			</Popover>
		);

		const batchPopover = (
			<Popover id="popover-basic">
				<Popover.Header as="h3">Batch</Popover.Header>
				<Popover.Body>
					Say you have many samples. We break those into small batches. Then we ask the neural net to make a guess about
					what will be the most important visual features they have in common. If a human was doing it, they might weigh
					the color green more heavily for healthy meals, or shapes associated with boxes more heavily for unhealthy
					means. Because the neural net does not really know anything, and all the visual features are just lists of
					parameters, it can just assign those weights randomly at first and update them as it learns. Each time a batch
					runs, it will turn out that some parameters were more successful at making correct matches. So even though the
					first run is random, the next will be able to make a better guess about which weights to use on each feature.
					These accumulate with each run, in a similar way that Darwin said the most successful mutations would get to
					reproduce in each generation.
				</Popover.Body>
			</Popover>
		);
		return (
			<>
				<Navigation user={currentUserValue}></Navigation>

				<div className={styles.containerBody + " container"}>
					<div className={styles.containerRow + " row"}>
						<div className={`col-lg-2 d-none d-lg-flex ${styles.container__sidenav}`}>
							<SideNavigation />
						</div>
						<div className={`col-lg-10 ${styles.content__container}`}>
							<div className="row  justify-content-between">
								<div className="col-auto">
									<h1 className={`${styles.title}`}>Joe's Lunch</h1>
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
												Select some images for both of the categories: home cooked and factory made foods. Once you do
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
												epochs: this.state.epochs,
											},
											evaluate: {
												batchSize: 32,
											},
											save: {},
										}}
									/>
									{this.state.training === false && (
										<Accordion
											style={{
												width: "276px",
											}}
											className="mx-auto">
											<Accordion.Item eventKey="0">
												<Accordion.Header>Advanced</Accordion.Header>
												<Accordion.Body>
													<Form>
														<Form.Group className="mb-3" controlId="formBasicEmail">
															<OverlayTrigger trigger="click" rootClose placement="right" overlay={batchPopover}>
																<span>
																	Batch: <FontAwesomeIcon icon={faCircleQuestion} className="pe-2 ps-1" />
																</span>
															</OverlayTrigger>{" "}
															<Form.Control
																type="number"
																placeholder="eg. 32"
																defaultValue="32"
																onChange={this.handleBatchSizeChange.bind(this)}
															/>
															<Form.Text className="text-muted">The size of the set used for the training.</Form.Text>
														</Form.Group>
														<Form.Group className="mb-3" controlId="formBasicEmail">
															<OverlayTrigger trigger="click" rootClose placement="right" overlay={epochPopover}>
																<span>
																	Epochs: <FontAwesomeIcon icon={faCircleQuestion} className="pe-2 ps-1" />
																</span>
															</OverlayTrigger>{" "}
															<Form.Control
																type="number"
																placeholder="eg. 20"
																defaultValue="20"
																onChange={this.handleEpochChange.bind(this)}
															/>
															<Form.Text className="text-muted">
																How many times to train each sample in the set.
															</Form.Text>
														</Form.Group>
													</Form>
												</Accordion.Body>
											</Accordion.Item>
										</Accordion>
									)}
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
												</div>
											)}
										</div>
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
