import React, { Component, useState } from "react";
import ImagePicker from "../../../lib/react-image-picker/";

import { Button, Modal, Image, Stack, Row, Col, Container, Accordion, Card } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import SelectionReadOut from "../SelectionReadOut.js";

const ImageSelectionPrompt = ({ show, onHide, set, label, selected, setPicked }) => {
	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Select images for {label}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ImagePicker
					images={set.map((image, i) => ({
						src: "/img/" + image.image,
						value: i,
						dim_lighting: image.dim_lighting,
						bright_lighting: image.bright_lighting,
						has_square_surfaces: image.has_square_surfaces,
					}))}
					onPick={setPicked}
					selected={selected}
					multiple
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

const ImagePickedView = ({ images, setDim, setBright, setSquare }) => {
	let dim = 0;
	let bright = 0;
	let square = 0;
	for (let image of images) {
		if (image.data.dim_lighting) dim = dim + 1;
		if (image.data.bright_lighting) bright = bright + 1;
		if (image.data.has_square_surfaces) square = square + 1;
	}

	setDim(dim);
	setBright(bright);
	setSquare(square);
	return (
		<Row className="w-100 mt-3 mb-2">
			{images.map((image) => (
				<Col md={3}>
					<Image src={image.data.src} thumbnail fluid />
				</Col>
			))}
		</Row>
	);
};

const overrideSelected = (set) => {
	return set.map((image, i) => {
		return {
			data: {
				bright_lighting: image.bright_lighting,
				dim_lighting: image.dim_lighting,
				has_square_surfaces: image.has_square_surfaces,
				src: "/img/" + image.image,
			},
			value: i,
		};
	});
};

export default function ImageSelection({ set, label, selectCallback }) {
	const [picked, setPicked] = useState([]);
	const [dim, setDim] = useState(0);
	const [bright, setBright] = useState(0);
	const [square, setSquare] = useState(0);
	const [modalShow, setModalShow] = useState(false);

	console.log(overrideSelected(set));
	return (
		<>
			<div>
				<Card>
					<Card.Body>
						<Card.Title>{label}</Card.Title>
						<Card.Subtitle className="mb-2 text-muted">
							{picked.length == 0 && `Click to add images to ${label}`}
							{picked.length != 0 && `Training Model`}
						</Card.Subtitle>
						{picked && <ImagePickedView images={picked} setDim={setDim} setBright={setBright} setSquare={setSquare} />}
						{picked.length == 0 && <p>Click to add images to {label}</p>}
						<Row>
							<Col sm={6}>
								{" "}
								<Button variant="primary" onClick={() => setModalShow(true)} className="d-block w-100">
									<FaPlus style={{ verticalAlign: "middle" }} /> Add
								</Button>
							</Col>
							<Col sm={3}>
								<Button variant="info" onClick={() => console.log(picked)} className="d-block w-100">
									Log
								</Button>
							</Col>
							<Col sm={3}>
								<Button variant="warning" onClick={() => setPicked(overrideSelected(set))} className="d-block w-100">
									Auto
								</Button>
							</Col>
						</Row>
					</Card.Body>
				</Card>
				<>
					<Accordion>
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								<strong>Data Breakdown</strong>
							</Accordion.Header>
							<Accordion.Body>
								<SelectionReadOut dim={dim} bright={bright} square={square} />
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</>

				<ImageSelectionPrompt
					show={modalShow}
					onHide={() => setModalShow(false)}
					set={set}
					label={label}
					selected={picked}
					setPicked={setPicked}
				/>
			</div>
		</>
	);
}
