import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import style from "./Modal.module.css";
function SelectModal(props) {
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

      previewTemp.push(
        <img
          src={currentList[i].src}
          alt=""
          className="col-2 my-2"
          key={"img" + props.extra + i}
        />
      );
    }
    setObj(JSON.stringify(temp));
    setPreview(previewTemp);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="row">{preview}</div>
      <textarea value={obj} className="w-100 mt-3" disabled></textarea>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        disabled={props.disabled}
      >
        <FontAwesomeIcon icon={faCirclePlus} className="pe-2 ps-1" />
        Add
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Images to Train Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.content}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SelectModal;
