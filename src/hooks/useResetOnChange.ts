import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Owns a piece of state that resets to `resetValue` whenever `dep` changes.
export function useResetOnChange<T>(resetValue: T, dep: unknown): [T, Dispatch<SetStateAction<T>>] {
	const [state, setState] = useState<T>(resetValue);
	useEffect(() => {
		setState(resetValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dep]);
	return [state, setState];
}
