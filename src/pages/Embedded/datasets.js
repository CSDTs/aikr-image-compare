import homecooked0 from "../assets/joeslunch/homecooked/good-10.png";
import homecooked1 from "../assets/joeslunch/homecooked/good-1.png";
import homecooked2 from "../assets/joeslunch/homecooked/good-2.png";
import homecooked3 from "../assets/joeslunch/homecooked/good-3.png";
import homecooked4 from "../assets/joeslunch/homecooked/good-4.png";
import homecooked5 from "../assets/joeslunch/homecooked/good-5.png";
import homecooked6 from "../assets/joeslunch/homecooked/good-6.png";
import homecooked7 from "../assets/joeslunch/homecooked/good-7.png";
import homecooked8 from "../assets/joeslunch/homecooked/good-8.png";
import homecooked9 from "../assets/joeslunch/homecooked/good-9.png";

import factory0 from "../assets/joeslunch/factorymade/bad-10.png";
import factory1 from "../assets/joeslunch/factorymade/bad-1.png";
import factory2 from "../assets/joeslunch/factorymade/bad-2.png";
import factory3 from "../assets/joeslunch/factorymade/bad-3.png";
import factory4 from "../assets/joeslunch/factorymade/bad-4.png";
import factory5 from "../assets/joeslunch/factorymade/bad-5.png";
import factory6 from "../assets/joeslunch/factorymade/bad-6.png";
import factory7 from "../assets/joeslunch/factorymade/bad-7.png";
import factory8 from "../assets/joeslunch/factorymade/bad-8.png";
import factory9 from "../assets/joeslunch/factorymade/bad-9.png";

const homeCookedDataSet = [
	homecooked0,
	homecooked1,
	homecooked2,
	homecooked3,
	homecooked4,
	homecooked5,
	homecooked6,
	homecooked7,
	homecooked8,
	homecooked9,
];

const factoryMadeDataSet = [
	factory0,
	factory1,
	factory2,
	factory3,
	factory4,
	factory5,
	factory6,
	factory7,
	factory8,
	factory9,
];

// const lunchValidationSet = [...homeCookedDataSet, ...factoryMadeDataSet];

const compareSets = {
	lunch: {
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
		validationPool: [...homeCookedDataSet, ...factoryMadeDataSet],
		homepagePrompt:
			"Select some images for both of the categories: home cooked and factory made foods. Once you do that, you can start training your model!",
	},
};

export { compareSets };
