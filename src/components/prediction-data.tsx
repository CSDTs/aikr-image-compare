import { FC } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import styles from "../styles/PredictionData.module.css";

type Props = {
	prediction?: {
		label?: string;
		src?: string;
		score?: (string | number)[];
		prediction?: string;
	};
};

const PredictionData: FC<Props> = ({ prediction }) => {
	const popover = (
		<Popover id="popover-basic">
			<Popover.Header as="h3">Sure</Popover.Header>
			<Popover.Body>
				This machine learning model learns a boundary that helps separate where home cooked and factory made meals tend
				to lie. Any given meal might lie more towards the home cooked or the factory made meal side. Where the meal
				falls is translated into how well it "fits" each side and is given as two "sureness" percentages. A decision
				rule is needed to interpret the "sureness" and decide which kind of meal your image is. Given these two fits,
				what boundary would you use to decide what category of meal it is? Some people use 50% as their boundary line.
			</Popover.Body>
		</Popover>
	);

	// Select Home Cooked Test Image
	const label =
		prediction?.label?.split("Select")?.[1]?.split(" Test Image")?.[0]?.split(" training image")?.[0]?.trim() ?? "";
	const src = prediction?.src;
	const score = prediction?.score;
	const predictionText =
		prediction?.prediction?.split("Select")?.[1]?.split(" Test Image")?.[0]?.split(" training image")?.[0]?.trim() ??
		"";

	if (!score || score.length === 0) {
		return (
			<section>
				<p className="text-center">Click on an image to view its stats.</p>
			</section>
		);
	}

	return (
		<article>
			<p className="text-center">
				Is it <strong>{label}</strong>?
			</p>
			<p>Category Probability: </p>

			<p>
				Your model is <span>{score[0]}%</span>{" "}
				<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
					<span className={styles.sureLink}>sure</span>
				</OverlayTrigger>{" "}
				it is{" "}
				{(score[1] as string)?.split("Select")?.[1]?.split(" Test Image")?.[0]?.split(" training image")?.[0]?.trim() ??
					""}{" "}
				and{" "}
			</p>
			<p>
				is <span>{score[2]}%</span>{" "}
				<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
					<span className={styles.sureLink}>sure</span>
				</OverlayTrigger>{" "}
				it is{" "}
				{(score[3] as string)?.split("Select")?.[1]?.split(" Test Image")?.[0]?.split(" training image")?.[0]?.trim() ??
					""}
			</p>
			<img src={src} className="w-75 d-flex justify-content-center mx-auto my-2" alt="" />
			<p className="mb-0">Predicted as: {predictionText} </p>
		</article>
	);
};

export default PredictionData;
