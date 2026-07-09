import * as React from "react";
import { useRef, useState } from "react";
import { Prediction } from "../types";
import DataSelection from "./data-selection";
import Evaluator from "./evaluator";

interface IProps {
	predict?: Function;
	predictions: Prediction[];
	appValidationPool?: string[];
	onButtonClick?: () => void;
	onImagesUpdate?: (groupA: { src: string }[], groupB: { src: string }[]) => void;
}

const Model: React.FC<IProps> = ({ predict, predictions, appValidationPool, onButtonClick, onImagesUpdate }) => {
	const [groupAImages, setGroupAImages] = useState<{ src: string }[]>([]);
	const [groupBImages, setGroupBImages] = useState<{ src: string }[]>([]);

	// Refs mirror the latest committed values synchronously, so a call to
	// onImagesUpdate always sees the up-to-date pair even if both groups change
	// back-to-back before React has re-rendered (the class version read
	// this.state here, which could still hold the previous group's value).
	const groupARef = useRef<{ src: string }[]>(groupAImages);
	const groupBRef = useRef<{ src: string }[]>(groupBImages);

	const handleImagesSelected = (group: "A" | "B", images: { src: string }[]) => {
		if (group === "A") {
			groupARef.current = images;
			setGroupAImages(images);
		} else {
			groupBRef.current = images;
			setGroupBImages(images);
		}

		if (onImagesUpdate) {
			onImagesUpdate(groupARef.current, groupBRef.current);
		}
	};

	const hasSelectedImages = groupAImages.length > 0 || groupBImages.length > 0;

	const refreshPredictions = (
		<button className="btn btn-primary w-100" onClick={onButtonClick} hidden={predictions.length === 0}>
			Pick New Images
		</button>
	);

	return (
		<>
			<div className="row" hidden={predictions.length > 0}>
				<div className="mb-4 col-md-12  mx-auto">
					<p className="text-center">
						Now that you have trained your model, let's test it. You can test just one image or several. The software
						will keep track of the category label you predicted for each image.
					</p>
				</div>
			</div>

			<section className="row justify-content-center">
				<div className="col-md-6" hidden={predictions.length > 0}>
					<DataSelection
						label="Select Home Cooked Test Image"
						currentGroup="all"
						dataset={appValidationPool}
						mode="validating"
						groupKey="A"
						onImagesSelected={(images) => handleImagesSelected("A", images)}
					/>
				</div>
				<div className="col-md-6" hidden={predictions.length > 0}>
					<DataSelection
						label="Select Factory Made Test Image"
						currentGroup="all"
						dataset={appValidationPool}
						mode="validating"
						groupKey="B"
						onImagesSelected={(images) => handleImagesSelected("B", images)}
					/>
				</div>
			</section>

			<section className="row">
				<div className="col-md-12">
					{predict && hasSelectedImages && (
						<Evaluator predict={predict} predictions={predictions} button={refreshPredictions} />
					)}
				</div>
			</section>
		</>
	);
};

export default Model;
