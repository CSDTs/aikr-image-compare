import React, { DragEvent, FC, useEffect, useState } from "react";
import styles from "./Dropzone.module.scss";

import { classNames, getAllUrls, transformFiles } from "../../../utils";

import { useDataStore } from "../../../store";
interface DropzoneProps {
	onDrop?: Function;
	onParseFiles: Function;
	onParseObject: Function;
	children?: any;
	mode?: any;
	enableDrop?: boolean;
}

const Dropzone: FC<DropzoneProps> = (props) => {
	const [over, setOver] = useState(false);

	let timeout: any;
	let enableFileDrop = props.enableDrop;

	const groupA = useDataStore((state) => state.data.group_a);
	const groupB = useDataStore((state) => state.data.group_b);

	/**
	 * Handles the drop event, transforms the dropped files into an array of folders,
	 * and calls the onParseFiles prop with the resulting array.
	 *
	 * @param e The drag event.
	 */
	const handleDrop = async (e: DragEvent) => {
		if (props.onDrop) {
			props.onDrop();
		}
		e.preventDefault();
		e.persist();

		const folders = await transformFiles(e);
		if (e.dataTransfer.items) {
			e.dataTransfer.items.clear();
		} else {
			e.dataTransfer.clearData();
		}
		props.onParseFiles(folders);
	};

	/**
	 * Handles the onClick event for the button, retrieves the base64-encoded image data
	 * and associated file objects for the selected or validate_selected images, and
	 * calls the onParseObject prop with the resulting array of objects.
	 */
	const handleOnClick = () => {
		getAllUrls(groupA, groupB, props?.mode)
			.then((urls) => {
				let convertedImagesNeh = urls.map((val: any) => {
					return {
						label: val.label,
						src: val.src,
						file: val.file,
					};
				});
				return convertedImagesNeh;
			})
			.catch((e) => {
				alert(e);
				console.error(e);
			})
			.then((arr) => {
				props.onParseObject(arr);
			});
	};

	/**
	 * Handles the onDragOver event for the Dropzone component.
	 *
	 * @param e The event object.
	 */
	const handleDragOver = (e: any) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		if (over === false) {
			setOver(true);
		}
		timeout = window.setTimeout(() => {
			setOver(false);
		}, 50);
		e.preventDefault();
	};

	const className = classNames(styles.container, {
		[styles.over]: over,
	});

	useEffect(() => {
		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [timeout]);
	return (
		<>
			{enableFileDrop && (
				<div
					className={`${className} ${props.mode === "Evaluate Images" ? styles.evaluation : ""}`}
					draggable={true}
					onDrop={handleDrop}
					onDragOver={handleDragOver}>
					{props.children || <span>Drop Images To Begin Training</span>}
					<input
						className={styles.input}
						type="file"
						name="files[]"
						data-multiple-caption="{count} files selected"
						multiple={true}
						aria-label="..."
					/>
				</div>
			)}

			<button onClick={handleOnClick} className="btn btn-primary w-100 ">
				{props.mode || "Train Model"}
			</button>
		</>
	);
};

export default Dropzone;

// const handleDrag = (over: boolean) => {
// 	return (e: React.DragEvent) => {
// 		e.preventDefault();
// 		setOver(over);
// 	};
// };
