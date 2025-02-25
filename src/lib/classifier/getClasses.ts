const getClasses = (classes: string[]) =>
	classes.reduce((labels: { [key: string]: number }, label) => {
		if (labels[label] !== undefined) {
			return labels;
		}

		return {
			...labels,
			[label]: Object.keys(labels).length,
		};
	}, {});

export default getClasses;
