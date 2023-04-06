import { FC } from "react";

interface IProps {
	score: string;
}

/**
 * Creates the results section of the evaluation tab.
 * @param score The percentage calculated on how sure the prediction is.
 */
const EvaluationReadOut: FC<IProps> = ({ score }) => {
	return (
		<div className="mt-4 container">
			<h1>Results</h1>
			<hr />

			<div className="row">
				<div className="col">
					<h5>Your model's accuracy </h5>
					<h1>{score}% </h1>
				</div>
			</div>
			<p className="lead text-muted font-weight-light fs-4">
				Congrats on running your test! Just so you have a comparison, most industry AI systems are about 70-90%
				accurate. But as scientists we often learn more when we falsify a hypothesis, so all experiments are good
				accomplishments.
			</p>
		</div>
	);
};
export default EvaluationReadOut;
