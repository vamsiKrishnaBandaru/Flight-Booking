// Generic API request helper. It takes an API function and its parameters,
// and returns a new function that, when called, executes the API request.
// This helps standardize how API calls are made inside thunks.

// This signature handles API functions that take parameters.
export function makeAPIRequest<T, P>(
  apiFunction: (params: P) => Promise<T>,
  params: P
): () => Promise<T>;

// This signature handles API functions that do NOT take parameters.
export function makeAPIRequest<T>(
  apiFunction: () => Promise<T>
): () => Promise<T>;

// Implementation that covers both signatures.
export function makeAPIRequest<T, P>(
  apiFunction: ((params: P) => Promise<T>) | (() => Promise<T>),
  params?: P
): () => Promise<T> {
  return () => {
    if (params !== undefined) {
      // We assume if params are provided, the function accepts them.
      // This cast is safe due to the function overloads.
      return (apiFunction as (params: P) => Promise<T>)(params);
    } else {
      // We assume if no params, the function takes none.
      // This cast is safe due to the function overloads.
      return (apiFunction as () => Promise<T>)();
    }
  };
} 