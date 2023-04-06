import { FC } from "react";
import { useClassifierStore } from "../../store";
import { IPrediction, ImageError } from "../../types";
import ImageSelection from "../ImageSelection";
import Results from "./components/Results";

// import AdvancedMetrics from "../../../features/AdvancedMetrics";

interface IProps {
	labels: string[];
	downloading: boolean;
	onDownload?: Function;
	predict?: Function;
	predictions: IPrediction[];
	errors?: ImageError[];
	logs: {
		[index: string]: any;
	};
	accuracy: {
		training?: number;
		evaluation?: number;
	};

	onButtonClick?: () => void;
}

const Evaluation: FC<IProps> = ({ labels, onDownload, downloading, predict, logs, accuracy: { training }, errors }) => {
	const predictions = useClassifierStore((state) => state.predictions);

	return (
		<>
			<div className="row" hidden={predictions.length > 0}>
				<div className="mb-5 col-md-10 mx-auto">
					<p>
						Now that you have trained your model, let's test it. You can test just one image or several. The software
						will keep track of the category label you predicted for each image.
					</p>
				</div>
			</div>

			<section className="row justify-content-center">
				<div className="col-md-5" hidden={predictions.length > 0}>
					<ImageSelection set={"group_a"} mode="Evaluation" />
				</div>
				<div className="col-md-5" hidden={predictions.length > 0}>
					<ImageSelection set={"group_b"} mode="Evaluation" />
				</div>
			</section>

			{/* Removing for now. Too ambiguous to add to app */}

			{/* <AdvancedMetrics
				labels={labels}
				onDownload={onDownload}
				downloading={downloading}
				training={training}
				logs={logs}
				errors={errors}
			/> */}

			<section className="row">
				<div className="col-md-12">{predict && <Results predict={predict} />}</div>
			</section>
		</>
	);
};

export default Evaluation;
