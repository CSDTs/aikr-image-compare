import { FC } from "react";

import styles from "../styles/Predictions.module.css";
import { type Prediction } from "../types";
import { parseLabel } from "../utils/parseLabel";

type Props = {
	prediction: Prediction;
};

const PredictionCard: FC<Props> = ({ prediction: { src, prediction, label } }) => {
	const updatedPrediction = parseLabel(prediction);
	const updatedLabel = parseLabel(label);

	return (
		<div className="my-2">
			<img src={src} className="w-100 d-flex justify-content-center mx-auto " alt="" />
			<p className={updatedPrediction === updatedLabel ? styles.match : styles.noMatch}>{updatedPrediction}</p>
		</div>
	);
};

export default PredictionCard;
