import * as React from "react";

import { Modal as BootstrapModal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./Modal.module.css";
function Modal(props) {
	const [show, setShow] = React.useState(true);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<BootstrapModal show={show} onHide={handleClose} centered className={style.prompt}>
				<BootstrapModal.Header closeButton>
					<BootstrapModal.Title>{props.title}</BootstrapModal.Title>
				</BootstrapModal.Header>
				<BootstrapModal.Body>{props.prompt}</BootstrapModal.Body>
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
