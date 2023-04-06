import React, { FC, useCallback } from "react";
import { useClassifierStore } from "../../../store";
import { IPrediction, ImageError } from "../../../types";
import Evaluator from "../Evaluator";
import ImageSelection from "../ImageSelection";

import Metrics, { IDatum } from "../Metrics";
import styles from "./Model.module.scss";

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

	onButtonClick?: () => void;
}

const getEvaluation = (predictions: any[]) => {
	if (predictions.length > 0) {
		return (
			predictions.reduce((sum, { prediction, label }) => sum + (prediction === label ? 1 : 0), 0) / predictions.length
		);
	}
	return null;
};

const Model: FC<IProps> = ({ labels, onDownload, downloading, predict, logs, accuracy: { training }, errors }) => {
	const predictions = useClassifierStore((state) => state.predictions);
	const evaluation = getEvaluation(predictions);

	const accuracyData: IDatum[] = [
		{
			data: training ? `${Math.round(training * 100)}%` : "--",
			label: "Training",
		},
		{
			data: evaluation ? `${Math.round(evaluation * 100)}%` : "--",
			label: "Evaluation",
		},
	];

	return (
		<>
			<div className="row" hidden={predictions.length > 0}>
				<div className="mb-5 col-md-10 mx-auto">
					<p>
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
						accuracy={accuracyData}
						logs={logs}
						errors={errors}
					/>
				</div>
				<div className="col-md-5" hidden={predictions.length > 0}>
					<ImageSelection set={"group_a"} mode="Evaluation" />
				</div>
				<div className="col-md-5" hidden={predictions.length > 0}>
					<ImageSelection set={"group_b"} mode="Evaluation" />
				</div>
			</section>

			<section className="row">
				<div className="col-md-12">{predict && <Evaluator predict={predict} />}</div>
			</section>
		</>
	);
};

export default Model;
