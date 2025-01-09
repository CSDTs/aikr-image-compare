/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from "react";
import styles from "../styles/Preview.module.css";
import classNames from "../utils/classNames";
import Loading from "./loading";

interface Props {
	images?: string[];
}

const LOOP_SPEED = 75;

const Preview: FC<Props> = ({ images }) => {
	const [imageIdx, setImageIdx] = useState(0);
	const timeoutRef = useRef<NodeJS.Timeout>();
	const lastRef = useRef<number>();

	const loopImages = () => {
		if (lastRef.current) {
			const now = new Date().getTime();
			const diff = now - lastRef.current;
			if (diff > LOOP_SPEED + 200) {
				// 200 ms wiggle room
				// TODO: this indicates a UI slowdown
				// console.log('diff', diff);
			}
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		setImageIdx((prev) => prev + 1);

		lastRef.current = new Date().getTime();
		timeoutRef.current = setTimeout(() => {
			loopImages();
		}, LOOP_SPEED);
	};

	useEffect(() => {
		loopImages();
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []); // Run once on mount

	const src = images && images[imageIdx % images.length];

	const className = classNames(styles.container, {
		[styles.images]: images && images.length > 0,
	});

	return (
		<div className={className}>
			{src ? (
				<div
					className={styles.img}
					style={{
						backgroundImage: `url(${src})`,
					}}
				/>
			) : (
				<div className={styles.loader}>
					<Loading />
					<span>Reading images</span>
				</div>
			)}
		</div>
	);
};

export default Preview;
