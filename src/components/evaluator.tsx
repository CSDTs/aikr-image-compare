import { FC, useState } from "react";
import Dropzone from "./dropzone";

import { Prediction } from "../types";
import { IFileData, getFilesAsImageArray } from "../utils/getFilesAsImages";
import PredictionData from "./prediction-data";
import PredictionList from "./prediction-list";

interface Props {
	predict: Function;
	predictions: Prediction[];
	button: any;
}

const Evaluator: FC<Props> = ({ predict, predictions, button }) => {
	const [currentPrediction, setCurrentPrediction] = useState<any>([]);

	const onParseFiles = async (files: FileList) => {
		const imageFiles: IFileData[] = await getFilesAsImageArray(files);
		predict(imageFiles);
	};

	const onParseObject = async (files: any) => {
		setCurrentPrediction([]);
		predict(files);
	};

	const onPredictionClick = (value: Prediction) => {
		setCurrentPrediction(value);
	};

	return (
		<>
			<div className="row" hidden={predictions.length > 0}>
				<div className="mx-auto mt-4 col-md-4">
					<Dropzone
						onParseFiles={onParseFiles}
						onParseObject={onParseObject}
						mode="Evaluate Images"
						style={{
							borderRadius: "0 0 5px 5px",
							marginTop: "-2px",
							height: "300px",
						}}>
						Drop Images to test
					</Dropzone>
				</div>
			</div>

			<div className="row justify-content-center" hidden={predictions.length === 0}>
				<div className="col-md-8">
					<PredictionList predictions={predictions} onClick={onPredictionClick} />
				</div>
				<div className="col-md-4">
					<PredictionData prediction={currentPrediction} />
					{button}
				</div>
			</div>
		</>
	);
};

export default Evaluator;
