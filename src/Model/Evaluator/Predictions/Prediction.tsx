import * as React from "react";
import styles from "./Predictions.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, ProgressBar, Popover, OverlayTrigger } from "react-bootstrap";

export interface IPrediction {
	prediction: string;
	label: string;
	src: string;
	score: any;
}

interface IProps {
	prediction: IPrediction;
}
const popover = (
	<Popover id="popover-basic">
		<Popover.Header as="h3">Sure</Popover.Header>
		<Popover.Body>
			This machine learning model learns a boundary that helps separate where home cooked and factory made meals tend to
			lie. Any given meal might lie more towards the home cooked or the factory made meal side. Where the meal falls is
			translated into how well it "fits" each side and is given as two "sureness" percentages. A decision rule is needed
			to interpret the "sureness" and decide which kind of meal your image is. Given these two fits, what boundary would
			you use to decide what category of meal it is? Some people use 50% as their boundary line.
		</Popover.Body>
	</Popover>
);

const Prediction: React.SFC<IProps> = ({ prediction: { src, prediction, label, score } }) => (
	<div className="my-2">
		<img src={src} className="w-100 d-flex justify-content-center mx-auto " alt="" />
		<p className={prediction === label ? styles.match : styles.noMatch}>{prediction}</p>
	</div>
);

export default Prediction;
