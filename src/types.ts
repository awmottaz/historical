export type StrictExtract<T, K extends T> = T extends K ? T : never;
