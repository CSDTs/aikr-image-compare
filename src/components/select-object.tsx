import { FC, useEffect, useState } from "react";

interface ImageStyleProps {
	width: number;
	height: number;
	objectFit: "cover";
}

const ImageStyle = (width: number, height: number): ImageStyleProps => {
	return {
		width,
		height,
		objectFit: "cover",
	};
};

interface SelectObjectProps {
	src: string;
	isSelected?: boolean;
	onImageClick?: () => void;
}

const SelectObject: FC<SelectObjectProps> = ({ src, isSelected, onImageClick }) => {
	const [newSet, setNewSet] = useState(false);
	let reset = false;

	useEffect(() => {
		setNewSet(true);
		reset = true;
	}, [src]);

	return (
		<div className={`responsive${isSelected ? " selected" : ""} mx-auto`} onClick={onImageClick}>
			<img src={src} className={`thumbnail${isSelected ? " selected" : ""}`} style={ImageStyle(150, 150)} alt="" />
			<div className="checked">
				<div className="icon" />
			</div>
		</div>
	);
};

export default SelectObject;
