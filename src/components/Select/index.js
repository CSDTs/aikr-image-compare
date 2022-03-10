import React, { Component } from "react";
import { render } from "react-dom";
import SelectImage from "../SelectImage";
import getFile from "../../Dropzone/getFile";
import img1 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img2 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img3 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img4 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img5 from "../../App/data/training/badfood/pizza 2.jpeg";
import img6 from "../../App/data/training/badfood/pizza 2.jpeg";
import img7 from "../../App/data/training/badfood/pizza 2.jpeg";
import img8 from "../../App/data/training/badfood/pizza 2.jpeg";
import { image } from "@tensorflow/tfjs";

const imageList = [img1, img2, img3, img4];

class Select extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { images: [], imageList: props.imageList, label: props.label };
  }

  onPickImages(images) {
    this.setState({ images });
  }
  componentDidUpdate(prevProps) {
    if (this.props.imageList !== prevProps.imageList) {
      this.setState({ images: [] });
    }
  }

  handleConversion(images) {
    let convertedImages = [];
    let output = "";
    function toDataURL(src, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
      };
      img.src = src;
      if (img.complete || img.complete === undefined) {
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
      }
    }
    let label = this.props.label;
    for (let image of images) {
      toDataURL(image.src, (dataUrl) => {
        let temp = {
          label: label,
          src: dataUrl,
          file: {},
        };
        convertedImages.push(temp);
        output += JSON.stringify(temp);
      });
    }
    // console.log(convertedImages);
    return output;
    // value={this.state.images && JSON.stringify(this.state.images)}
  }

  render() {
    return (
      <div>
        <h3>Multiple Select</h3>
        <SelectImage
          images={this.props.imageList.map((image, i) => ({
            src: image,
            value: i,
            label: this.props.label,
          }))}
          onPick={this.onPickImages.bind(this)}
          currentSet={this.props.imageList}
          multiple
        />
        <textarea
          rows="4"
          cols="100"
          value={this.state.images && JSON.stringify(this.state.images)}
          disabled
        />
        <button type="button" onClick={() => console.log(this.state.image)}>
          OK
        </button>
      </div>
    );
  }
}

export default Select;
