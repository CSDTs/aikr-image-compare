// Extracts a human-readable category label from prompt/label strings like
// "Select Home Cooked Test Image" or "Select Home Cooked training image".
// Returns "" for non-string input (some call sites pass string | number).
export const parseLabel = (value?: unknown): string => {
	if (typeof value !== "string") {
		return "";
	}
	return value.split("Select")[1]?.split(" Test Image")[0]?.split(" training image")[0]?.trim() ?? "";
};
