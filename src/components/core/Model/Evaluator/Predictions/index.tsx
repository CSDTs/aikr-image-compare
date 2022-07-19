import * as React from "react";
import styles from "./Predictions.module.scss";
import Prediction, { IPrediction } from "./Prediction";
import { Carousel } from "react-bootstrap";
import EvaluationReadOut from "../../../../ml/EvaluationReadOut";
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
							className="col-md-4"
							onClick={() => {
								handleOnClick(prediction);
							}}>
							<Prediction prediction={prediction} key={idx} />
						</div>
					);
				})}
			</section>
			<EvaluationReadOut score={((arr.filter((val) => val === true).length / arr.length) * 100).toFixed(1)} />
		</>
	);
};

export default Predictions;
