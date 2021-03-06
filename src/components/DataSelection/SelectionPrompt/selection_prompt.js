import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../DataSelection.module.css";

function Prompt(props) {
	const [show, setShow] = React.useState(false);
	const [obj, setObj] = React.useState([]);
	const [preview, setPreview] = React.useState([]);
	let currentList = "";

	const handleClose = () => {
		let temp = [];
		let previewTemp = [];
		currentList = document.querySelectorAll(".modal img.thumbnail.selected");

		for (let i = 0; i < currentList.length; i++) {
			temp.push({
				src: currentList[i].src,
			});
			previewTemp.push(<img src={currentList[i].src} alt="" className="col-3 my-2" key={"img" + props.label + i} />);
		}
		setObj(JSON.stringify(temp));
		setPreview(previewTemp);
		setShow(false);
	};
	const handleShow = () => setShow(true);

	const cardPrompt = {
		training: `Click to add images to train ${props.label}`,
		validating: `Click to add images to validate for ${props.label}`,
	};

	const modalTitle = {
		training: `Select Images to Train ${props.label} Model`,
		validating: `Select Images to Mark for ${props.label} Validation`,
	};

	return (
		<>
			<div className="row justify-content-around">
				<p hidden={preview.length !== 0}>{preview.length === 0 ? cardPrompt[props.mode] : ""}</p>
				<div className="col-md-12 mb-3">
					<div className={`${styles.previewContainer} row`}>{preview}</div>
				</div>
				<Button variant="outline-primary" onClick={handleShow} disabled={props.disabled} className={styles.btnModified}>
					<FontAwesomeIcon icon={faCirclePlus} className="pe-2 ps-1" />
					Add
				</Button>
			</div>
			<textarea value={obj} className="w-100 mt-3" disabled hidden></textarea>

			<Modal show={show} onHide={handleClose} centered size="lg">
				<Modal.Header closeButton>
					<Modal.Title>{modalTitle[props.mode]}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{props.content}</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>
						OK
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default Prompt;
