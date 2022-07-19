import { Badge, ListGroup } from "react-bootstrap";

export default function ReadoutGroup({ dim, bright, square }) {
	return (
		<ListGroup as="ol">
			<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
				<div className="ms-2 me-auto">
					<div className="fw-bold">Dimmer Lighting</div>
				</div>
				<Badge bg="primary" pill style={{ alignSelf: "center" }}>
					{dim}
				</Badge>
			</ListGroup.Item>
			<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
				<div className="ms-2 me-auto">
					<div className="fw-bold">Brighter Lighting</div>
				</div>
				<Badge bg="primary" pill style={{ alignSelf: "center" }}>
					{bright}
				</Badge>
			</ListGroup.Item>
			<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
				<div className="ms-2 me-auto">
					<div className="fw-bold">W/ Square Surfaces</div>
				</div>
				<Badge bg="primary" pill style={{ alignSelf: "center" }}>
					{square}
				</Badge>
			</ListGroup.Item>
		</ListGroup>
	);
}
