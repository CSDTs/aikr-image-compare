import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";

export type SelectionMode = "training" | "validating";
export type GroupKey = "A" | "B";

export interface SelectionImage {
	src: string;
}

export interface SelectionGroup {
	label: string;
	images: SelectionImage[];
}

interface SelectionContextValue {
	/** Upsert a single group's selection (label + images) for a mode. */
	setSelection: (mode: SelectionMode, groupKey: GroupKey, label: string, images: SelectionImage[]) => void;
	/** Return the two groups for a mode as an ordered [groupA, groupB] tuple. */
	getSelections: (mode: SelectionMode) => [SelectionGroup, SelectionGroup];
}

const emptyGroup = (): SelectionGroup => ({ label: "", images: [] });

const keyOf = (mode: SelectionMode, groupKey: GroupKey) => `${mode}:${groupKey}`;

const SelectionContext = createContext<SelectionContextValue | null>(null);

interface ProviderProps {
	children: ReactNode;
}

export const SelectionProvider: FC<ProviderProps> = ({ children }) => {
	const [selections, setSelections] = useState<Record<string, SelectionGroup>>({});

	// Mirror the latest selections into a ref so getSelections always reads the
	// current value even when a consumer captured an older render's callback
	// (e.g. Dropzone's click handler reading at click time).
	const selectionsRef = useRef(selections);
	selectionsRef.current = selections;

	const setSelection = useCallback(
		(mode: SelectionMode, groupKey: GroupKey, label: string, images: SelectionImage[]) => {
			const key = keyOf(mode, groupKey);
			setSelections((prev) => {
				const existing = prev[key];
				if (existing && existing.label === label && existing.images === images) {
					return prev;
				}
				return { ...prev, [key]: { label, images } };
			});
		},
		[]
	);

	const getSelections = useCallback((mode: SelectionMode): [SelectionGroup, SelectionGroup] => {
		const current = selectionsRef.current;
		return [current[keyOf(mode, "A")] ?? emptyGroup(), current[keyOf(mode, "B")] ?? emptyGroup()];
	}, []);

	const value = useMemo<SelectionContextValue>(() => ({ setSelection, getSelections }), [setSelection, getSelections]);

	return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = (): SelectionContextValue => {
	const ctx = useContext(SelectionContext);
	if (!ctx) {
		throw new Error("useSelection must be used within a SelectionProvider");
	}
	return ctx;
};

export default SelectionContext;
