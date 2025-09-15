import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for localStorage with type safety and error handling
 * @param key - localStorage key
 * @param initialValue - initial value if no stored value exists
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Set value to localStorage and update state
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Remove value from localStorage and reset to initial value
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for localStorage that only initializes after component mounts
 * Prevents hydration mismatches in SSR environments
 */
export function useLocalStorageSSR<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void, boolean] {
  const [mounted, setMounted] = useState(false);
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  useEffect(() => {
    setMounted(true);
  }, []);

  return [mounted ? value : initialValue, setValue, removeValue, mounted];
}
