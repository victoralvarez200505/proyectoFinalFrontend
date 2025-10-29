import type { Juego } from "@/types/juego";
import { GENEROS_BASE } from "@/types/juego";
import rawSettings from "./appSettings.json" with { type: "json" };

type StringRecord = Record<string, string>;
type BooleanRecord = Record<string, boolean>;

interface ThemeDefinition {
  paletaColores: StringRecord;
  gradientes: StringRecord;
}

type ThemePresets = Record<string, ThemeDefinition>;

const DEFAULT_THEME_PRESETS: ThemePresets = {
  retro: {
    paletaColores: {
      primario: "#5B8CFF",
      secundario: "#FFD166",
      fondo: "#0B1026",
      texto: "#E6ECFF",
    },
    gradientes: {
      portada: "linear-gradient(135deg, #1A1F3B, #0B1026)",
      boton: "linear-gradient(135deg, #5B8CFF, #3A66F5)",
    },
  },
  ocaso: {
    paletaColores: {
      primario: "#FF6F61",
      secundario: "#FFD57E",
      fondo: "#251930",
      texto: "#FFEFE2",
    },
    gradientes: {
      portada: "linear-gradient(135deg, #3A1C71, #D76D77, #FFAF7B)",
      boton: "linear-gradient(135deg, #FF6F61, #FF9966)",
    },
  },
  "alto-contraste": {
    paletaColores: {
      primario: "#FFFFFF",
      secundario: "#FFD400",
      fondo: "#000000",
      texto: "#FFFFFF",
    },
    gradientes: {
      portada: "linear-gradient(135deg, #000000, #2C2C2C)",
      boton: "linear-gradient(135deg, #FFFFFF, #FFD400)",
    },
  },
};

interface AppSettings {
  api?: {
    forceBaseUrl?: boolean;
    baseUrl?: string;
    timeoutMs?: number;
    reintentos?: number;
    usarMock?: boolean;
    reseniasEndpoint?: string;
    defaultHeaders?: StringRecord;
    authToken?: string;
  };
  biblioteca?: {
    habilitarJuegosPredeterminados?: boolean;
    generos?: string[];
    juegos?: Juego[];
    juegosPorPagina?: number;
    ordenPredeterminado?: string;
    maxFavoritos?: number;
    maxPendientes?: number;
    camposBusqueda?: string[];
    mostrarSoloCompletados?: boolean;
    placeholderBusqueda?: string;
    textoSinResultados?: string;
  };
  ui?: {
    mostrarCarrusel?: boolean;
    habilitarToasts?: boolean;
    duracionTransicionMs?: number;
    titulos?: {
      principal?: string;
      subtitulo?: string;
      lista?: {
        titulo?: string;
        subtitulo?: string;
      };
    };
    mensajes?: {
      sinJuegos?: string;
      sinResultados?: string;
      cargandoBiblioteca?: string;
      modoOffline?: string;
      limiteFavoritos?: string;
      limitePendientes?: string;
      errorConexion?: string;
    };
    carrusel?: {
      titulo?: string;
      subtitulo?: string;
    };
    tema?: {
      variant?: string;
      paletaColores?: StringRecord;
      gradientes?: StringRecord;
      presets?: Record<string, { paletaColores?: StringRecord; gradientes?: StringRecord }>;
    };
  };
  integraciones?: {
    analyticsId?: string;
    discordUrl?: string;
    soporteUrl?: string;
    featureFlags?: BooleanRecord;
  };
}

interface ParsedAppSettings {
  api: {
    forceBaseUrl: boolean;
    baseUrl: string;
    timeoutMs: number;
    reintentos: number;
    usarMock: boolean;
    reseniasEndpoint: string;
    defaultHeaders: StringRecord;
    authToken: string;
  };
  biblioteca: {
    habilitarJuegosPredeterminados: boolean;
    generos: string[];
    juegos: Juego[];
    juegosPorPagina: number;
    ordenPredeterminado: string;
    maxFavoritos: number;
    maxPendientes: number;
    camposBusqueda: string[];
    mostrarSoloCompletados: boolean;
    placeholderBusqueda: string;
    textoSinResultados: string;
  };
  ui: {
    mostrarCarrusel: boolean;
    habilitarToasts: boolean;
    duracionTransicionMs: number;
    titulos: {
      principal: string;
      subtitulo: string;
      lista: {
        titulo: string;
        subtitulo: string;
      };
    };
    mensajes: {
      sinJuegos: string;
      sinResultados: string;
      cargandoBiblioteca: string;
      modoOffline: string;
      limiteFavoritos: string;
      limitePendientes: string;
      errorConexion: string;
    };
    carrusel: {
      titulo: string;
      subtitulo: string;
    };
    tema: {
      variant: string;
      paletaColores: StringRecord;
      gradientes: StringRecord;
      presets: ThemePresets;
    };
  };
  integraciones: {
    analyticsId: string;
    discordUrl: string;
    soporteUrl: string;
    featureFlags: BooleanRecord;
  };
}

const toNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : fallback;

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return (value as unknown[])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item): item is string => item.length > 0);
};

const toStringRecord = (value: unknown): StringRecord => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (acc, [key, val]) => {
      if (typeof val === "string") {
        acc[key] = val;
      }
      return acc;
    },
    {} as StringRecord
  );
};

const toBooleanRecord = (value: unknown): BooleanRecord => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (acc, [key, val]) => {
      acc[key] = Boolean(val);
      return acc;
    },
    {} as BooleanRecord
  );
};

const cloneThemeDefinition = (definition: ThemeDefinition): ThemeDefinition => ({
  paletaColores: { ...definition.paletaColores },
  gradientes: { ...definition.gradientes },
});

const toThemeDefinition = (
  value: unknown,
  fallback: ThemeDefinition = { paletaColores: {}, gradientes: {} }
): ThemeDefinition => {
  if (!value || typeof value !== "object") {
    return cloneThemeDefinition(fallback);
  }

  const data = value as {
    paletaColores?: unknown;
    gradientes?: unknown;
  };

  return {
    paletaColores: {
      ...fallback.paletaColores,
      ...toStringRecord(data.paletaColores),
    },
    gradientes: {
      ...fallback.gradientes,
      ...toStringRecord(data.gradientes),
    },
  };
};

const toThemePresets = (
  value: unknown,
  fallback: ThemePresets
): ThemePresets => {
  const result: ThemePresets = Object.entries(fallback).reduce(
    (acc, [key, def]) => {
      acc[key] = cloneThemeDefinition(def);
      return acc;
    },
    {} as ThemePresets
  );

  if (!value || typeof value !== "object") {
    return result;
  }

  for (const [key, definition] of Object.entries(
    value as Record<string, unknown>
  )) {
    const fallbackDefinition = result[key] ?? {
      paletaColores: {},
      gradientes: {},
    };
    result[key] = toThemeDefinition(definition, fallbackDefinition);
  }

  return result;
};

