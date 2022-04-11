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
	<>
		<section className="px-2 py-2">
			<p className="text-center">
				Is it a <strong>{label}</strong> meal?
			</p>

			<article className={styles.probability}>
				<p>Category probability</p>
				<p>
					Your model is <span>{score[0]}%</span>{" "}
					<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
						<span className={styles.sureLink}>sure</span>
					</OverlayTrigger>{" "}
					it is a {label} meal and{" "}
				</p>
				<p>
					is <span>{score[1]}%</span>{" "}
					<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
						<span className={styles.sureLink}>sure</span>
					</OverlayTrigger>{" "}
					it is a {label.includes("Home") ? "Factory Made" : label.includes("Factory") ? "Home Cooked" : label} meal
				</p>
			</article>

			<article hidden>
				<h4>Confidence Level</h4>
				<div className="row justify-content-between">
					<div className="col-3 text-center">
						<span className="text-center">Yes</span>
					</div>
					<div className="col-9  align-self-center">
						<ProgressBar now={score[0]} label={score[0] + `%`} className={styles.contrastBar} />
					</div>
				</div>
				<div className="row  justify-content-between">
					<div className="col-3  text-center">
						<span>No</span>
					</div>
					<div className="col-9 align-self-center">
						<ProgressBar now={score[1]} label={score[1] + `%`} className={styles.contrastBar} />
					</div>
				</div>
			</article>
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
