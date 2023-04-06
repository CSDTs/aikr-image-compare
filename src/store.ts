import produce from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ImageData, ImageDataReduced } from "./types";

interface BearState {
	bears: number;
	increase: (by: number) => void;
}

interface DataState {
	data: Data;

	setData: (obj: Data) => void;
	getData: (key: string) => void;
	updateGroupSelection: (groupKey: keyof Data, newGroup: Partial<Group>) => void;
}
interface IPrediction {
	prediction: string;
	label: string;
	src: string;
	score: any;
}

interface ClassifierState {
	predictions: IPrediction[];
	updatePredictions: (newPrediction: IPrediction) => void;
	setValue: (prop: keyof ClassifierState, value: ClassifierState[keyof ClassifierState]) => void;
}

interface Data {
	group_a: Group;
	group_b: Group;
	header: string;
	prompt_header: string;
	prompt_body: string;
	validation_pool: Array<ImageData>;
	homepage_prompt: string;
}

interface Group {
	label: string;
	dataset: Array<ImageData>;
	selected: ImageDataReduced[];
	validate_selected: ImageDataReduced[];
	corporate_score: Array<Number>;
}

const useBearStore = create<BearState>()(
	devtools(
		persist(
			(set) => ({
				bears: 0,
				increase: (by) => set((state) => ({ bears: state.bears + by })),
			}),
			{
				name: "bear-storage",
			}
		)
	)
);

const useDataStore = create<DataState>()((set, get) => ({
	data: {
		group_a: {
			label: "",
			dataset: [],
			corporate_score: [],
			selected: [],
			validate_selected: [],
		},
		group_b: {
			label: "",
			dataset: [],
			corporate_score: [],
			selected: [],
			validate_selected: [],
		},
		header: "",
		prompt_header: "",
		prompt_body: "",
		validation_pool: [],
		homepage_prompt: "",
	},
	setData: (obj) => set({ data: obj }),
	getData: (key) => get().data[key],
	updateGroupSelection: (groupKey, newGroup) =>
		set(
			produce((draft) => {
				draft.data[groupKey] = { ...draft.data[groupKey], ...newGroup };
			})
		),
}));

const useClassifierStore = create<ClassifierState>()((set, get) => ({
	predictions: [],

	updatePredictions: (newPrediction) => set((state) => ({ predictions: [...state.predictions, newPrediction] })),
	setValue: (prop: keyof ClassifierState, value: ClassifierState[keyof ClassifierState]) => {
		set((prev) => ({ ...prev, [prop]: value }));
	},
}));

export { useBearStore, useClassifierStore, useDataStore };
