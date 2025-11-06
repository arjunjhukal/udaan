// utils/localStorageUtil.ts

/**
 * Save a value to localStorage
 * @param key string key
 * @param value any value (will be serialized to JSON)
 */
export const setItem = (key: string, value: unknown) => {
	try {
		const serializedValue = JSON.stringify(value);
		localStorage.setItem(key, serializedValue);
	} catch (error) {
		console.error(`Error saving ${key} to localStorage`, error);
	}
};

/**
 * Get a value from localStorage
 * @param key string key
 * @returns parsed value or null if not found/error
 */
export const getItem = <T = unknown>(key: string): T | null => {
	try {
		const storedValue = localStorage.getItem(key);
		if (!storedValue) return null;
		return JSON.parse(storedValue) as T;
	} catch (error) {
		console.error(`Error reading ${key} from localStorage`, error);
		return null;
	}
};

/**
 * Remove a value from localStorage
 * @param key string key
 */
export const removeItem = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing ${key} from localStorage`, error);
	}
};
