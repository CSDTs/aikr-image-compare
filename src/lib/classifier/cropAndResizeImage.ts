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
		// TODO(types): expandDims(0) actually produces a rank-4 (batched) tensor, so the declared
		// Tensor3D return type is inaccurate. Preserving the existing signature/behavior with a cast.
		return croppedImage.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1)) as tf.Tensor3D;
	});
};

export default cropAndResizeImage;
