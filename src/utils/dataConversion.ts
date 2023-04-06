import { Group, IImageSearch } from "../types";
/**
 * Converts a data URL to a file object.
 *
 * @param dataUrl The data URL to convert.
 * @param fileName The name of the file.
 * @returns The converted file object.
 */
const dataURLtoFile = (dataUrl: any, fileName: any) => {
	let arr = dataUrl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], fileName, { type: mime });
};

/**
 * Converts a URL to a base64-encoded data URL.
 *
 * @param url The URL to convert.
 * @returns A Promise that resolves to the base64-encoded data URL.
 */

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

/**
 * Updates an array with base64-encoded image data and associated file objects
 * from a group's selected or validate_selected images.
 *
 * @param arr The array to update.
 * @param group The group object to get images from.
 * @param mode The mode of the dropzone ('train' or 'validate'). NOTE: Undefined means training....
 */
const updateSelectedData = async (arr: Array<object>, group: Group, mode: string | undefined) => {
	let imageGroup = mode === undefined ? group.selected : group.validate_selected;
	for (let img of imageGroup) {
		await getBase64FromUrl(img.src).then((data) => {
			arr.push({
				src: data,
				file: dataURLtoFile(data, "test.png"),
				label: group.label,
			});
		});
	}
};

/**
 * Retrieves the base64-encoded image data and associated file objects
 * for the selected or validate_selected images from the provided groups,
 * and returns the resulting array of objects.
 *
 * @param groupA The first group object.
 * @param groupB The second group object.
 * @param mode The mode of the dropzone ('train' or 'validate').
 */
const getAllUrls = async (groupA: Group, groupB: Group, mode: string | undefined) => {
	let arr = new Array<object>();

	if (mode === undefined) {
		if (groupA?.selected === undefined || groupB?.selected === undefined)
			throw new Error("You must select at least one image for each group to train.");

		groupA.selected && (await updateSelectedData(arr, groupA, mode));
		groupB.selected && (await updateSelectedData(arr, groupB, mode));
	} else {
		if (groupA?.validate_selected === undefined && groupB?.validate_selected === undefined)
			throw new Error("You must select at least one image from either group to validate.");

		groupA.validate_selected && (await updateSelectedData(arr, groupA, mode));
		groupB.validate_selected && (await updateSelectedData(arr, groupB, mode));
	}

	return arr;
};

const splitImagesFromLabels = async (images: IImageSearch[]) => {
	const CORS_BYPASS = "https://fast-cove-30289.herokuapp.com/"; // Heroku app to bypass CORS

	const origData: {
		images: string[];
		labels: string[];
	} = {
		images: [],
		labels: [],
	};

	return images.reduce(
		(data, image: IImageSearch) => ({
			images: data.images.concat(`${CORS_BYPASS}${image.src}`),
			labels: data.labels.concat(image.label),
		}),
		origData
	);
};

export { dataURLtoFile, getAllUrls, getBase64FromUrl, splitImagesFromLabels };
