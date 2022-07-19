import { Row, Col } from "react-bootstrap";
import ReadoutGroup from "../ui/ReadoutGroup";

export default function SelectionReadOut(props) {
	return (
		<>
			<p> Yours vs. Big Data Company</p>
			<Row>
				<Col>
					<ReadoutGroup dim={props?.dim || 0} bright={props?.bright || 0} square={props?.square || 0} />
				</Col>
				<Col>
					<ReadoutGroup
						dim={props?.opponent[0] || 0}
						bright={props?.opponent[1] || 0}
						square={props?.opponent[2] || 0}
					/>
				</Col>
			</Row>
		</>
	);
}
