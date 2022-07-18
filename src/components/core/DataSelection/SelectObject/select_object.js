import React from "react";
import PropTypes from "prop-types";

const ImageStyle = (width, height) => {
	return {
		width,
		height,
		objectFit: "cover",
	};
};

export default class SelectObject extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newSet: false,
		};

		this.reset = false;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.src !== this.props.src) {
			this.setState({ newSet: true });
			this.reset = true;
		}
	}
	render() {
		let { src, isSelected, onImageClick } = this.props;

		return (
			<div className={`responsive${isSelected ? " selected" : ""} mx-auto`} onClick={onImageClick}>
				<img src={src} className={`thumbnail${isSelected ? " selected" : ""}`} style={ImageStyle(150, 150)} alt="" />
				<div className="checked">
					<div className="icon" />
				</div>
			</div>
		);
	}
}

SelectObject.propTypes = {
	src: PropTypes.string,
	isSelected: PropTypes.bool,
};
