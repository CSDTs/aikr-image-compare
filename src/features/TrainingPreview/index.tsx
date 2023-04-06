import { FC, useCallback, useEffect, useRef, useState } from "react";
import Ratio from "react-bootstrap/Ratio";
import { LoadingIcon } from "../../components/ui";
import classNames from "../../utils/classNames";
import styles from "./TrainingPreview.module.scss";

interface IProps {
	images?: string[];
}

const LOOP_SPEED = 75;

/**
 * A component that displays a preview of training images.
 */
const TrainingPreview: FC<IProps> = ({ images }) => {
	const [imageIdx, setImageIdx] = useState<number>(0);

	const last = useRef<number>(0);
	const timeout = useRef<NodeJS.Timeout>();

	const src = images && images[imageIdx % images.length];

	const className = classNames(styles.container, {
		[styles.images]: images && images.length > 0,
	});

	/**
	 * Loops through the images by changing the image index and setting a timeout.
	 */
	const loopImages = useCallback(() => {
		if (last.current) {
			const now = new Date().getTime();
			const diff = now - last.current;
			if (diff > LOOP_SPEED + 200) {
				// 200 ms wiggle room
				// TODO: this indicates a UI slowdown
				// console.log('diff', diff);
			}
		}
		if (timeout.current) {
			clearTimeout(timeout.current);
		}

		setImageIdx((d) => d + 1);

		last.current = new Date().getTime();
		timeout.current = setTimeout(() => {
			loopImages();
		}, LOOP_SPEED);
	}, []);

	/**
	 * Clears the loop by clearing the timeout and setting timeout.current to undefined.
	 */
	const clearLoop = useCallback(() => {
		if (timeout.current) {
			clearTimeout(timeout.current);
			timeout.current = undefined;
		}
	}, []);

	useEffect(() => {
		loopImages();
		return () => clearLoop();
	}, [loopImages, clearLoop]);

	return (
		<div className={className}>
			{src ? (
				<>
					<Ratio aspectRatio={"1x1"} className="mb-3">
						<img src={src} alt="Training visual" className="shadow rounded" />
					</Ratio>
					<div className="d-flex justify-between align-items-center">
						<LoadingIcon />
						<span className="px-2 fw-bold">Training your model...</span>
					</div>
				</>
			) : (
				<div className={styles.loader}>
					<LoadingIcon />
					<span>Reading images</span>
				</div>
			)}
		</div>
	);
};

export default TrainingPreview;
