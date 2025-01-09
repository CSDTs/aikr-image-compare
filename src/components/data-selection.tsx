import { FC, useEffect, useState } from "react";
import Prompt from "./prompt";
import PromptBody from "./prompt-body";

import "react-image-picker/dist/index.css";
import "../styles/DataSelection.module.css";

interface Props {
	dataset?: string[];
	currentGroup?: string;
	label?: string;
	mode?: string;
}

const DataSelection: FC<Props> = ({ dataset, currentGroup, label, mode }) => {
	const [currentGroupState, setCurrentGroup] = useState<string[]>([]);

	useEffect(() => {
		if (dataset) {
			setCurrentGroup(dataset);
		}
	}, [dataset]);

	const content = <PromptBody imageList={currentGroupState} label={currentGroup} />;

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
					/>
				</section>
			</div>
		</div>
	);
};

export default DataSelection;
