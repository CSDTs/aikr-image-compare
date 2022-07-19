import { Popover, OverlayTrigger } from "react-bootstrap";

import styles from "./PredictionData.module.scss";

const surePopover = (
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

export default function PredictionData(props) {
	let label = props.prediction.label;
	let src = props.prediction.src;
	let score = props.prediction.score;
	let prediction = props.prediction.prediction;

	return (
		<>
			{props.prediction.score && (
				<article>
					<p className="text-center">
						Is it <strong>{label}</strong>?
					</p>

					<p>Category Probability: </p>
					<p>
						Your model is <span>{score[1] === label ? score[0] : score[2]}%</span>{" "}
						<OverlayTrigger trigger="click" rootClose placement="right" overlay={surePopover}>
							<span className={styles.sureLink}>sure</span>
						</OverlayTrigger>{" "}
						it is {label} and{" "}
					</p>
					<p>
						is <span>{score[1] === label ? score[2] : score[0]}%</span>{" "}
						<OverlayTrigger trigger="click" rootClose placement="right" overlay={surePopover}>
							<span className={styles.sureLink}>sure</span>
						</OverlayTrigger>{" "}
						it is {score[1] === label ? score[3] : score[1]}
					</p>

					<img src={src} className="w-75 d-flex justify-content-center mx-auto my-2" alt="" />
					<p className="mb-0">Predicted as: {prediction} </p>
				</article>
			)}

			{!props.prediction.score && (
				<section>
					<p className="text-center">Click on an image to view its stats.</p>
				</section>
			)}
		</>
	);
}
