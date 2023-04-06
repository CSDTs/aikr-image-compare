import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDataStore } from "../../../store";
import style from "./Modal.module.scss";

const ModalPrompt = () => {
	const [show, setShow] = useState(true);
	const handleClose = () => setShow(false);
	const data = useDataStore((state) => state.data);

	return (
		<Modal show={show} onHide={handleClose} centered className={style.prompt}>
			<Modal.Header closeButton>
				<Modal.Title>{data["prompt_header"]}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{data["prompt_body"]}</Modal.Body>
			<Modal.Footer>
				<Button variant="success" onClick={handleClose}>
					Let's Get Started
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalPrompt;
