import { FC, useEffect, useState } from "react";
import { GroupKey, SelectionImage, SelectionMode, useSelection } from "../context/SelectionContext";
import { useResetOnChange } from "../hooks/useResetOnChange";
import Prompt from "./prompt";
import PromptBody from "./prompt-body";

import "../styles/image-picker.css";
import "../styles/DataSelection.module.css";

interface Image {
	src: string;
	value: number;
	label?: string;
}

interface Props {
	dataset?: string[];
	currentGroup?: string;
	label?: string;
	mode?: string;
	groupKey: GroupKey;
	onImagesSelected?: (images: any[]) => void;
}

const DataSelection: FC<Props> = ({ dataset, currentGroup, label, mode, groupKey, onImagesSelected }) => {
	// setCurrentGroup is unused here (this component only ever reads the reset value).
	const [currentGroupState] = useResetOnChange<string[]>(dataset ?? [], dataset);
	// Live selection inside the open modal (mirrors SelectObjectContainer's picks).
	const [liveSelection, setLiveSelection] = useState<SelectionImage[]>([]);
	// Committed selection (snapshotted when the modal closes).
	const [committedImages, setCommittedImages] = useState<SelectionImage[]>([]);

	const { setSelection } = useSelection();

	// Keep the context entry in sync with the current label and committed images.
	useEffect(() => {
		setSelection((mode as SelectionMode) ?? "training", groupKey, label ?? "", committedImages);
	}, [mode, groupKey, label, committedImages, setSelection]);

	const handlePick = (selected: Image | Image[]) => {
		const arr = Array.isArray(selected) ? selected : selected ? [selected] : [];
		setLiveSelection(arr.map((img) => ({ src: img.src })));
	};

	const handleImagesSelected = (images: SelectionImage[]) => {
		setCommittedImages(images);
		if (onImagesSelected) {
			onImagesSelected(images);
		}
	};

	const content = <PromptBody imageList={currentGroupState} label={currentGroup} onPick={handlePick} />;

	return (
		<div className="card">
			<div className="card-header">
				<div className="input-group">
					<p className="my-0">{label}</p>
				</div>
			</div>
			<div className="card-body">
				<section className="px-3">
					<Prompt
						label={label}
						mode={mode as "training" | "validating"}
						content={content}
						disabled={currentGroupState.length === 0 && currentGroup === ""}
						selectedImages={liveSelection}
						onImagesSelected={handleImagesSelected}
					/>
				</section>
			</div>
		</div>
	);
};

export default DataSelection;
