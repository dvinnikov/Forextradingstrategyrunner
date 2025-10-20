import { twMerge } from "tailwind-merge";

type ClassDictionary = Record<string, boolean | null | undefined>;
export type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassValue[]
  | null
  | false
  | undefined;

function collectClassNames(value: ClassValue, classes: string[]): void {
  if (value === null || value === undefined || value === false) {
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    classes.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectClassNames(entry, classes);
    }
    return;
  }

  for (const [className, enabled] of Object.entries(value)) {
    if (enabled) {
      classes.push(className);
    }
  }
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of inputs) {
    collectClassNames(value, classes);
  }

  return twMerge(classes.join(" "));
}
