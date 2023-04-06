import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";

interface IProps {
	message: string;
	show: boolean;
	// onClose: () => void;
}

const MessageAlert: React.FC<IProps> = ({ message, show }) => {
	const [showModal, setShowModal] = useState<boolean>(show);

	const handleClose = () => {
		setShowModal(false);
	};

	return (
		<>
			<Modal show={showModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Alert variant="info">{message}</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>
						OK
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default MessageAlert;
