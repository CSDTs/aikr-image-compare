import { FC, useEffect } from "react";
import SelectObjectContainer from "./select-object-container";

interface Image {
	src: string;
	value: number;
	label?: string;
}
interface Props {
	imageList?: string[];
	label?: string;
	onPick?: (selected: Image | Image[]) => void;
}

const PromptBody: FC<Props> = ({ imageList = [], label, onPick }) => {
	// SelectObjectContainer resets its picked set whenever the image list changes
	// (and on mount, which — because the modal unmounts its body on close — happens
	// each time the modal is opened). Mirror that reset up to the parent so the
	// live selection starts empty for every fresh open.
	useEffect(() => {
		onPick?.([]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageList]);

	return (
		<div>
			<SelectObjectContainer
				images={imageList.map((image, i) => ({
					src: image,
					value: i,
					label,
				}))}
				onPick={(selected) => onPick?.(selected)}
				currentSet={imageList}
				multiple
			/>
		</div>
	);
};

export default PromptBody;
