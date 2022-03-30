import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser as SolidUser } from "@fortawesome/free-solid-svg-icons";
import { faUser as RegUser, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ProgressBar.module.css";

class ProgressBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: "",
		};
	}

	render() {
		let current = this.props.current;

		return (
			<ul className={styles.steps} onClick={this.handleClick}>
				<li
					className={`${styles.step} ${current === 0 ? styles.step__incomplete : styles.step__complete} ${
						current === 0 ? styles.step__active : styles.step__inactive
					}`}>
					<span className={styles.step__icon}></span>
					<span className={styles.step__label}>Select Images</span>
				</li>
				<li
					className={`${styles.step} ${
						current === 0 || current === 1 ? styles.step__incomplete : styles.step__complete
					} ${current === 1 ? styles.step__active : styles.step__inactive}`}>
					<span className={styles.step__icon}></span>
					<span className={styles.step__label}>Train Model</span>
				</li>
				<li
					className={`${styles.step} ${
						current === 0 || current === 1 ? styles.step__incomplete : styles.step__complete
					} ${current === 2 ? styles.step__active : styles.step__inactive}`}>
					<span className={styles.step__icon}></span>
					<span className={styles.step__label}>Evaluate</span>
				</li>
			</ul>
		);
	}
}
export default ProgressBar;
