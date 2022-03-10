import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ImageSelect.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import ImagePicker from "react-image-picker";
import Select from "../Select";
import "react-image-picker/dist/index.css";

//import images from local
import img1 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img2 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img3 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img4 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img5 from "../../App/data/training/badfood/pizza 2.jpeg";
import img6 from "../../App/data/training/badfood/pizza 2.jpeg";
import img7 from "../../App/data/training/badfood/pizza 2.jpeg";
import img8 from "../../App/data/training/badfood/pizza 2.jpeg";
const imageList = [img1, img2, img3, img4];

const imageListAlt = [img5, img6, img7, img8];

class Images extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      imageList: props.imageList,
    };
  }
  //   shouldComponentUpdate(nextProps) {
  //     // Rendering the component only if
  //     // passed props value is changed

  //     if (nextProps.imageList !== this.props.imageList) {
  //       this.imageList = nextProps.imageList;
  //       this.setState({ images: [] });
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

  onPickImages(images) {
    this.setState({ images });
  }

  render() {
    return (
      <div>
        <h3>Multiple Select</h3>

        <ImagePicker
          images={this.props.imageList.map((image, i) => ({
            src: image,
            value: i,
          }))}
          onPick={this.onPickImages.bind(this)}
          multiple
        />
        <textarea
          rows="4"
          cols="100"
          value={this.state.images && JSON.stringify(this.state.images)}
          disabled
        />
      </div>
    );
  }
}

class ImageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGroup: "",
      label: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let val = event.target.value;

    let list;

    if (val === "") {
      list = "";
    } else {
      list = val === "good" ? imageList : imageListAlt;
    }

    if (val === "") list = [];
    if (val === "good") list = imageList;
    if (val === "bad") list = imageListAlt;

    this.setState({ currentGroup: list });
  }

  render() {
    let content;
    if (this.state.currentGroup === "") {
      content = (
        <p className="card-text text-muted">
          Select a data set to work with, then select what images you want to
          train for this group:
        </p>
      );
    } else {
      content = (
        <Select
          imageList={this.state.currentGroup}
          label={this.props.currentGroup}
        />
      );
    }

    return (
      <div className="card">
        <div className="card-header">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon3">
              {this.props.label}
            </span>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
              placeholder="eg. Real Foods"
              value={this.props.label === "A" ? "Group A" : "Group B"}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <strong className="figure-caption col-md-4">
              Add Image Samples:
            </strong>

            <div className="input-group mb-3 col-md-8 w-auto" disabled>
              <label className="input-group-text" for="inputGroupSelect01">
                Sets
              </label>
              <select
                className="form-select"
                id="inputGroupSelect01"
                onChange={this.handleChange}
              >
                <option value="" selected>
                  Choose...
                </option>
                <option value="good">Good Foods</option>
                <option value="bad">Bad Foods</option>
              </select>
            </div>
          </div>

          {content}

          <a className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faCirclePlus} className="pe-2 ps-1" />
            Add
          </a>
        </div>
      </div>
    );
  }
}

export default ImageSelect;
