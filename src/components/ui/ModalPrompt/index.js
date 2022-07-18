import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import style from "./Modal.module.scss";

export default function ModalPrompt(props) {
	const [show, setShow] = useState(true);

	const handleClose = () => setShow(false);

	return (
		<Modal show={show} onHide={handleClose} centered className={style.prompt}>
			<Modal.Header closeButton>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{props.prompt}</Modal.Body>
			<Modal.Footer>
				<Button variant="success" onClick={handleClose}>
					Let's Get Started
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
