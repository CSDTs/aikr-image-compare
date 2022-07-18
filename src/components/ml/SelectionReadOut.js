import { Card, Badge, ListGroup, Row, Col } from "react-bootstrap";

export default function SelectionReadOut(props) {
	return (
		<>
			<p> Yours vs. Big Data Company</p>
			<Row>
				<Col>
					<ListGroup as="ol">
						<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">Dimmer Lighting</div>
							</div>
							<Badge bg="primary" pill style={{ alignSelf: "center" }}>
								{props?.dim || 0}
							</Badge>
						</ListGroup.Item>
						<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">Brighter Lighting</div>
							</div>
							<Badge bg="primary" pill style={{ alignSelf: "center" }}>
								{props?.bright || 0}
							</Badge>
						</ListGroup.Item>
						<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">W/ Square Surfaces</div>
							</div>
							<Badge bg="primary" pill style={{ alignSelf: "center" }}>
								{props?.square || 0}
							</Badge>
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col>
					<ListGroup as="ol">
						<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">Dimmer Lighting</div>
							</div>
							<Badge bg="primary" pill style={{ alignSelf: "center" }}>
								0
							</Badge>
						</ListGroup.Item>
						<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">Brighter Lighting</div>
							</div>
							<Badge bg="primary" pill style={{ alignSelf: "center" }}>
								0
							</Badge>
						</ListGroup.Item>
						<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">W/ Square Surfaces</div>
							</div>
							<Badge bg="primary" pill style={{ alignSelf: "center" }}>
								0
							</Badge>
						</ListGroup.Item>
					</ListGroup>
				</Col>
			</Row>
		</>
	);
}
