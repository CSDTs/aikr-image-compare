import { FC } from "react";
import styles from "../styles/Predictions.module.css";
import PredictionCard from "./prediction-card";

import { type Prediction } from "../types";

type Props = {
	predictions: Prediction[];
	onClick: (val: Prediction) => void;
};

const PredictionList: FC<Props> = ({ predictions, onClick }) => {
	const handleOnClick = (val: Prediction) => onClick(val);

	return (
		<section className={`row ${styles.predictionRow}`}>
			{predictions.map((prediction: Prediction, idx: number) => (
				<div
					className="col-md-4"
					key={idx}
					onClick={() => {
						handleOnClick(prediction);
					}}>
					<PredictionCard prediction={prediction} key={idx} />
				</div>
			))}
		</section>
	);
};

export default PredictionList;
