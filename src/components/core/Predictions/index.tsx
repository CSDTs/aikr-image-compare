import * as React from "react";

import { IPrediction } from "../../../types";
import Prediction from "../../PredictionCard";
import EvaluationReadOut from "../EvaluationReadOut";
import styles from "./Predictions.module.scss";
interface IProps {
	predictions: IPrediction[];
	onClick: (val: IPrediction) => void;
}

const Predictions: React.FC<IProps> = ({ predictions, onClick }) => {
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
							<Prediction prediction={prediction} />
						</div>
					);
				})}
			</section>
			<EvaluationReadOut score={((arr.filter((val) => val === true).length / arr.length) * 100).toFixed(1)} />
		</>
	);
};

export default Predictions;
