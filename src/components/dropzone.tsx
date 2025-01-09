/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
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
}

const Dropzone: FC<Props> = ({ onDrop, onParseFiles, onParseObject, style, children, mode, enableDrop }) => {
	const [over, setOver] = useState(false);
	let timeout: number;

	useEffect(() => {
		return () => {
			if (timeout) {
				clearTimeout(timeout);
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
		let train = mode !== "Evaluate Images";
		let groupALabel = document.querySelectorAll(".card .input-group p")[train ? 0 : 2];
		let groupBLabel = document.querySelectorAll(".card .input-group p")[train ? 1 : 3];
		let groupABody = document.querySelectorAll(".card .card-body")[train ? 0 : 2];
		let groupBBody = document.querySelectorAll(".card .card-body")[train ? 1 : 3];

		let dataURLtoFile = (dataurl: any, filename: any) => {
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
			let groupA = groupABody.querySelector("textarea") as HTMLTextAreaElement;
			let groupB = groupBBody.querySelector("textarea") as HTMLTextAreaElement;

			let groupAValues = [];
			let groupBValues = [];
			try {
				groupAValues = JSON.parse(groupA.value);
				groupBValues = JSON.parse(groupB.value);
			} catch (e) {
				console.error("Failed to parse group values:", e);
			}

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

			let arr = new Array<object>();

			for (let img of groupAValues) {
				await getBase64FromUrl(img.src).then((data) => {
					arr.push({
						src: data,
						file: dataURLtoFile(data, "test.png"),
						label: groupALabel.textContent,
					});
				});
			}

			for (let img of groupBValues) {
				await getBase64FromUrl(img.src).then((data) => {
					arr.push({
						src: data,
						file: dataURLtoFile(data, "test.png"),
						label: groupBLabel.textContent,
					});
				});
			}

			return arr;
		};

		getAllUrls()
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
				console.log(e);
				alert(e.message);
			})
			.then((arr) => {
				onParseObject(arr);
			});
	};

	const stop = (e: any) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		if (!over) {
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
			<button onClick={handleOnClick} className="btn btn-primary w-100 ">
				{mode || "Train Model"}
			</button>
		</>
	);
};

export default Dropzone;
