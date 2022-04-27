import React from "react";
import PromptBody from "./SelectionPrompt/selection_prompt_body";
import Prompt from "./SelectionPrompt/selection_prompt";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-picker/dist/index.css";
import "./DataSelection.module.css";

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
		let content = <PromptBody imageList={this.state.currentGroup} label={this.props.currentGroup} />;

		return (
			<div className="card">
				<div className="card-header">
					<div className="input-group">
						<p className="my-0">{this.props.label}</p>
					</div>
				</div>
				<div className="card-body">
					<section className="px-3">
						<Prompt
							label={this.props.label}
							mode={this.props.mode}
							content={content}
							disabled={this.state.currentGroup === "" && this.props.currentGroup === ""}
						/>
					</section>
				</div>
			</div>
		);
	}
}

export default DataSelection;
