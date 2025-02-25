import * as React from "react";
import styles from "../styles/Model.module.css";
import { IDatum, Prediction } from "../types";
import DataSelection from "./data-selection";
import Evaluator from "./evaluator";
import type { ImageError } from "./metrics";
import Metrics from "./metrics";

interface IProps {
	labels: string[];
	downloading: boolean;
	onDownload?: Function;
	predict?: Function;
	predictions: Prediction[];
	errors?: ImageError[];
	logs: {
		[index: string]: any;
	};
	accuracy: {
		training?: number;
		evaluation?: number;
	};
	appValidationPool?: string[];
	onButtonClick?: () => void;
	onImagesUpdate?: (groupA: any[], groupB: any[]) => void;
}

interface IState {
	groupAImages: any[];
	groupBImages: any[];
}

const getEvaluation = (predictions: any[]) => {
	if (predictions.length > 0) {
		return (
			predictions.reduce((sum, { prediction, label }) => sum + (prediction === label ? 1 : 0), 0) / predictions.length
		);
	}

	return null;
};

class Model extends React.Component<IProps, IState> {
	state = {
		groupAImages: [],
		groupBImages: [],
	};

	handleImagesSelected = (group: "A" | "B", images: any[]) => {
		if (group === "A") {
			this.setState({ groupAImages: images });
		} else {
			this.setState({ groupBImages: images });
		}

		if (this.props.onImagesUpdate) {
			this.props.onImagesUpdate(
				group === "A" ? images : this.state.groupAImages,
				group === "B" ? images : this.state.groupBImages
			);
		}
	};

	render() {
		const {
			labels,
			onDownload,
			downloading,
			predict,
			predictions,
			logs,
			accuracy: { training },
			errors,
		} = this.props;

		const { groupAImages, groupBImages } = this.state;
		const hasSelectedImages = groupAImages.length > 0 || groupBImages.length > 0;

		const evaluation = getEvaluation(predictions);

		const accuracy: IDatum[] = [
			{
				data: training ? `${Math.round(training * 100)}%` : "--",
				label: "Training",
			},
			{
				data: evaluation ? `${Math.round(evaluation * 100)}%` : "--",
				label: "Evaluation",
			},
		];

		const refreshPredictions = (
			<button className="btn btn-primary w-100" onClick={this.props.onButtonClick} hidden={predictions.length === 0}>
				Pick New Images
			</button>
		);

		return (
			<>
				<div className="row" hidden={predictions.length > 0}>
					<div className="mb-4 col-md-12  mx-auto">
						<p className="text-center">
							Now that you have trained your model, let's test it. You can test just one image or several. The software
							will keep track of the category label you predicted for each image.
						</p>
					</div>
				</div>

				<section className="row justify-content-center">
					<div className={`col-md-6 ${styles.classifier}`} hidden>
						<Metrics
							labels={labels}
							onDownload={onDownload}
							downloading={downloading}
							accuracy={accuracy}
							logs={logs}
							errors={errors}
						/>
					</div>
					<div className="col-md-6" hidden={predictions.length > 0}>
						<DataSelection
							label="Select Home Cooked Test Image"
							currentGroup="all"
							dataset={this.props.appValidationPool}
							mode="validating"
							onImagesSelected={(images) => this.handleImagesSelected("A", images)}
						/>
					</div>
					<div className="col-md-6" hidden={predictions.length > 0}>
						<DataSelection
							label="Select Factory Made Test Image"
							currentGroup="all"
							dataset={this.props.appValidationPool}
							mode="validating"
							onImagesSelected={(images) => this.handleImagesSelected("B", images)}
						/>
					</div>
				</section>

				<section className="row">
					<div className="col-md-12">
						{predict && hasSelectedImages && (
							<Evaluator predict={predict} predictions={predictions} button={refreshPredictions} />
						)}
					</div>
				</section>
			</>
		);
	}
}

export default Model;
