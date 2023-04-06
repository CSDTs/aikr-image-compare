import { FC, useState } from "react";

import { Map } from "immutable";

import { ImageData } from "../../../types";
import "../ImageSelection.scss";

interface IProps {
	images: any[];
	group: any;
	multiple: boolean;
	onPick: Function;
	maxPicks?: number;
	onMaxPicks?: Function;
}

interface ImagePostSelection extends ImageData {
	src: string;
	value: number;
}

/**
 * Generates an image selection grid to allow users to select images for model training
 */
const SelectionGrid: FC<IProps> = ({ images, group, multiple, onPick, maxPicks, onMaxPicks }) => {
	const [picked, setPicked] = useState<any>(Map());

	const handleImageClick = (image: ImagePostSelection) => {
		const pickedImage = multiple ? picked : Map();
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
					onMaxPicks && onMaxPicks(image);
				}
			}
		}

		if (newerPickedImage) {
			setPicked(newerPickedImage);

			const pickedImageToArray: any = [];
			newerPickedImage.forEach((image: ImageData, i: number) => {
				pickedImageToArray.push({
					data: image,
					value: i,
				});
			});

			onPick(multiple ? pickedImageToArray : pickedImageToArray[0]);
		}
	};

	return (
		<div className="image_picker">
			{images.map((image, idx) => {
				const val = picked.has(image.value);
				const onClick = () => handleImageClick(image);
				return (
					<div className={`responsive${val ? " selected" : ""}`} onClick={onClick} key={idx}>
						<img
							src={image.src}
							className={`thumbnail${val ? " selected" : ""} object-fit-cover`}
							width={150}
							height={150}
							alt="model training visual"
						/>
						<div className="checked">
							<div className="icon" />
						</div>
					</div>
				);
			})}
			<div className="clear" />
		</div>
	);
};

export default SelectionGrid;

// TODO: Update listings when reopened to keep users existing selections.
