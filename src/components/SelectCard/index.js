import React, { Component } from "react";
import PropTypes from "prop-types";

const ImageStyle = (width, height) => {
  return {
    width,
    height,
    objectFit: "cover",
  };
};

export default class SelectCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newSet: false,
    };

    this.reset = false;
  }
  // componentWillUpdate(prevProps) {
  //   if (prevProps.src !== this.props.src) {
  //     console.log("false");
  //     this.setState({ newSet: false });
  //   }
  // }
  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.setState({ newSet: true });
      this.reset = true;
    }
  }
  render() {
    let { src, isSelected, onImageClick } = this.props;

    return (
      <div
        className={`responsive${isSelected ? " selected" : ""}`}
        onClick={onImageClick}
      >
        <img
          src={src}
          className={`thumbnail${isSelected ? " selected" : ""}`}
          style={ImageStyle(150, 150)}
        />
        <div className="checked">
          {/*<img src={imgCheck} style={{ width: 75, height: 75, objectFit: "cover" }}/>*/}
          <div className="icon" />
        </div>
      </div>
    );
  }
}

SelectCard.propTypes = {
  src: PropTypes.string,
  isSelected: PropTypes.bool,
};
