export interface IFileData {
	label: string;
	file: any;
	src: string;
}

export interface IImageData {
	label: string;
	image: HTMLImageElement;
}

export const loadImage = async (src: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.src = src;
		image.onload = () => resolve(image);
		image.onerror = (err) => reject(err);
	});

export const getFilesAsImageArray = async (files: FileList): Promise<IFileData[]> => {
	console.log(files);
	const images = [];
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const label = file.name.split("/").slice(-2)[0]; // Get parent folder name as label
		const reader = new FileReader();

		const src = await new Promise<string>((resolve) => {
			reader.onload = () => resolve(reader.result as string);
			reader.readAsDataURL(file);
		});

		images.push({
			label,
			src,
			file,
		});
	}
	return images;
};

export default getFilesAsImageArray;

export const splitImagesFromLabels = async (images: IFileData[]) => {
	const origData: {
		images: string[];
		labels: string[];
		files: any[];
	} = {
		images: [],
		labels: [],
		files: [],
	};

	return images.reduce(
		(data, { src, label, file }: IFileData) => ({
			images: data.images.concat(src),
			labels: data.labels.concat(label),
			files: data.files.concat(file),
		}),
		origData
	);
};
