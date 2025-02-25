import { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import style from "../styles/Modal.module.css";

type Props = {
	title: string;
	prompt: string;
};

const IntroDialog: FC<Props> = ({ title, prompt }) => {
	const [show, setShow] = useState(true);
	const handleClose = () => setShow(false);

	return (
		<Modal show={show} onHide={handleClose} centered className={style.prompt}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{prompt}</Modal.Body>
			<Modal.Footer>
				<Button variant="success" onClick={handleClose}>
					Let's Get Started
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default IntroDialog;
