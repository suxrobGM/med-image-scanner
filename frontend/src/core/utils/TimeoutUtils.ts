type Procedure = (...args: any[]) => void;

/**
 * Debounce function, useful for input handlers to avoid calling the function too often.
 * @param func Function to debounce
 * @param timeout Timeout in milliseconds
 * @param immediate If true, the function will be called immediately
 * @returns Debounced function
 */
export function debounce<T extends Procedure>(func: T, timeout: number, immediate = false): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;

    const doLater = () => {
      timeoutId = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const shouldCallNow = immediate && timeoutId === null;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(doLater, timeout);

    if (shouldCallNow) {
      func.apply(context, args);
    }
  } as T;

  return debouncedFunction;
}
