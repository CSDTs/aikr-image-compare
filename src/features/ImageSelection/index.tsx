import React, { useEffect, useState } from "react";

import DataCompareGroup from "../../components/ui/DataCompareGroup";

import { Accordion, Badge, Button, Card, Col, Image, Modal, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { useDataStore } from "../../store";
import { Data, ImageData, ImageDataReduced } from "../../types";
import SelectionGrid from "./components/SelectionGrid";

const rootPrefix = `${window.location.origin}${
	process.env.NODE_ENV === "production" ? "/culture/aikr/build" : ""
}/img/`;

const overrideSelected = (set: Array<ImageData>) => {
	return set.map((image, i) => {
		return {
			data: {
				bright_lighting: image.bright_lighting,
				dim_lighting: image.dim_lighting,
				has_square_surfaces: image.has_square_surfaces,
				src: `${rootPrefix}${image.image}`,
			},
			value: i,
		};
	}) as ImagePostSelection[];
};

const simplifyImageSelectionData = (images: Array<ImagePostSelection>) => {
	return images.map((image) => {
		return { src: `${image.data.src}`, value: image.data.value };
	});
};

interface ImageSelectionProps {
	set: string;
	mode: string;
}

interface ImagePreSelection extends ImageData {
	src: string;
	value?: number;
}
interface ImagePostSelection extends ImageData {
	data: ImagePreSelection;
	value: number;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({ set, mode }) => {
	const [picked, setPicked] = useState<ImagePostSelection[]>([]);
	const [dim, setDim] = useState(0);
	const [bright, setBright] = useState(0);
	const [square, setSquare] = useState(0);
	const [modalShow, setModalShow] = useState(false);

	const data = useDataStore((state) => state.data);

	const closeModal = () => setModalShow(false);

	const openModal = () => setModalShow(true);

	const imageSet = (mode === "Training" ? data[set]?.dataset : data["validation_pool"]).map(
		(image: ImageData, i: number) => ({
			src: `${rootPrefix}${image.image}`,
			value: i,
			dim_lighting: image.dim_lighting,
			bright_lighting: image.bright_lighting,
			has_square_surfaces: image.has_square_surfaces,
		})
	);

	const handleDeBias = () => setPicked(overrideSelected(data[set]?.dataset));

	useEffect(() => {
		//Check if any images are selected
		if (picked.length > 0) {
			//Reduce to calculate the image data categories in the breakdown
			const {
				dim_lighting: dimTotal,
				bright_lighting: brightTotal,
				has_square_surfaces: squareTotal,
			} = picked.reduce(
				(acc, { data: { dim_lighting, bright_lighting, has_square_surfaces } }) => {
					return {
						dim_lighting: +dim_lighting + acc.dim_lighting,
						bright_lighting: +bright_lighting + acc.bright_lighting,
						has_square_surfaces: +has_square_surfaces + acc.has_square_surfaces,
					};
				},
				{ dim_lighting: 0, bright_lighting: 0, has_square_surfaces: 0 }
			);

			setDim(dimTotal);
			setBright(brightTotal);
			setSquare(squareTotal);

			// Based on current state, store the picked images to their groups for either training or evaluation
			useDataStore.getState().updateGroupSelection(set as keyof Data, {
				[mode === "Evaluation" ? "validate_selected" : "selected"]: simplifyImageSelectionData(
					picked
				) as ImageDataReduced[],
			});
		}
	}, [picked, set, mode]);

	return (
		<>
			<Card>
				<Card.Body>
					<div className="d-inline-flex justify-content-between w-100">
						<Card.Title>{data[set]?.label}</Card.Title>
						<Badge bg="secondary" style={{ height: "max-content" }}>
							{mode}
						</Badge>
					</div>

					<Card.Subtitle className="mb-2 text-muted">
						{`Click to ${picked.length === 0 ? "add images to" : "reselect your images for "} ${data[set]?.label}`}
					</Card.Subtitle>

					{picked && (
						<Row className="w-100 mt-3 mb-2">
							{picked.map((image: ImagePostSelection, idx: number) => (
								<Col md={3} key={idx}>
									<Image src={image.data.src} thumbnail fluid />
								</Col>
							))}
						</Row>
					)}

					<Col sm={12}>
						<Button variant="primary" onClick={openModal} className="d-block w-100">
							<FaPlus style={{ verticalAlign: "middle" }} /> Add
						</Button>
					</Col>
				</Card.Body>
			</Card>

			<Accordion>
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						<strong>Data Breakdown</strong>
					</Accordion.Header>
					<Accordion.Body>
						<p> Yours vs. Big Data Company</p>
						<Row>
							<Col sm={6}>
								<DataCompareGroup dim={dim || 0} bright={bright || 0} square={square || 0} />
							</Col>
							<Col sm={6}>
								<DataCompareGroup
									dim={data[set]?.corporate_score[0] || 0}
									bright={data[set]?.corporate_score[1] || 0}
									square={data[set]?.corporate_score[2] || 0}
								/>
							</Col>
						</Row>

						{mode === "Training" && (
							<Button variant="warning" onClick={handleDeBias} className="d-block w-100 mt-3">
								Let AI Assistant De-bias for me
							</Button>
						)}
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>

			<Modal show={modalShow} onHide={closeModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Select images for {data[set].label}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SelectionGrid images={imageSet} onPick={setPicked} group={data[set]} multiple />
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={closeModal}>Close</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ImageSelection;
