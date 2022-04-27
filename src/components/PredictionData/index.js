import React from "react";
import { Carousel, ProgressBar, Popover, OverlayTrigger } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PredictionData.module.css";
class PredictionData extends React.Component {
	constructor(props) {
		super(props);

		// this.state = {
		// 	currentGroup: "",
		// 	label: "",
		// };
	}

	// componentDidMount() {
	// 	this.setState({ currentGroup: this.props.dataset });
	// }

	render() {
		const popover = (
			<Popover id="popover-basic">
				<Popover.Header as="h3">Sure</Popover.Header>
				<Popover.Body>
					This machine learning model learns a boundary that helps separate where home cooked and factory made meals
					tend to lie. Any given meal might lie more towards the home cooked or the factory made meal side. Where the
					meal falls is translated into how well it "fits" each side and is given as two "sureness" percentages. A
					decision rule is needed to interpret the "sureness" and decide which kind of meal your image is. Given these
					two fits, what boundary would you use to decide what category of meal it is? Some people use 50% as their
					boundary line.
				</Popover.Body>
			</Popover>
		);

		let label = this.props.prediction.label;
		let src = this.props.prediction.src;
		let score = this.props.prediction.score;
		let prediction = this.props.prediction.prediction;
		let textContent = (
			<section>
				<p className="text-center">Click on an image to view its stats.</p>
			</section>
		);
		if (score) {
			textContent = (
				<article>
					<p className="text-center">
						Is it <strong>{label}</strong>?
					</p>

					<p>Category Probability: </p>
					<p>
						Your model is <span>{score[1] === label ? score[0] : score[2]}%</span>{" "}
						<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
							<span className={styles.sureLink}>sure</span>
						</OverlayTrigger>{" "}
						it is {label} and{" "}
					</p>
					<p>
						is <span>{score[1] === label ? score[2] : score[0]}%</span>{" "}
						<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
							<span className={styles.sureLink}>sure</span>
						</OverlayTrigger>{" "}
						it is {score[1] === label ? score[3] : score[1]}
					</p>

					<img src={src} className="w-75 d-flex justify-content-center mx-auto my-2" alt="" />
					<p className="mb-0">Predicted as: {prediction} </p>
				</article>
			);
		}

		return <>{textContent}</>;
	}
}

export default PredictionData;
