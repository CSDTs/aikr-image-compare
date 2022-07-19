import homeCookedDataSet from "./realmeals.json";
import factoryMadeDataSet from "./fakemeals.json";
import mealVaidation from "./mealvalidation.json";
export const lunchSet = {
	groupALabel: "Home Cooked",
	groupADataset: homeCookedDataSet,
	groupBLabel: "Factory Made",
	groupBDataset: factoryMadeDataSet,
	title: "Joe's Lunch",
	promptTitle: "Help Save Joe's Lunch!",
	promptBody:
		"Our favorite school cafeteria worker, Chef Joe, is in danger of being put out of work by factory made lunches." +
		"Your cell phone app will be used by students to help them buy only Joe's delicious hand-made lunches. So your" +
		"first step is to train the AI on the two classes of images: authentic hand-made versus factory-produced" +
		"imitations.",
	validationPool: mealVaidation,
	homepagePrompt:
		"Select some images for both of the categories: home cooked and factory made foods. Once you do that, you can start training your model!",
};
