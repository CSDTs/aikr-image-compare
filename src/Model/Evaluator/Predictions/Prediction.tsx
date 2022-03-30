import * as React from "react";
import styles from "./Predictions.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, ProgressBar } from "react-bootstrap";

export interface IPrediction {
	prediction: string;
	label: string;
	src: string;
}

interface IProps {
	prediction: IPrediction;
}

const Prediction: React.SFC<IProps> = ({ prediction: { src, prediction, label } }) => (
	<>
		<section className="px-2 py-2">
			<p className="text-center">
				Is it a <strong>{label}</strong> meal?
			</p>

			<div className="row justify-content-between">
				<div className="col-3 text-center">
					<span className="text-center">Yes</span>
				</div>
				<div className="col-9  align-self-center">
					<ProgressBar now={prediction === label ? 100 : 0} label={prediction === label ? `100%` : `0%`} />
				</div>
			</div>
			<div className="row  justify-content-between">
				<div className="col-3  text-center">
					<span>No</span>
				</div>
				<div className="col-9 align-self-center">
					<ProgressBar now={prediction === label ? 0 : 100} label={prediction === label ? `0%` : `100%`} />
				</div>
			</div>
		</section>
		<img src={src} className="w-75 d-flex justify-content-center mx-auto my-4" />
		<ul className={styles.info}>
			<li>
				Prediction: <br></br>
				{prediction}
			</li>
			<li className={styles.label}>
				Label: <br></br>
				{label}
			</li>
		</ul>
	</>
);

export default Prediction;
