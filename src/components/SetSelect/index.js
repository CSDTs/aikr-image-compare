import React from "react";
import Select from "../Select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import SelectModal from "./modalset";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-picker/dist/index.css";
import styles from "./SetSelect.module.css";

import { healthyDataSet, unhealthyDataSet } from "./datasets";

class SetSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGroup: "",
      label: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOnImageAdd = this.handleOnImageAdd.bind(this);
  }

  handleChange(event) {
    let val = event.target.value;

    let list;

    if (val === "") list = "";
    if (val === "good") list = healthyDataSet;
    if (val === "bad") list = unhealthyDataSet;

    this.setState({ currentGroup: list });
  }

  handleOnImageAdd() {}

  render() {
    let content;
    if (this.state.currentGroup === "") {
      content = (
        <p className="card-text text-muted">
          Select a data set to work with, then select what images you want to
          train for this group:
        </p>
      );
    } else {
      content = (
        <Select
          imageList={this.state.currentGroup}
          label={this.props.currentGroup}
        />
      );
    }

    return (
      <div className="card">
        <div className="card-header">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon3">
              {this.props.label}
            </span>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
              placeholder="eg. Real Foods"
              defaultValue={this.props.label === "A" ? "Group A" : "Group B"}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <section className="col-md-10">
              <div
                className={
                  styles.inputGroup + " input-group input-group-sm mb-3"
                }
              >
                <label className="input-group-text"> Image Set:</label>
                <select className="form-select" onChange={this.handleChange}>
                  <option value="" defaultValue="">
                    Choose...
                  </option>
                  <option value="good">Good Foods</option>
                  <option value="bad">Bad Foods</option>
                </select>
              </div>
            </section>
          </div>

          <SelectModal
            extra={this.props.label}
            content={content}
            disabled={this.state.currentGroup === ""}
          />
        </div>
      </div>
    );
  }
}

export default SetSelect;
