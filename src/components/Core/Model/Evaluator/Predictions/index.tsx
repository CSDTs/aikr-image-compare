import * as React from "react";
import styles from "./Predictions.module.scss";
import Prediction, { IPrediction } from "./Prediction";
import { Carousel } from "react-bootstrap";
interface IProps {
	predictions: IPrediction[];
	onClick: (val: IPrediction) => void;
}

const Predictions: React.FC<IProps> = ({ predictions, onClick }) => {
	const handleOnClick = (val: IPrediction) => {
		onClick(val);
	};

	return (
		<section className={`row ${styles.predictionRow}`}>
			{predictions.map((prediction: IPrediction, idx: number) => (
				<div
					className="col-md-4"
					onClick={() => {
						handleOnClick(prediction);
					}}>
					<Prediction prediction={prediction} key={idx} />
				</div>
			))}
		</section>
	);
};

export default Predictions;
