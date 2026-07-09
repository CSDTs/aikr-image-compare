import { PlusCircleIcon } from "lucide-react";
import { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import styles from "../styles/DataSelection.module.css";
import { parseLabel } from "../utils/parseLabel";

interface Props {
	label?: string;
	mode?: "training" | "validating";
	content?: React.ReactNode;
	disabled?: boolean;
	selectedImages?: { src: string }[];
	onImagesSelected?: (images: any[]) => void;
}

const Prompt: FC<Props> = ({ label, mode, content, disabled, selectedImages = [], onImagesSelected }) => {
	const [show, setShow] = useState(false);
	const [preview, setPreview] = useState<JSX.Element[]>([]);

	const updatedLabel = parseLabel(label);

	const handleClose = () => {
		// Commit-on-close: snapshot the live selection (React state, not the DOM) at
		// the moment the modal closes.
		const temp: { src: string }[] = selectedImages.map((img) => ({ src: img.src }));
		const previewTemp: JSX.Element[] = temp.map((img, i) => (
			<img src={img.src} alt="" className="col-3 my-2" key={`img${label}${i}`} />
		));
		setPreview(previewTemp);

		if (onImagesSelected) {
			onImagesSelected(temp);
		}

		setShow(false);
	};

	const handleShow = () => setShow(true);

	const cardPrompt = {
		training: `Click to add images to train ${updatedLabel}`,
		validating: `Click to add images to validate for ${updatedLabel}`,
	};

	const modalTitle = {
		training: `Select Images to Train ${updatedLabel} Model`,
		validating: `Select Images to Mark for ${updatedLabel} Validation`,
	};

	return (
		<>
			<div className="row justify-content-around">
				<p hidden={preview.length !== 0}>{preview.length === 0 && mode ? cardPrompt[mode] : ""}</p>
				<div className="col-md-12 mb-3">
					<div className={`${styles.previewContainer} row`}>{preview}</div>
				</div>
				<Button variant="outline-primary" onClick={handleShow} disabled={disabled} className={styles.btnModified}>
					<PlusCircleIcon className="pe-2 ps-1" />
					Click to add images
				</Button>
			</div>

			<Modal show={show} onHide={handleClose} centered size="lg" className={styles.fixedHeightModal}>
				<Modal.Header closeButton>
					<Modal.Title>{mode && modalTitle[mode]}</Modal.Title>
				</Modal.Header>
				<Modal.Body className={styles.scrollableModalBody}>{content}</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>
						OK
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Prompt;
