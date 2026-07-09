import { FC, useEffect, useRef, useState } from "react";
import { useSelection } from "../context/SelectionContext";
import transformFiles from "../lib/dropzone/transformFiles";
import styles from "../styles/Dropzone.module.css";
import classNames from "../utils/classNames";

interface Props {
	onDrop?: Function;
	onParseFiles: Function;
	onParseObject: Function;
	style?: any;
	children?: any;
	mode?: any;
	enableDrop?: boolean;
	onImagesUpdate?: (groupA: any[], groupB: any[]) => void;
}

const Dropzone: FC<Props> = ({
	onDrop,
	onParseFiles,
	onParseObject,
	style,
	children,
	mode,
	enableDrop,
	onImagesUpdate,
}) => {
	const [over, setOver] = useState(false);
	const { getSelections } = useSelection();
	const timeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleDrop = async (e: React.DragEvent) => {
		if (onDrop) {
			onDrop();
		}
		e.preventDefault();
		e.persist();

		const folders = await transformFiles(e);

		if (e.dataTransfer.items) {
			e.dataTransfer.items.clear();
		} else {
			e.dataTransfer.clearData();
		}
		onParseFiles(folders);
	};

	const handleOnClick = () => {
		const train = mode !== "Evaluate Images";
		const [groupA, groupB] = getSelections(train ? "training" : "validating");
		const groupALabel = groupA.label;
		const groupBLabel = groupB.label;

		const dataURLtoFile = (dataurl: any, filename: any) => {
			let arr = dataurl.split(","),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}

			return new File([u8arr], filename, { type: mime });
		};

		const getBase64FromUrl = async (url: string) => {
			const data = await fetch(url);
			const blob = await data.blob();
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => {
					const base64data = reader.result;
					resolve(base64data);
				};
			});
		};

		const getAllUrls = async () => {
			const groupAValues = groupA.images;
			const groupBValues = groupB.images;

			if (train && (groupAValues.length === 0 || groupBValues.length === 0)) {
				throw Error("You must select at least one image for home cooked and factory made");
			}

			if (
				!train &&
				(groupAValues.length === 0 || groupAValues === undefined) &&
				(groupBValues.length === 0 || groupBValues === undefined)
			) {
				throw Error("You must select at least one image from either category");
			}

			const arr = new Array<object>();

			for (const img of groupAValues) {
				await getBase64FromUrl(img.src).then((data) => {
					arr.push({
						src: data,
						file: dataURLtoFile(data, "test.png"),
						label: groupALabel,
					});
				});
			}

			for (const img of groupBValues) {
				await getBase64FromUrl(img.src).then((data) => {
					arr.push({
						src: data,
						file: dataURLtoFile(data, "test.png"),
						label: groupBLabel,
					});
				});
			}

			return arr;
		};

		getAllUrls()
			.then((urls) => {
				const convertedImagesNeh = urls.map((val: any) => {
					return {
						label: val.label,
						src: val.src,
						file: val.file,
					};
				});
				return convertedImagesNeh;
			})
			.catch((e) => {
				console.log(e);
				alert(e.message);
			})
			.then((arr) => {
				if (Array.isArray(arr) && arr.length > 0) {
					onParseObject(arr);
					if (onImagesUpdate) {
						onImagesUpdate(groupA.images, groupB.images);
					}
				}
			});
	};

	const stop = (e: any) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (!over) {
			setOver(true);
		}
		timeoutRef.current = window.setTimeout(() => {
			setOver(false);
		}, 50);
		e.preventDefault();
	};

	const className = classNames(styles.container, {
		[styles.over]: over,
	});

	return (
		<>
			{enableDrop && (
				<div className={className} draggable={true} onDrop={handleDrop} onDragOver={stop} style={style}>
					{children || <span>Drop Images To Begin Training</span>}
					<label htmlFor="files" className="d-none">
						Files
					</label>
					<input
						id="files"
						className={styles.input}
						type="file"
						name="files[]"
						data-multiple-caption="{count} files selected"
						multiple={true}
					/>
				</div>
			)}

			{mode !== "selection" && (
				<button onClick={handleOnClick} className="btn btn-primary w-100 ">
					{mode === "train" ? "Train Model" : "Evaluate Model"}
					{/* {mode || "Train Model"} */}
				</button>
			)}
		</>
	);
};

export default Dropzone;
