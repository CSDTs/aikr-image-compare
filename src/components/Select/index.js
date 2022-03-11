import React, { Component } from "react";
import { render } from "react-dom";
import SelectImage from "../SelectImage";
import getFile from "../../Dropzone/getFile";

import { image } from "@tensorflow/tfjs";

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
      </div>
    );
  }
}

export default Select;
