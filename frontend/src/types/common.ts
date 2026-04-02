export type Column<T, K extends keyof T = keyof T> = {
  label: string;
  key: K;
  render?: (value: T[K], item: T) => React.ReactNode;
};