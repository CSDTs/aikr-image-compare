import { FC } from "react";

import styles from "../styles/Predictions.module.css";
import { type Prediction } from "../types";

type Props = {
	prediction: Prediction;
};

const PredictionCard: FC<Props> = ({ prediction: { src, prediction, label } }) => {
	const updatedPrediction =
		prediction?.split("Select")?.[1]?.split(" Test Image")?.[0]?.split(" training image")?.[0]?.trim() ?? "";
	const updatedLabel =
		label?.split("Select")?.[1]?.split(" Test Image")?.[0]?.split(" training image")?.[0]?.trim() ?? "";

	return (
		<div className="my-2">
			<img src={src} className="w-100 d-flex justify-content-center mx-auto " alt="" />
			<p className={updatedPrediction === updatedLabel ? styles.match : styles.noMatch}>{updatedPrediction}</p>
		</div>
	);
};

export default PredictionCard;
