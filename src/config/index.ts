import type { Juego } from "@/tipos/juego";
import { GENEROS_BASE } from "@/tipos/juego";
import rawSettings from "./appSettings.json" with { type: "json" };

interface AppSettings {
  api?: {
    forceBaseUrl?: boolean;
    baseUrl?: string;
  };
  biblioteca?: {
    habilitarJuegosPredeterminados?: boolean;
    generos?: string[];
    juegos?: Juego[];
  };
}

interface ParsedAppSettings {
  api: {
    forceBaseUrl: boolean;
    baseUrl: string;
  };
  biblioteca: {
    habilitarJuegosPredeterminados: boolean;
    generos: string[];
    juegos: Juego[];
  };
}

const parseSettings = (settings: unknown): ParsedAppSettings => {
  const fallback: ParsedAppSettings = {
    api: {
      forceBaseUrl: false,
      baseUrl: "http://localhost:3000/api",
    },
    biblioteca: {
      habilitarJuegosPredeterminados: false,
      generos: [...GENEROS_BASE],
      juegos: [],
    },
  };

  if (!settings || typeof settings !== "object") {
    return fallback;
  }

  const data = settings as AppSettings;

  const api = {
    forceBaseUrl: Boolean(data.api?.forceBaseUrl),
    baseUrl:
      typeof data.api?.baseUrl === "string" && data.api.baseUrl.trim() !== ""
        ? data.api.baseUrl.trim()
        : fallback.api.baseUrl,
  };

  const generosConfigurados = Array.isArray(data.biblioteca?.generos)
    ? (data.biblioteca?.generos as unknown[])
        .map((valor) => (typeof valor === "string" ? valor.trim() : ""))
        .filter((valor): valor is string => valor.length > 0)
    : [];

  const generos = generosConfigurados.length
    ? Array.from(new Set(generosConfigurados))
    : [...GENEROS_BASE];

  const juegos = Array.isArray(data.biblioteca?.juegos)
    ? (data.biblioteca?.juegos as Juego[])
    : [];

  const biblioteca = {
    habilitarJuegosPredeterminados: Boolean(
      data.biblioteca?.habilitarJuegosPredeterminados
    ),
    generos,
    juegos,
  };

  return { api, biblioteca };
};

const parsed = parseSettings(rawSettings);

export const appSettings: ParsedAppSettings = Object.freeze(parsed);

export const apiConfig = appSettings.api;
export const bibliotecaConfig = appSettings.biblioteca;
export const generosConfig = appSettings.biblioteca.generos;
