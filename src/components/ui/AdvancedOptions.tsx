import { FC } from "react";
import { Accordion, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { OverlayChildren } from "react-bootstrap/esm/Overlay";
import { FaQuestionCircle } from "react-icons/fa";

const epochData = {
	title: "Epoch",
	description: `After running all the batches, we have completed one epoch. But random variation helps us to keep discovering new
	weighting strategies (e.g. "weigh green colors high but exclude gummy bear shapes"). So more epochs mean that we
	can increase our chances of an accurate classification. One downside is that it takes a longer time, and
	eventually it will not be adding any accuracy at all. Another downside is that there is no guarantee that accuracy
	will always improve. It is possible for learning to become worse over time.`,
};

const batchData = {
	title: "Batch",
	description: `Say you have many samples. We break those into small batches. Then we ask the neural net to make a guess about
	what will be the most important visual features they have in common. If a human was doing it, they might weigh the
	color green more heavily for healthy meals, or shapes associated with boxes more heavily for unhealthy means.
	Because the neural net does not really know anything, and all the visual features are just lists of parameters, it
	can just assign those weights randomly at first and update them as it learns. Each time a batch runs, it will turn
	out that some parameters were more successful at making correct matches. So even though the first run is random,
	the next will be able to make a better guess about which weights to use on each feature. These accumulate with
	each run, in a similar way that Darwin said the most successful mutations would get to reproduce in each
	generation.`,
};

type Dataset = {
	title: string;
	description: string;
};
const createPopover: FC<Dataset> = ({ title, description }) => {
	return (
		<Popover id={`popover-${title}`}>
			<Popover.Header as="h3">{title}</Popover.Header>
			<Popover.Body>{description}</Popover.Body>
		</Popover>
	);
};

interface IProps {
	onChange: any;
}
const AdvancedOptions: FC<IProps> = ({ onChange }) => {
	//Passes state change for epochs and batch size to app parent
	const onFieldChange = (event: any) => {
		const fieldName = event.target.name;
		const fieldValue = event.target.value;
		onChange(fieldName, fieldValue);
	};

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
							<OverlayTrigger
								trigger="click"
								rootClose
								placement="right"
								overlay={createPopover(epochData) as OverlayChildren}>
								<span>
									Batch: <FaQuestionCircle />
								</span>
							</OverlayTrigger>{" "}
							<Form.Control
								type="number"
								placeholder="eg. 32"
								defaultValue="32"
								name="batchSize"
								onChange={onFieldChange}
							/>
							<Form.Text className="text-muted">The size of the set used for the training.</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<OverlayTrigger
								trigger="click"
								rootClose
								placement="right"
								overlay={createPopover(batchData) as OverlayChildren}>
								<span>
									Epochs: <FaQuestionCircle />
								</span>
							</OverlayTrigger>{" "}
							<Form.Control
								type="number"
								placeholder="eg. 20"
								defaultValue="20"
								name="epochs"
								onChange={onFieldChange}
							/>
							<Form.Text className="text-muted">How many times to train each sample in the set.</Form.Text>
						</Form.Group>
					</Form>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
};

export default AdvancedOptions;