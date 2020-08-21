export const DEFAULT_TIMEOUT_MS = 10;

interface Unsubscribe {
  (): void;
}

/**
 * a timer which executes a function or specified piece
 * of code once the timer expires.
 *
 * @example
 * const callback = () => {
 *   console.log("hello");
 * }
 * const unsubscribe = onTimeout(callback, 1000);
 * unsubscribe();
 * @param delay The time, in milliseconds.
 */
export function onTimeout(
  callback: () => void,
  delay = DEFAULT_TIMEOUT_MS
): Unsubscribe {
  const timeoutId = setTimeout(callback, delay);
  return () => clearTimeout(timeoutId);
}
