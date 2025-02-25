import { Map } from "immutable";
import { FC, useEffect, useState } from "react";

import "../styles/DataSelection.module.css";
import SelectObject from "./select-object";

interface Image {
	src: string;
	value: number;
	label?: string;
}

interface Props {
	images: Image[];
	multiple?: boolean;
	currentSet?: string[];
	onPick: (selected: Image | Image[]) => void;
}

const SelectObjectContainer: FC<Props> = ({ images, multiple, currentSet, onPick }) => {
	const [picked, setPicked] = useState<Map<number, string>>(Map());

	useEffect(() => {
		if (currentSet) {
			setPicked(Map());
		}
	}, [currentSet]);

	const handleImageClick = (image: Image) => {
		const pickedImage = multiple ? picked : Map<number, string>();
		const newerPickedImage = pickedImage.has(image.value)
			? pickedImage.delete(image.value)
			: pickedImage.set(image.value, image.src);

		setPicked(newerPickedImage as Map<number, string>);

		const pickedImageToArray: Image[] = [];
		newerPickedImage.forEach((src, value) => {
			pickedImageToArray.push({ src, value });
		});

		const finalPicked = multiple ? pickedImageToArray : pickedImageToArray[0];
		onPick(finalPicked!);
	};

	const renderImage = (image: Image, i: number) => {
		return (
			<SelectObject
				src={image.src}
				isSelected={picked.has(image.value)}
				onImageClick={() => handleImageClick(image)}
				key={i}
			/>
		);
	};

	return (
		<div className="image_picker">
			{images.map(renderImage)}
			<div className="clear" />
		</div>
	);
};

export default SelectObjectContainer;
