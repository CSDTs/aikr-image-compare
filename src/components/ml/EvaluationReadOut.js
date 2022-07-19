import { Row, Col, Container } from "react-bootstrap";

export default function EvaluationReadOut({ score }) {
	return (
		<Container className="mt-4">
			<h1>Results</h1>
			<hr></hr>

			<Row>
				<Col>
					<h5>Your model's accuracy </h5>
					<h1>{score}% </h1>
				</Col>
				<Col>
					<h5>Big Data's accuracy </h5>
					<h1> 85% </h1>
				</Col>
			</Row>

			{score >= 85 && (
				<p className="figure-caption lead" style={{ fontSize: "1.5rem" }}>
					Congrats! You trained your model better than the company!
				</p>
			)}
			{score < 85 && (
				<p className="figure-caption lead" style={{ fontSize: "1.5rem" }}>
					Try again with different images to improve your score.
				</p>
			)}
		</Container>
	);
}
