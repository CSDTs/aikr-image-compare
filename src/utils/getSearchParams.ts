//Handles the specific help and download options for the app
const qs: {
	SHOW_HELP?: string;
	SHOW_DOWNLOAD?: string;
} = (window.location.search.split("?").pop() || "")
	.split("&")
	.filter((p) => p)
	.map((p) => p.split("="))
	.reduce(
		(obj, [key, val]) => ({
			...obj,
			[key]: val === "1" || val === "true" ? true : false,
		}),
		{}
	);

// Handles posible query params that can be passed through for a custom app
const querySearch: {
	embedded?: string;
	classACount?: string;
	classBCount?: string;
	classASet?: string;
	classBSet?: string;
	dataset?: string;
} = (window.location.search.split("?").pop() || "")
	.split("&")
	.filter((p) => p)
	.map((p) => p.split("="))
	.reduce(
		(obj, [key, val]) => ({
			...obj,
			[key]: val,
		}),
		{}
	);

export { qs, querySearch };
