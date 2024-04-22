import { useEffect } from "react";

function useDelayedExecution<T>(
  listener: T,
  callback: () => void,
  delay: number,
) {
  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      callback();
    }, delay);

    // Clear the timeout if the listener changes before the delay
    return () => clearTimeout(timer);
  }, [listener, callback, delay]);
}

export default useDelayedExecution;
