export interface IProps {}

export interface ITrainResult {
	epoch: number[];
	history: {
		acc: number[];
		loss: number[];
	};
	model: any;
	params: any;
	validationData: any;
}

export type Image = {
	src: string;
	label: string;
};

export type Prediction = {
	prediction: string;
	label: string;
	src: string;
	score: any;
};

export interface IDatum {
	data: string | number;
	label: string;
}

export interface ImageError {
	image: any;
	error: Error;
	file?: any;
	index: number;
}
