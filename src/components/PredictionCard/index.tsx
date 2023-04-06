import { FC } from "react";
import { IPrediction } from "../../types";
import styles from "./PredictionCard.module.scss";

interface IProps {
	prediction: IPrediction;
}

const PredictionCard: FC<IProps> = (props) => {
	const { src, prediction, label } = props.prediction;
	return (
		<div className="my-2">
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
