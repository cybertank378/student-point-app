//Files: src/modules/student/presentation/hooks/useSessionStorage.ts
"use client";

import { useCallback } from "react";

export function useSessionStorage(key: string) {

	const save = useCallback((value: string) => {
		if (typeof window === "undefined") return;

		sessionStorage.setItem(key, value);
	}, [key]);

	const get = useCallback((): string | null => {
		if (typeof window === "undefined") return null;

		return sessionStorage.getItem(key);
	}, [key]);

	const remove = useCallback(() => {
		if (typeof window === "undefined") return;

		sessionStorage.removeItem(key);
	}, [key]);

	return {
		save,
		get,
		remove
	};
}