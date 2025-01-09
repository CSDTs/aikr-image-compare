import { FC } from "react";
import styles from "../styles/ProgressBar.module.css";

type Props = {
	current: number;
	handleClick?: () => void;
};

const ProgressBar: FC<Props> = ({ current, handleClick }) => {
	return (
		<ul className={styles.steps} onClick={handleClick}>
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
				<span className={styles.step__label}>Evaluate Images</span>
			</li>
		</ul>
	);
};

export default ProgressBar;
