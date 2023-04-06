import { FC, useState } from "react";
import { classNames } from "../../../utils";
import styles from "../AdvancedMetrics.module.scss";

interface IProps {
	logs: {
		[index: string]: any;
	};
}

/**
 * With the MLClassifier package, it comes with the idea of loss when training a model for classification.
 * This prints out the logs with loss of the images trained.
 */
const Logs: FC<IProps> = ({ logs }) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	const handleClick = (e: any) => {
		setExpanded(!expanded);
	};
	return (
		<div
			className={classNames(styles.logs, {
				[styles.expanded]: expanded,
			})}>
			<div className={styles.expand}>
				<button onClick={handleClick}>&#9654;</button>
				<label>Loss</label>
			</div>
			<pre>{logs.loss.join("\n")}</pre>
		</div>
	);
};
export default Logs;
