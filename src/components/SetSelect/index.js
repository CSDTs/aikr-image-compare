import React from "react";
import Select from "../Select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import SelectModal from "./modalset";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-picker/dist/index.css";
import styles from "./SetSelect.module.css";

import { healthyDataSet, unhealthyDataSet, completeDataSet } from "./datasets";

class SetSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentGroup: "",
			label: "",
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleOnImageAdd = this.handleOnImageAdd.bind(this);
	}

	handleChange(event) {
		let val = event.target.value;

		let list;

		if (val === "") list = "";
		if (val === "good") list = healthyDataSet;
		if (val === "bad") list = unhealthyDataSet;
		if (val === "all") list = completeDataSet;

		this.setState({ currentGroup: list });
	}

	handleSelect(event) {
		let val = event.target.value;

		if (val === "bad") {
			this.setState({ label: "Factory Made" });
		} else {
			this.setState({ label: "Home Cooked" });
		}
		this.setState({ currentGroup: completeDataSet });

		// let inputControlList = document.querySelectorAll(".card-header .input-group input");
		// let current = inputControlList[inputControlList.length - 1]?.value;

		// console.log(document.querySelectorAll(".card-header .input-group input"));
		// current.value = this.state.label;
	}

	componentDidMount() {
		let list;

		if (this.props.currentGroup === "") list = "";
		if (this.props.currentGroup === "good") list = healthyDataSet;
		if (this.props.currentGroup === "bad") list = unhealthyDataSet;
		if (this.props.currentGroup === "all") {
			list = completeDataSet;
			this.setState({ label: "Home Cooked" });
		}
		this.setState({ currentGroup: list });
	}

	handleOnImageAdd() {}

	render() {
		let content;
		let inputType;
		if (this.state.currentGroup === "") {
			content = (
				<p className="card-text text-muted">
					Select a data set to work with, then select what images you want to train for this group:
				</p>
			);
		} else {
			content = <Select imageList={this.state.currentGroup} label={this.props.currentGroup} />;
		}

		if (this.props.label) {
			inputType = (
				// <h6 className="mb-0">{this.props.label}</h6>
				<input
					type="text"
					className="form-control"
					aria-describedby="basic-addon3"
					placeholder="eg. Real Foods"
					defaultValue={this.props.label}
					disabled
				/>
			);
		} else {
			inputType = (
				<section className="w-100">
					<input
						type="text"
						className="form-control"
						aria-describedby="basic-addon3"
						placeholder="eg. Real Foods"
						defaultValue={this.state.label}
						disabled
						hidden
					/>

					<select className="form-select" onChange={this.handleSelect}>
						<option value="good">Home Cooked</option>
						<option value="bad">Factory Made</option>
					</select>
				</section>
			);
		}

		return (
			<div className="card">
				<div className="card-header">
					<div className="input-group ">{inputType}</div>
				</div>
				<div className="card-body">
					<div className="row">
						<section className="col-md-10" hidden={this.props.currentGroup}>
							<div className={styles.inputGroup + " input-group input-group-sm mb-3"}>
								<label className="input-group-text"> Image Set:</label>
								<select
									className="form-select"
									onChange={this.handleChange}
									value={this.props.currentGroup ? this.props.currentGroup : ""}>
									<option value="" defaultValue="">
										Choose...
									</option>
									<option value="good">Home Cooked</option>
									<option value="bad">Factory Made</option>
								</select>
							</div>
						</section>
					</div>

					<section className="px-3">
						<SelectModal
							extra={this.props.label}
							content={content}
							disabled={this.state.currentGroup === "" && this.props.currentGroup === ""}
						/>
					</section>
				</div>
			</div>
		);
	}
}

export default SetSelect;
