import React, { Component } from "react";
import { render } from "react-dom";
import SelectImage from "../SelectImage";

import img1 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img2 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img3 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img4 from "../../App/data/training/goodfood/apple sauce + grapes.jpeg";
import img5 from "../../App/data/training/badfood/pizza 2.jpeg";
import img6 from "../../App/data/training/badfood/pizza 2.jpeg";
import img7 from "../../App/data/training/badfood/pizza 2.jpeg";
import img8 from "../../App/data/training/badfood/pizza 2.jpeg";

const imageList = [img1, img2, img3, img4];

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = { images: [], imageList: props.imageList };
  }

  onPickImages(images) {
    this.setState({ images });
  }
  componentDidUpdate(prevProps) {
    if (this.props.imageList !== prevProps.imageList) {
      this.setState({ images: [] });
    }
  }

  render() {
    return (
      <div>
        <h3>Multiple Select</h3>
        <SelectImage
          images={this.props.imageList.map((image, i) => ({
            src: image,
            value: i,
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
