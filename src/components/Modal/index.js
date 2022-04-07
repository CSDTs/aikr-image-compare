import * as React from "react";

import { Modal as BootstrapModal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./Modal.module.css";
function Modal() {
	const [show, setShow] = React.useState(true);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<BootstrapModal show={show} onHide={handleClose} centered className={style.prompt}>
				<BootstrapModal.Header closeButton>
					<BootstrapModal.Title>Help Save Joe's Lunch!</BootstrapModal.Title>
				</BootstrapModal.Header>
				<BootstrapModal.Body>
					Our favorite school cafeteria worker, Chef Joe, is in danger of being put out of work by factory made lunches.
					Your cell phone app will be used by students to help them buy only Joe's delicious hand-made lunches. So your
					first step is to train the AI on the two classes of images: authentic hand-made versus factory-produced
					imitations.
				</BootstrapModal.Body>
				<BootstrapModal.Footer>
					<Button variant="success" onClick={handleClose}>
						Let's Get Started
					</Button>
				</BootstrapModal.Footer>
			</BootstrapModal>
		</>
	);
}

export default Modal;
