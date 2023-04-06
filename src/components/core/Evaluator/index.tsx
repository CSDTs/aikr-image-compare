import { FC, useState } from "react";
import { useClassifierStore } from "../../../store";
import { IPrediction } from "../../../types";
import { IFileData, getFilesAsImageArray } from "../../../utils/getFilesAsImages";
import Dropzone from "../Dropzone";
import PredictionData from "../PredictionData";
import Predictions from "../Predictions";

interface IProps {
	predict: Function; // A function that takes in an array of image files or an object and returns a prediction
}

/**
 * Allows users to select images to evaluate against the trained model, generating predictions based on selection
 */
const Evaluator: FC<IProps> = ({ predict }) => {
	const [currentPrediction, setCurrentPrediction] = useState<any>([]);
	const updateClassifierValues = useClassifierStore((store) => store.setValue);
	const predictions = useClassifierStore((store) => store.predictions);

	/**
	 * Parses an array of image files and passes them to the predict function
	 * @param files - An array of image files
	 * @returns A promise that resolves with an array of IFileData objects
	 */
	const onParseFiles = async (files: FileList) => {
		const imageFiles: IFileData[] = await getFilesAsImageArray(files);
		predict(imageFiles);
	};

	/**
	 * Parses an object and passes it to the predict function
	 * @param files - An object containing image data
	 */
	const onParseObject = async (files: any) => {
		setCurrentPrediction([]);
		predict(files);
	};

	/**
	 * Sets the current prediction object to the provided value
	 * @param value - An IPrediction object
	 */
	const onPredictionClick = (value: IPrediction) => {
		setCurrentPrediction(value);
	};

	/**
	 * Clears the current predictions and resets to evaluation image selection.
	 */
	const clearPredictions = () => updateClassifierValues("predictions", []);

	return (
		<>
			<div className="row" hidden={predictions.length > 0}>
				<div className="mx-auto  mt-4 col-md-4">
					<Dropzone onParseFiles={onParseFiles} onParseObject={onParseObject} mode="Evaluate Images">
						Drop Images to test
					</Dropzone>
				</div>
			</div>

			<div className="row justify-content-center" hidden={predictions.length === 0}>
				<div className="col-md-6">
					<Predictions predictions={predictions} onClick={onPredictionClick} />
				</div>
				<div className="col-md-4">
					<PredictionData prediction={currentPrediction} />

					<button className="btn btn-primary w-100" onClick={clearPredictions} hidden={predictions.length === 0}>
						Pick New Images
					</button>
				</div>
			</div>
		</>
	);
};

export default Evaluator;
