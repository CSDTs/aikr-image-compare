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

export interface ImageData {
	image: string;
	dim_lighting: boolean;
	bright_lighting: boolean;
	has_square_surfaces: boolean;
}

export interface ImageDataReduced {
	src: string;
	value: number;
}

export interface Group {
	label: string;
	dataset: Array<ImageData>;
	selected: ImageDataReduced[];
	corporate_score: Array<Number>;
	validate_selected: ImageDataReduced[];
}
export interface Data {
	group_a: Group;
	group_b: Group;
	header: string;
	prompt_header: string;
	prompt_body: string;
	validation_pool: Array<ImageData>;
	homepage_prompt: string;
}

export type Accuracy = {
	training?: number;
	evaluation?: number;
};

export interface IImage {
	imageSrc: string;
	label: string;
}
export interface IParams {
	[index: string]: any;
}
export interface IPrediction {
	prediction: string;
	label: string;
	src: string;
	score: any;
}
export interface ImageError {
	image: any;
	error: Error;
	file?: any;
	index: number;
}
export interface IImageSearch {
	src: string;
	label: string;
}
