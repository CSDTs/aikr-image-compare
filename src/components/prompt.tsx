import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import styles from "../styles/DataSelection.module.css";

type Props = {
	label?: string;
	mode?: "training" | "validating";
	content?: React.ReactNode;
	disabled?: boolean;
};

const Prompt: FC<Props> = ({ label, mode, content, disabled }) => {
	const [show, setShow] = useState(false);
	const [obj, setObj] = useState<any[]>([]);
	const [preview, setPreview] = useState<JSX.Element[]>([]);
	let currentList: NodeListOf<Element>;

	const updatedLabel = label?.split("Select")[1]?.split(" Test Image")[0]?.split(" training image")[0]?.trim();

	const handleClose = () => {
		const temp: { src: string }[] = [];
		const previewTemp: JSX.Element[] = [];
		currentList = document.querySelectorAll(".modal img.thumbnail.selected");

		for (let i = 0; i < currentList.length; i++) {
			const imgElement = currentList[i] as HTMLImageElement;
			temp.push({
				src: imgElement.src,
			});
			previewTemp.push(<img src={imgElement.src} alt="" className="col-3 my-2" key={`img${label}${i}`} />);
		}
		setObj(temp);
		setPreview(previewTemp);
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
					<FontAwesomeIcon icon={faCirclePlus} className="pe-2 ps-1" />
					Add
				</Button>
			</div>
			<textarea value={JSON.stringify(obj)} className="w-100 mt-3" disabled hidden></textarea>

			<Modal show={show} onHide={handleClose} centered size="lg">
				<Modal.Header closeButton>
					<Modal.Title>{mode && modalTitle[mode]}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{content}</Modal.Body>
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
