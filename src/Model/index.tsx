import * as React from "react";
import styles from "./Model.module.scss";
import Evaluator from "./Evaluator";
import Metrics from "./Metrics";
import { IDatum } from "./Metrics";
import type { ImageError } from "./Metrics";
import SetSelect from "../components/SetSelect";

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
		// console.log(predict);
		return (
			<section className="row">
				<div className={`col-md-6 ${styles.classifier}`}>
					<Metrics
						labels={labels}
						onDownload={onDownload}
						downloading={downloading}
						accuracy={accuracy}
						logs={logs}
						errors={errors}
					/>

					<SetSelect currentGroup="all"></SetSelect>
				</div>
				<div className="col-md-6">{predict && <Evaluator predict={predict} predictions={predictions} />}</div>
			</section>
		);
	}
}

export default Model;

export type { ImageError } from "./Metrics";
