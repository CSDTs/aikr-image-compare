import { FC } from "react";
import { IPrediction } from "../../../types";
import styles from "../Evaluation.module.scss";

interface IProps {
	prediction: IPrediction;
}

const PredictionCard: FC<IProps> = (props) => {
	const { src, prediction, label } = props.prediction;
	return (
		<div className={`my-2 ${styles.prediction_card}`}>
			<img
				src={src}
				className="w-100 d-flex justify-content-center mx-auto "
				alt={`${label} predicted as ${prediction}`}
			/>
			<p className={prediction === label ? styles.match : styles.noMatch}>{prediction}</p>
		</div>
	);
};

export default PredictionCard;