const parseSettings = (settings: unknown): ParsedAppSettings => {
  const fallback: ParsedAppSettings = {
    api: {
      forceBaseUrl: false,
      baseUrl: "http://localhost:3000/api",
      timeoutMs: 10000,
      reintentos: 0,
      usarMock: false,
      reseniasEndpoint: "/resenias",
      defaultHeaders: {},
      authToken: "",
    },
    biblioteca: {
      habilitarJuegosPredeterminados: false,
      generos: [...GENEROS_BASE],
      juegos: [],
      juegosPorPagina: 9,
      ordenPredeterminado: "fecha-desc",
      maxFavoritos: 50,
      maxPendientes: 200,
      camposBusqueda: ["nombre", "genero", "plataforma"],
      mostrarSoloCompletados: false,
      placeholderBusqueda: "",
      textoSinResultados: "",
    },
    ui: {
      mostrarCarrusel: true,
      habilitarToasts: true,
      duracionTransicionMs: 300,
      titulos: {
        principal: "",
        subtitulo: "",
        lista: {
          titulo: "Listado de juegos",
          subtitulo: "Gestiona tu biblioteca",
        },
      },
      mensajes: {
        sinJuegos: "",
        sinResultados: "",
        cargandoBiblioteca: "Cargando...",
        modoOffline: "Modo offline activo.",
        limiteFavoritos: "",
        limitePendientes: "",
        errorConexion: "",
      },
      carrusel: {
        titulo: "",
        subtitulo: "",
      },
      tema: {
        variant: "retro",
        paletaColores: {},
        gradientes: {},
        presets: DEFAULT_THEME_PRESETS,
      },
    },
    integraciones: {
      analyticsId: "",
      discordUrl: "",
      soporteUrl: "",
      featureFlags: {},
    },
  };

  if (!settings || typeof settings !== "object") {
    return fallback;
  }

  const data = settings as AppSettings;

  const api = {
    forceBaseUrl: Boolean(data.api?.forceBaseUrl),
    baseUrl: toString(data.api?.baseUrl, fallback.api.baseUrl),
    timeoutMs: toNumber(data.api?.timeoutMs, fallback.api.timeoutMs),
    reintentos: toNumber(data.api?.reintentos, fallback.api.reintentos),
    usarMock: Boolean(data.api?.usarMock),
    reseniasEndpoint: toString(
      data.api?.reseniasEndpoint,
      fallback.api.reseniasEndpoint
    ),
    defaultHeaders: toStringRecord(data.api?.defaultHeaders),
    authToken: toString(data.api?.authToken, fallback.api.authToken),
  };

  const generosConfigurados = toStringArray(data.biblioteca?.generos);
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
    juegosPorPagina: toNumber(
      data.biblioteca?.juegosPorPagina,
      fallback.biblioteca.juegosPorPagina
    ),
    ordenPredeterminado: toString(
      data.biblioteca?.ordenPredeterminado,
      fallback.biblioteca.ordenPredeterminado
    ),
    maxFavoritos: toNumber(
      data.biblioteca?.maxFavoritos,
      fallback.biblioteca.maxFavoritos
    ),
    maxPendientes: toNumber(
      data.biblioteca?.maxPendientes,
      fallback.biblioteca.maxPendientes
    ),
    camposBusqueda: (() => {
      const campos = toStringArray(data.biblioteca?.camposBusqueda);
      return campos.length ? campos : [...fallback.biblioteca.camposBusqueda];
    })(),
    mostrarSoloCompletados: Boolean(
      data.biblioteca?.mostrarSoloCompletados
    ),
    placeholderBusqueda: toString(
      data.biblioteca?.placeholderBusqueda,
      fallback.biblioteca.placeholderBusqueda
    ),
    textoSinResultados: toString(
      data.biblioteca?.textoSinResultados,
      fallback.biblioteca.textoSinResultados
    ),
  };

  const temaPresets = toThemePresets(
    data.ui?.tema?.presets,
    fallback.ui.tema.presets
  );

  const presetKeys = Object.keys(temaPresets);
  const defaultVariant = presetKeys.includes(fallback.ui.tema.variant)
    ? fallback.ui.tema.variant
    : presetKeys[0] ?? "retro";

  const requestedVariant = toString(
    data.ui?.tema?.variant,
    defaultVariant
  );

  const resolvedVariant = presetKeys.includes(requestedVariant)
    ? requestedVariant
    : defaultVariant;

  const tema = {
    variant: resolvedVariant,
    paletaColores: toStringRecord(data.ui?.tema?.paletaColores),
    gradientes: toStringRecord(data.ui?.tema?.gradientes),
    presets: temaPresets,
  };

  const ui = {
    mostrarCarrusel: Boolean(data.ui?.mostrarCarrusel ?? fallback.ui.mostrarCarrusel),
    habilitarToasts: Boolean(
      data.ui?.habilitarToasts ?? fallback.ui.habilitarToasts
    ),
    duracionTransicionMs: toNumber(
      data.ui?.duracionTransicionMs,
      fallback.ui.duracionTransicionMs
    ),
    titulos: {
      principal: toString(
        data.ui?.titulos?.principal,
        fallback.ui.titulos.principal
      ),
      subtitulo: toString(
        data.ui?.titulos?.subtitulo,
        fallback.ui.titulos.subtitulo
      ),
      lista: {
        titulo: toString(
          data.ui?.titulos?.lista?.titulo,
          fallback.ui.titulos.lista.titulo
        ),
        subtitulo: toString(
          data.ui?.titulos?.lista?.subtitulo,
          fallback.ui.titulos.lista.subtitulo
        ),
      },
    },
    mensajes: {
      sinJuegos: toString(
        data.ui?.mensajes?.sinJuegos,
        fallback.ui.mensajes.sinJuegos
      ),
      sinResultados: toString(
        data.ui?.mensajes?.sinResultados,
        fallback.ui.mensajes.sinResultados
      ),
      cargandoBiblioteca: toString(
        data.ui?.mensajes?.cargandoBiblioteca,
        fallback.ui.mensajes.cargandoBiblioteca
      ),
      modoOffline: toString(
        data.ui?.mensajes?.modoOffline,
        fallback.ui.mensajes.modoOffline
      ),
      limiteFavoritos: toString(
        data.ui?.mensajes?.limiteFavoritos,
        fallback.ui.mensajes.limiteFavoritos
      ),
      limitePendientes: toString(
        data.ui?.mensajes?.limitePendientes,
        fallback.ui.mensajes.limitePendientes
      ),
      errorConexion: toString(
        data.ui?.mensajes?.errorConexion,
        fallback.ui.mensajes.errorConexion
      ),
    },
    carrusel: {
      titulo: toString(
        data.ui?.carrusel?.titulo,
        fallback.ui.carrusel.titulo
      ),
      subtitulo: toString(
        data.ui?.carrusel?.subtitulo,
        fallback.ui.carrusel.subtitulo
      ),
    },
    tema,
  };

  const integraciones = {
    analyticsId: toString(
      data.integraciones?.analyticsId,
      fallback.integraciones.analyticsId
    ),
    discordUrl: toString(
      data.integraciones?.discordUrl,
      fallback.integraciones.discordUrl
    ),
    soporteUrl: toString(
      data.integraciones?.soporteUrl,
      fallback.integraciones.soporteUrl
    ),
    featureFlags: toBooleanRecord(data.integraciones?.featureFlags),
  };

  return { api, biblioteca, ui, integraciones };
};

const parsed = parseSettings(rawSettings);

export const appSettings: ParsedAppSettings = Object.freeze(parsed);

export const apiConfig = appSettings.api;
export const bibliotecaConfig = appSettings.biblioteca;
export const generosConfig = appSettings.biblioteca.generos;
export const uiConfig = appSettings.ui;
export const temaConfig = appSettings.ui.tema;
export const integracionesConfig = appSettings.integraciones;
