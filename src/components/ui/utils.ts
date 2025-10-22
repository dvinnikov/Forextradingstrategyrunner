import { clsx, type ClassValue } from "clsx";

function mergeTailwindClasses(classNames: string): string {
  const uniqueClasses: string[] = [];
  const seen = new Set<string>();

  for (const className of classNames.split(/\s+/)) {
    if (!className) continue;
    if (!seen.has(className)) {
      seen.add(className);
      uniqueClasses.push(className);
    }
  }

  return uniqueClasses.join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return mergeTailwindClasses(clsx(inputs));
}
