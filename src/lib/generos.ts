import { bibliotecaConfig } from "@/config";
import { GENEROS_BASE } from "@/tipos/juego";

const generosDesdeConfig = bibliotecaConfig.generos.length
  ? Array.from(new Set(bibliotecaConfig.generos))
  : [];

export const GENEROS: readonly string[] = Object.freeze(
  generosDesdeConfig.length ? generosDesdeConfig : [...GENEROS_BASE]
);
