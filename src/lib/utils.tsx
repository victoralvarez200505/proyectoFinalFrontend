import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const reemplazarVariables = (
  template: string,
  values: Record<string, string | number>
) => {
  return Object.entries(values).reduce((output, [key, value]) => {
    const expression = new RegExp(`\\{${key}\\}`, "g");
    return output.replace(expression, String(value));
  }, template);
};
