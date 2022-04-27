import * as React from "react";

import { Accordion, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./AdvancedAccordion.module.css";

const epochPopover = (
	<Popover id="popover-basic">
		<Popover.Header as="h3">Epoch</Popover.Header>
		<Popover.Body>
			After running all the batches, we have completed one epoch. But random variation helps us to keep discovering new
			weighting strategies (e.g. "weigh green colors high but exclude gummy bear shapes"). So more epochs mean that we
			can increase our chances of an accurate classification. One downside is that it takes a longer time, and
			eventually it will not be adding any accuracy at all. Another downside is that there is no guarantee that accuracy
			will always improve. It is possible for learning to become worse over time.
		</Popover.Body>
	</Popover>
);

const batchPopover = (
	<Popover id="popover-basic">
		<Popover.Header as="h3">Batch</Popover.Header>
		<Popover.Body>
			Say you have many samples. We break those into small batches. Then we ask the neural net to make a guess about
			what will be the most important visual features they have in common. If a human was doing it, they might weigh the
			color green more heavily for healthy meals, or shapes associated with boxes more heavily for unhealthy means.
			Because the neural net does not really know anything, and all the visual features are just lists of parameters, it
			can just assign those weights randomly at first and update them as it learns. Each time a batch runs, it will turn
			out that some parameters were more successful at making correct matches. So even though the first run is random,
			the next will be able to make a better guess about which weights to use on each feature. These accumulate with
			each run, in a similar way that Darwin said the most successful mutations would get to reproduce in each
			generation.
		</Popover.Body>
	</Popover>
);

export default class AdvancedAccordion extends React.Component {
	constructor(props) {
		super(props);
	}

	//Passes state change for epochs and batch size to app parent
	onFieldChange(event) {
		const fieldName = event.target.name;
		const fieldValue = event.target.value;
		this.props.onChange(fieldName, fieldValue);
	}

	render() {
		return (
			<Accordion
				style={{
					width: "276px",
				}}
				className="mx-auto">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Advanced</Accordion.Header>
					<Accordion.Body>
						<Form>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<OverlayTrigger trigger="click" rootClose placement="right" overlay={batchPopover}>
									<span>
										Batch: <FontAwesomeIcon icon={faCircleQuestion} className="pe-2 ps-1" />
									</span>
								</OverlayTrigger>{" "}
								<Form.Control
									type="number"
									placeholder="eg. 32"
									defaultValue="32"
									name="batchSize"
									onChange={this.onFieldChange.bind(this)}
								/>
								<Form.Text className="text-muted">The size of the set used for the training.</Form.Text>
							</Form.Group>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<OverlayTrigger trigger="click" rootClose placement="right" overlay={epochPopover}>
									<span>
										Epochs: <FontAwesomeIcon icon={faCircleQuestion} className="pe-2 ps-1" />
									</span>
								</OverlayTrigger>{" "}
								<Form.Control
									type="number"
									placeholder="eg. 20"
									defaultValue="20"
									name="epochs"
									onChange={this.onFieldChange.bind(this)}
								/>
								<Form.Text className="text-muted">How many times to train each sample in the set.</Form.Text>
							</Form.Group>
						</Form>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		);
	}
}
