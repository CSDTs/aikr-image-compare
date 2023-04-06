import * as React from "react";

import { IPrediction } from "../../../types";
import styles from "../Evaluation.module.scss";
import PredictionCard from "./PredictionCard";
import ResultsSummary from "./ResultsSummary";
interface IProps {
	predictions: IPrediction[];
	onClick: (val: IPrediction) => void;
}

const PredictionGrid: React.FC<IProps> = ({ predictions, onClick }) => {
	const handleOnClick = (val: IPrediction) => {
		onClick(val);
	};

	let arr: boolean[] = [];

	return (
		<>
			<section className={`row ${styles.predictionRow}`}>
				{predictions.map((prediction: IPrediction, idx: number) => {
					let temp = prediction.label === prediction.prediction;
					arr.push(temp);

					return (
						<div
							key={idx}
							className="col-md-4"
							onClick={() => {
								handleOnClick(prediction);
							}}>
							<PredictionCard prediction={prediction} />
						</div>
					);
				})}
			</section>
			<ResultsSummary score={((arr.filter((val) => val === true).length / arr.length) * 100).toFixed(1)} />
		</>
	);
};

export default PredictionGrid;
