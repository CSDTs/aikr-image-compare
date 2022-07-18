import React from "react";
import PromptBody from "./SelectionPrompt/selection_prompt_body";
import Prompt from "./SelectionPrompt/selection_prompt";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-picker/dist/index.css";
import "./DataSelection.module.css";

function EmbeddedImageSelection(props) {
	if (!props.embedded) return <></>;
	if (!props.set) return <p>You need to make your selections in the previous lesson.</p>;
	if ((props.count && isNaN(props.count)) || !props.count)
		return <p>You need to select a number of images from the previous screen first.</p>;

	let finalCount = props.count > props.set.length ? props.set.length : props.count;

	let finalSet = props.set.slice(0, finalCount);

	let textValue = finalSet.map((image, i) => {
		return { src: image, value: i };
	});
	return (
		<>
			{finalSet.map((image, i) => (
				<img src={image} alt="" className="col-3 my-2" key={"img" + i} />
			))}

			<textarea rows="4" cols="100" value={JSON.stringify(textValue)} disabled hidden />
		</>
	);
}

class DataSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentGroup: "",
			label: "",
		};
	}

	componentDidMount() {
		this.setState({ currentGroup: this.props.dataset });
	}

	render() {
		let content = (
			<PromptBody imageList={this.state.currentGroup} label={this.props.currentGroup} embedded={this.props.embedded} />
		);

		return (
			<div className="card">
				<div className="card-header">
					<div className="input-group">
						<p className="my-0">{this.props.label}</p>
					</div>
				</div>
				<div className="card-body">
					<section className="px-3">
						{this.props.embedded ? (
							<EmbeddedImageSelection
								embedded={this.props.embedded || false}
								set={this.props.set}
								count={this.props.count}
							/>
						) : (
							<Prompt
								label={this.props.label}
								mode={this.props.mode}
								content={content}
								disabled={this.state.currentGroup === "" && this.props.currentGroup === ""}
							/>
						)}
					</section>
				</div>
			</div>
		);
	}
}

export default DataSelection;
