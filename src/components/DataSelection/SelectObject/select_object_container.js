import React, { Component } from "react";
import PropTypes from "prop-types";
import { Map } from "immutable";

import "../DataSelection.module.css";
import SelectObject from "./select_object";

class SelectObjectContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			picked: Map(),
			currentSet: "",
		};
		this.handleImageClick = this.handleImageClick.bind(this);
		this.renderImage = this.renderImage.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.currentSet !== prevProps.currentSet) {
			this.setState({ picked: Map() });
		}
	}

	handleImageClick(image) {
		const { multiple, onPick } = this.props;
		const pickedImage = multiple ? this.state.picked : Map();
		const newerPickedImage = pickedImage.has(image.value)
			? pickedImage.delete(image.value)
			: pickedImage.set(image.value, image.src);

		this.setState({ picked: newerPickedImage });

		const pickedImageToArray = [];
		newerPickedImage.map((image, i) => pickedImageToArray.push({ src: image, value: i }));

		onPick(multiple ? pickedImageToArray : pickedImageToArray[0]);
	}

	renderImage(image, i) {
		return (
			<SelectObject
				src={image.src}
				isSelected={this.state.picked.has(image.value)}
				onImageClick={() => this.handleImageClick(image)}
				key={i}
			/>
		);
	}

	render() {
		const { images } = this.props;
		return (
			<div className="image_picker">
				{images.map(this.renderImage)}
				<div className="clear" />
			</div>
		);
	}
}

SelectObjectContainer.propTypes = {
	images: PropTypes.array,
	multiple: PropTypes.bool,
	onPick: PropTypes.func,
};

export default SelectObjectContainer;
