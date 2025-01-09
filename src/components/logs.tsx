import { FC, MouseEvent, useState } from "react";
import styles from "../styles/Logs.module.css";
import classNames from "../utils/classNames";

type Props = {
	logs: {
		[index: string]: string[];
	};
};

const Logs: FC<Props> = ({ logs }) => {
	const [expanded, setExpanded] = useState(false);

	const handleClick = (e: MouseEvent) => {
		setExpanded(!expanded);
	};

	return (
		<div
			className={classNames(styles.logs, {
				[styles.expanded]: expanded,
			})}>
			<div className={styles.expand}>
				<a onClick={handleClick} href="#!">
					&#9654;
				</a>
				<label>Loss</label>
			</div>
			<pre>{logs.loss.join("\n")}</pre>
		</div>
	);
};

export default Logs;
