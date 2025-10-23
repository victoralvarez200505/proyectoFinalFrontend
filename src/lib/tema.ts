import { uiConfig } from "@/config";

export interface TemaActivo {
  nombre: string;
  paletaColores: Record<string, string>;
  gradientes: Record<string, string>;
}

const VARIABLE_COLOR_MAP: Record<string, string> = {
  primario: "--color-primario",
  secundario: "--color-secundario",
  fondo: "--color-fondo",
  texto: "--color-texto",
};

const VARIABLE_GRADIENTE_MAP: Record<string, string> = {
  portada: "--gradiente-amanecer",
  boton: "--gradiente-alba",
};

const DEFAULT_TRANSITION_CURVE = "cubic-bezier(0.4, 0, 0.2, 1)";

const resolverTema = (variant: string): TemaActivo => {
  const { tema } = uiConfig;
  const fallbackVariant = tema.variant;
  const presets = tema.presets;
  const disponible = presets[variant] ? variant : fallbackVariant;
  const preset = presets[disponible] ?? { paletaColores: {}, gradientes: {} };

  return {
    nombre: disponible,
    paletaColores: {
      ...preset.paletaColores,
      ...tema.paletaColores,
    },
    gradientes: {
      ...preset.gradientes,
      ...tema.gradientes,
    },
  };
};

export const aplicarTema = (tema: TemaActivo) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  root.dataset.temaActivo = tema.nombre;

  Object.entries(tema.paletaColores).forEach(([clave, valor]) => {
    const variable = VARIABLE_COLOR_MAP[clave] ?? `--color-${clave}`;
    root.style.setProperty(variable, valor);
  });

  Object.entries(tema.gradientes).forEach(([clave, valor]) => {
    const variable = VARIABLE_GRADIENTE_MAP[clave] ?? `--gradiente-${clave}`;
    root.style.setProperty(variable, valor);
  });

  const duracion = Math.max(uiConfig.duracionTransicionMs, 0);
  root.style.setProperty(
    "--transicion-base",
    `${duracion}ms ${DEFAULT_TRANSITION_CURVE}`
  );
};

export const obtenerTema = (variant?: string): TemaActivo => {
  const varianteSolicitada = variant ?? uiConfig.tema.variant;
  return resolverTema(varianteSolicitada);
};

export const temaActivo = obtenerTema();

export const temasDisponibles = Object.freeze(
  Object.keys(uiConfig.tema.presets)
);
