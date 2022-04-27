import * as React from "react";
import Dropzone from "../../Dropzone";
import { IFileData, getFilesAsImageArray } from "../../utils/getFilesAsImages";
import Predictions from "./Predictions";
import { IPrediction } from "./Predictions/Prediction";
import PredictionData from "../../components/PredictionData";

interface IProps {
	predict: Function;
	predictions: IPrediction[];
	button: any;
}

interface IState {
	imagesParsed: number;
	totalFiles: number;
	currentPrediction: any;
}

class Evaluator extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			imagesParsed: 0,
			totalFiles: 0,
			currentPrediction: [],
		};
	}

	private onParseFiles = async (files: FileList) => {
		const imageFiles: IFileData[] = await getFilesAsImageArray(files);
		this.props.predict(imageFiles);
	};

	private onParseObject = async (files: any) => {
		// const imageFiles: IFileData[] = await getFilesAsImageArray(files);
		this.setState({ currentPrediction: [] });
		this.props.predict(files);
	};

	private onPredictionClick = (value: IPrediction) => {
		this.setState({ currentPrediction: value });
	};

	render() {
		return (
			<React.Fragment>
				<div className="row" hidden={this.props.predictions.length > 0}>
					<div className="mx-auto  mt-4 col-md-4">
						<Dropzone
							onParseFiles={this.onParseFiles}
							onParseObject={this.onParseObject}
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

				<div className="row justify-content-center" hidden={this.props.predictions.length === 0}>
					<div className="col-md-6">
						<Predictions predictions={this.props.predictions} onClick={this.onPredictionClick} />
					</div>
					<div className="col-md-4">
						<PredictionData prediction={this.state.currentPrediction} />
						{this.props.button}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Evaluator;
