// Importa la función clsx y el tipo ClassValue desde la librería 'clsx'
import { clsx, type ClassValue } from "clsx";

// Función utilitaria para combinar clases condicionalmente
// Recibe cualquier cantidad de argumentos de tipo ClassValue y retorna el resultado de clsx
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Función para reemplazar variables en una plantilla de texto
// template: string que contiene variables entre llaves, por ejemplo: "Hola {nombre}"
// values: objeto con las claves y valores a reemplazar en la plantilla
// Retorna el string con las variables reemplazadas por sus valores correspondientes
export const reemplazarVariables = (
  template: string,
  values: Record<string, string | number>
) => {
  return Object.entries(values).reduce((output, [key, value]) => {
    // Crea una expresión regular para buscar la variable entre llaves
    const expression = new RegExp(`\\{${key}\\}`, "g");
    // Reemplaza todas las ocurrencias de la variable por su valor
    return output.replace(expression, String(value));
  }, template);
};
