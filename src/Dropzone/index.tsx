import * as React from "react";
import classNames from "../utils/classNames";
import transformFiles from "./transformFiles";
import styles from "./Dropzone.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
interface IProps {
	onDrop?: Function;
	onParseFiles: Function;
	onParseObject: Function;
	style?: any;
	children?: any;
	mode?: any;
}

interface IState {
	over: boolean;
}

class Dropzone extends React.Component<IProps, IState> {
	private timeout: number;
	constructor(props: IProps) {
		super(props);

		this.state = {
			over: false,
		};
	}

	public handleDrop = async (e: React.DragEvent) => {
		if (this.props.onDrop) {
			this.props.onDrop();
		}
		e.preventDefault();
		e.persist();

		// console.log('pre transforming files');
		const folders = await transformFiles(e);
		// console.log('post transforming files');
		if (e.dataTransfer.items) {
			e.dataTransfer.items.clear();
		} else {
			e.dataTransfer.clearData();
		}
		this.props.onParseFiles(folders);
	};

	public handleDrag = (over: boolean) => {
		return (e: React.DragEvent) => {
			e.preventDefault();
			this.setState({
				over,
			});
		};
	};

	public handleOnClick = () => {
		const groupALabel = document.querySelectorAll(".card .input-group input")[0];
		const groupBLabel = document.querySelectorAll(".card .input-group input")[1];

		const groupABody = document.querySelectorAll(".card .card-body")[0];
		const groupBBody = document.querySelectorAll(".card .card-body")[1];

		// console.log(groupALabel, groupBLabel);

		// console.log(groupABody, groupBBody);

		// console.log(groupABody.querySelector(`p`));

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

			if (groupA === null || groupB === null) throw Error("You must select a data set for each group");

			let groupAValues = JSON.parse(groupA.value);
			let groupBValues = JSON.parse(groupB.value);

			if (groupAValues.length === 0 || groupBValues.length === 0)
				throw Error("You must select at least one image for each group");

			let arr = new Array<object>();

			for (let img of groupAValues) {
				await getBase64FromUrl(img.src).then((data) => {
					arr.push({
						src: data,
						file: dataURLtoFile(data, "test.png"),
						label: (groupALabel as HTMLInputElement).value,
					});
				});
			}

			for (let img of groupBValues) {
				await getBase64FromUrl(img.src).then((data) => {
					arr.push({
						src: data,
						file: dataURLtoFile(data, "test.png"),
						label: (groupBLabel as HTMLInputElement).value,
					});
				});
			}

			return arr;
		};

		if (this.props?.mode === "Evaluate Images") {
			const trainingLabel = document.querySelectorAll(".card .input-group input")[2];
			const trainingBody = document.querySelectorAll(".card .card-body")[2];

			const getTestUrls = async () => {
				let groupA = trainingBody.querySelector("textarea") as HTMLTextAreaElement;

				if (groupA === null) throw Error("You must select a data set for each group");

				let groupAValues = JSON.parse(groupA.value);

				if (groupAValues.length === 0) throw Error("You must select at least one image for each group");

				let arr = new Array<object>();

				for (let img of groupAValues) {
					await getBase64FromUrl(img.src).then((data) => {
						arr.push({
							src: data,
							file: dataURLtoFile(data, "test.png"),
							label: (trainingLabel as HTMLInputElement).value,
						});
					});
				}

				return arr;
			};

			getTestUrls()
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
				})
				.then((arr) => {
					this.props.onParseObject(arr);
				});
			return;
		}

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
				alert(e);
			})
			.then((arr) => {
				this.props.onParseObject(arr);
			});
	};
	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}

	public stop = (e: any) => {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		if (this.state.over === false) {
			this.setState({
				over: true,
			});
		}
		this.timeout = window.setTimeout(() => {
			this.setState({
				over: false,
			});
		}, 50);
		e.preventDefault();
	};

	public render() {
		const className = classNames(styles.container, {
			[styles.over]: this.state.over,
		});

		let isHidden = this.props.mode === "Evaluate Images";
		return (
			<>
				<div
					className={className}
					draggable={true}
					// onDragStart={this.handleDrag(true)}
					// onDragEnd={this.handleDrag(false)}
					// onDrop={this.handleDrop}
					// onClick={this.handleOnClick}
					onDragOver={this.stop}
					style={this.props.style}
					// hidden={isHidden}
					hidden>
					{/* {this.props.children || <span>Drop Images To Begin Training</span>} */}
					{/* <input
            className={styles.input}
            type="file"
            name="files[]"
            data-multiple-caption="{count} files selected"
            multiple={true}
          /> */}
				</div>
				<button onClick={this.handleOnClick} className="btn btn-primary w-100 ">
					{this.props.mode || "Train Model"}
				</button>
			</>
		);
	}
}

export default Dropzone;
