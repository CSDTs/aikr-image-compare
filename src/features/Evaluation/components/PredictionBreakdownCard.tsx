import React, { FC, useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";

import ToastContainer, { ToastPosition } from "react-bootstrap/ToastContainer";
import styles from "../Evaluation.module.scss";

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

const SurePrompt = () => {
	return <></>;
};
interface Prediction {
	label: string;
	src: string;
	score: string;
	prediction: any;
}
interface IProps {
	predictionData: Prediction;
}
const PredictionBreakdownCard: FC<IProps> = (props) => {
	const { label, src, score, prediction } = props.predictionData;
	const [showA, setShowA] = useState(false);

	const toggleShowA = () => setShowA(!showA);
	return (
		<>
			{score && (
				<article>
					{" "}
					<div aria-live="polite" aria-atomic="true" className="position-relative">
						<ToastContainer position="top-center">
							<Toast show={showA} onClose={toggleShowA} style={{ backgroundColor: `rgba(255,255,255)` }}>
								<Toast.Header>
									<img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
									<strong className="me-auto">Sure</strong>
								</Toast.Header>
								<Toast.Body>
									{" "}
									This machine learning model learns a boundary that helps separate where home cooked and factory made
									meals tend to lie. Any given meal might lie more towards the home cooked or the factory made meal
									side. Where the meal falls is translated into how well it "fits" each side and is given as two
									"sureness" percentages. A decision rule is needed to interpret the "sureness" and decide which kind of
									meal your image is. Given these two fits, what boundary would you use to decide what category of meal
									it is? Some people use 50% as their boundary line.
								</Toast.Body>
							</Toast>
						</ToastContainer>{" "}
					</div>
					<p className="text-center">
						Is it <strong>{label}</strong>?
					</p>
					<p>Category Probability: </p>
					<p>
						Your model is <span>{score[1] === label ? score[0] : score[2]}%</span>{" "}
						<span className={styles.sureLink} onClick={toggleShowA}>
							sure
						</span>{" "}
						it is {label} and{" "}
					</p>{" "}
					<p>
						is <span>{score[1] === label ? score[2] : score[0]}%</span>{" "}
						<span className={styles.sureLink} onClick={toggleShowA}>
							sure
						</span>{" "}
						it is {score[1] === label ? score[3] : score[1]}
					</p>
					<img src={src} className="w-75 d-flex justify-content-center mx-auto my-2" alt="" />
					<p className="mb-0">Predicted as: {prediction} </p>
				</article>
			)}

			{!score && (
				<section>
					<p className="text-center">Click on an image to view its stats.</p>
				</section>
			)}
		</>
	);
};
export default PredictionBreakdownCard;