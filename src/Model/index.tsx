import * as React from "react";
import styles from "./Model.module.scss";
import Evaluator from "./Evaluator";
import Metrics from "./Metrics";
import { IDatum } from "./Metrics";
import type { ImageError } from "./Metrics";
import DataSelection from "../components/DataSelection";

import { IPrediction } from "./Evaluator/Predictions/Prediction";
// import {
//   IImageData,
// } from '../utils/getFilesAsImages';

interface IProps {
	labels: string[];
	downloading: boolean;
	onDownload?: Function;
	predict?: Function;
	predictions: IPrediction[];
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
}

interface IState {}

const getEvaluation = (predictions: any[]) => {
	if (predictions.length > 0) {
		return (
			predictions.reduce((sum, { prediction, label }) => sum + (prediction === label ? 1 : 0), 0) / predictions.length
		);
	}

	return null;
};

class Model extends React.Component<IProps, IState> {
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
		// console.log(predict);
		return (
			<>
				<div className="row" hidden={predictions.length > 0}>
					<div className="mb-5 col-md-10 mx-auto">
						<p>
							Now that you have trained your model, let’s test it. You can test just one image or several. The software
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
					<div className="col-md-5" hidden={predictions.length > 0}>
						<DataSelection
							label="Home Cooked"
							currentGroup="all"
							dataset={this.props.appValidationPool}
							mode="validating"
						/>
					</div>
					<div className="col-md-5" hidden={predictions.length > 0}>
						<DataSelection
							label="Factory Made"
							currentGroup="all"
							dataset={this.props.appValidationPool}
							mode="validating"
						/>
					</div>
				</section>

				<section className="row">
					<div className="col-md-12">
						{predict && <Evaluator predict={predict} predictions={predictions} button={refreshPredictions} />}
					</div>
				</section>
			</>
		);
	}
}

export default Model;

export type { ImageError } from "./Metrics";
