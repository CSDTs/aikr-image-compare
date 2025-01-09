import { FC, useEffect, useState } from "react";
import SelectObjectContainer from "./select-object-container";

interface Image {
	src: string;
	value: number;
	label?: string;
}
interface Props {
	imageList?: string[];
	label?: string;
}

const PromptBody: FC<Props> = ({ imageList = [], label }) => {
	const [images, setImages] = useState<Image | Image[]>([]);

	useEffect(() => {
		if (imageList) {
			setImages([]);
		}
	}, [imageList]);

	const onPickImages = (selectedImages: Image | Image[]) => {
		setImages(selectedImages);
	};

	return (
		<div>
			<SelectObjectContainer
				images={imageList.map((image, i) => ({
					src: image,
					value: i,
					label,
				}))}
				onPick={onPickImages}
				currentSet={imageList}
				multiple
			/>
			<textarea rows={4} cols={100} value={images && JSON.stringify(images)} disabled hidden />
		</div>
	);
};

export default PromptBody;
