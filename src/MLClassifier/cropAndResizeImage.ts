//@ts-nocheck
import * as tf from "@tensorflow/tfjs";

const crop = (img: tf.Tensor3D) => {
	const size = Math.min(img.shape[0], img.shape[1]);
	const centerHeight = img.shape[0] / 2;
	const beginHeight = centerHeight - size / 2;
	const centerWidth = img.shape[1] / 2;
	const beginWidth = centerWidth - size / 2;
	return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
};

// convert pixel data into a tensor
const cropAndResizeImage = async (img: tf.Tensor3D, dims: [number, number]): Promise<tf.Tensor3D> => {
	return tf.tidy(() => {
		const croppedImage = crop(tf.image.resizeBilinear(img, dims));
		return croppedImage.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
	});
};

export default cropAndResizeImage;
