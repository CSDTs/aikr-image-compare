import React, { Component } from "react";
import PropTypes from "prop-types";
import { Map } from "immutable";

import "./index.scss";
import Image from "./components/image";

class ImagePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			picked: Map(),
			selected: this.props.selected,
		};
		this.handleImageClick = this.handleImageClick.bind(this);
		this.renderImage = this.renderImage.bind(this);
	}

	handleImageClick(image) {
		const { multiple, onPick, maxPicks, onMaxPicks } = this.props;
		const pickedImage = multiple ? this.state.picked : Map();
		let newerPickedImage;

		if (pickedImage.has(image.value)) {
			newerPickedImage = pickedImage.delete(image.value);
		} else {
			if (typeof maxPicks === "undefined") {
				newerPickedImage = pickedImage.set(image.value, {
					src: image.src,
					dim_lighting: image.dim_lighting,
					bright_lighting: image.bright_lighting,
					has_square_surfaces: image.has_square_surfaces,
				});
			} else {
				if (pickedImage.size < maxPicks) {
					newerPickedImage = pickedImage.set(image.value, {
						src: image.src,
						dim_lighting: image.dim_lighting,
						bright_lighting: image.bright_lighting,
						has_square_surfaces: image.has_square_surfaces,
					});
				} else {
					onMaxPicks(image);
				}
			}
		}

		if (newerPickedImage) {
			this.setState({ picked: newerPickedImage });

			const pickedImageToArray = [];
			newerPickedImage.map((image, i) => {
				pickedImageToArray.push({
					data: image,
					value: i,
				});
			});

			onPick(multiple ? pickedImageToArray : pickedImageToArray[0]);
		}
	}

	renderImage(image, i, dim_lighting, bright_lighting, has_square_surfaces) {
		const checkIfIncluded = (val) => {
			for (let img of this.props.selected) {
				if (img.value === val) return true;
			}

			return false;
		};

		// TODO rework to allow constant picked state when closing out of modal.  || checkIfIncluded(image.value)
		return (
			<Image
				src={image.src}
				isSelected={this.state.picked.has(image.value)}
				onImageClick={() => this.handleImageClick(image)}
				key={i}
				dim_lighting={image.dim_lighting}
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

ImagePicker.propTypes = {
	images: PropTypes.array,
	multiple: PropTypes.bool,
	onPick: PropTypes.func,
	maxPicks: PropTypes.number,
	onMaxPicks: PropTypes.func,
};

export default ImagePicker;
