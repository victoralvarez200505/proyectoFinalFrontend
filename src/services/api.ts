// --- API de servicios para juegos y reseñas ---
// Este archivo centraliza todas las funciones para interactuar con el backend REST de juegos y reseñas.
// Incluye utilidades para manejo de endpoints, headers, errores y parseo de respuestas.

import type { Juego } from "@/types/juego";
import { apiConfig } from "@/config";

// Construye la URL base de la API según el entorno (dev/prod)
// Si está en desarrollo, fuerza el puerto 3000 para el backend
const construirUrlApiPorDefecto = (): string => {
  if (typeof window === "undefined") {
    return "http://localhost:3000/api";
  }
  const { protocol, hostname, port } = window.location;
  const puertosDesarrollo = new Set(["8080", "5173", "4173"]);
  let puertoObjetivo = port;
  if (puertosDesarrollo.has(port)) {
    puertoObjetivo = "3000";
  }
  if (puertoObjetivo === "80" || puertoObjetivo === "443") {
    puertoObjetivo = "";
  }
  const segmentoPuerto = puertoObjetivo ? `:${puertoObjetivo}` : "";
  return `${protocol}//${hostname}${segmentoPuerto}/api`;
};

// Elimina la barra final de una URL si existe
const limpiarUrl = (valor: string): string => {
  return valor.endsWith("/") ? valor.slice(0, -1) : valor;
};

// Determina la URL base de la API usando prioridad: config > env > por defecto
const API_URL = (() => {
  const desdeEnv = import.meta.env.VITE_API_URL?.trim();
  if (apiConfig.forceBaseUrl && apiConfig.baseUrl) {
    return limpiarUrl(apiConfig.baseUrl);
  }
  if (desdeEnv && desdeEnv !== "") {
    return limpiarUrl(desdeEnv);
  }
  if (apiConfig.baseUrl) {
    return limpiarUrl(apiConfig.baseUrl);
  }
  return construirUrlApiPorDefecto();
})();

// Determina el endpoint base para reseñas
const RESENIAS_ENDPOINT = (() => {
  const base = apiConfig.reseniasEndpoint || "/resenias";
  return base.startsWith("/") ? base : `/${base}`;
})();

// Convierte un objeto HeadersInit a Headers
const toHeaders = (value: HeadersInit | undefined): Headers => {
  if (!value) {
    return new Headers();
  }
  return new Headers(value);
};

// Fusiona los headers por defecto, de autenticación y los entrantes
const mergeHeaders = (incoming?: HeadersInit): Headers => {
  const headers = toHeaders(incoming);
  // Añade headers por defecto de la config
  Object.entries(apiConfig.defaultHeaders).forEach(([clave, valor]) => {
    headers.set(clave, valor);
  });
  // Añade token de autenticación si está configurado
  if (apiConfig.authToken && apiConfig.authToken.trim() !== "") {
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${apiConfig.authToken}`);
    }
  }
  return headers;
};

// Ejecuta una petición fetch con reintentos, timeout y manejo de errores
// Si la petición falla, reintenta según la configuración y lanza un error descriptivo
const ejecutarFetch = async (
  endpoint: string,
  init: RequestInit = {},
  fallback: string
) => {
  const intentosMaximos = Math.max(0, apiConfig.reintentos);
  let ultimoError: unknown = null;

  for (let intento = 0; intento <= intentosMaximos; intento++) {
    const controller = new AbortController();
    // Aplica timeout si está configurado
    const timeoutId = apiConfig.timeoutMs
      ? window.setTimeout(() => {
          controller.abort();
        }, apiConfig.timeoutMs)
      : null;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...init,
        headers: mergeHeaders(init.headers),
        signal: controller.signal,
      });
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      return response;
    } catch (error) {
      ultimoError = error;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      const esUltimoIntento = intento === intentosMaximos;
      if (esUltimoIntento) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(
            `La solicitud excedió el tiempo configurado (${apiConfig.timeoutMs}ms)`
          );
        }
        throw error instanceof Error ? error : new Error(fallback);
      }
      // Espera incremental antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, 150 * (intento + 1)));
    }
  }
  throw ultimoError instanceof Error ? ultimoError : new Error(fallback);
};

type JsonObject = Record<string, unknown>;

// Tipos compartidos entre servicios y componentes
export interface Resenia {
  id: string;
  juegoId: string;
  contenido: string;
  calificacion: number;
  autor: string;
  dificultad: string;
  recomendaria: boolean;
  horasJugadas: number;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
  juegoNombre?: string;
  juegoGenero?: string;
}

// Payload para crear o actualizar una reseña
export type ReseniaPayload = {
  juegoId: string;
  contenido: string;
  calificacion: number | null;
  autor: string;
  horasJugadas: number | null;
  dificultad: string;
  recomendaria: boolean;
};

// Lee y parsea el cuerpo JSON de una respuesta fetch
const readJsonBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("No se pudo parsear el cuerpo de la respuesta", error);
    return null;
  }
};

// Extrae un mensaje de error de un cuerpo de respuesta, o usa el fallback
const extractErrorMessage = (body: unknown, fallback: string): string => {
  if (body && typeof body === "object") {
    const payload = body as JsonObject;
    if (Array.isArray(payload.error)) {
      return payload.error.join(". ");
    }
    if (typeof payload.error === "string" && payload.error.trim() !== "") {
      return payload.error;
    }
    if (Array.isArray(payload.detalles)) {
      return payload.detalles.join(". ");
    }
    if (
      typeof payload.detalles === "string" &&
      payload.detalles.trim() !== ""
    ) {
      return payload.detalles;
    }
  }
  return fallback;
};

// Parsea la respuesta y lanza error si no es exitosa o el cuerpo es inválido
const parseResponse = async <T>(
  response: Response,
  fallback: string
): Promise<T> => {
  const body = await readJsonBody(response);
  if (!response.ok) {
    throw new Error(extractErrorMessage(body, fallback));
  }
  if (body === null || body === undefined) {
    throw new Error("Respuesta inválida del servidor");
  }
  return body as T;
};

// Lanza error si la respuesta no es exitosa
const ensureSuccess = async (response: Response, fallback: string) => {
  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new Error(extractErrorMessage(body, fallback));
  }
};

const normalizarListadoResenias = (payload: unknown): Resenia[] => {
  const mapId = (r: any) => {
    if (r && !r.id && r._id) {
      return { ...r, id: r._id };
    }
    return r;
  };

  if (Array.isArray(payload)) {
    return payload.map(mapId) as Resenia[];
  }

  if (payload && typeof payload === "object") {
    const registro = payload as JsonObject;
    // Plural
    if (Array.isArray(registro.resenias)) {
      return (registro.resenias as any[]).map(mapId) as Resenia[];
    }
    // Singular
    if (registro.resenia && typeof registro.resenia === "object") {
      return [mapId(registro.resenia) as Resenia];
    }
  }

  return [];
};

const normalizarEndpoint = (endpoint: string) =>
  endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

// ====================
// === ENDPOINTS JUEGOS ===
// ====================

// Obtiene todos los juegos
export const getJuegos = async (): Promise<Juego[]> => {
  const response = await ejecutarFetch(
    "/juegos",
    { method: "GET" },
    "Error al obtener juegos"
  );
  return parseResponse<Juego[]>(response, "Error al obtener juegos");
};

// Obtiene un juego por su id
export const getJuego = async (id: string): Promise<Juego> => {
  const response = await ejecutarFetch(
    `/juegos/${id}`,
    { method: "GET" },
    "Error al obtener juego"
  );
  return parseResponse<Juego>(response, "Error al obtener juego");
};

// Crea un nuevo juego
export const createJuego = async (juego: Omit<Juego, "id">): Promise<Juego> => {
  const response = await ejecutarFetch(
    "/juegos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(juego),
    },
    "Error al crear juego"
  );
  return parseResponse<Juego>(response, "Error al crear juego");
};

// Actualiza un juego existente por id
export const updateJuego = async (
  id: string,
  juego: Partial<Juego>
): Promise<Juego> => {
  const response = await ejecutarFetch(
    `/juegos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(juego),
    },
    "Error al actualizar juego"
  );
  return parseResponse<Juego>(response, "Error al actualizar juego");
};

// Elimina un juego por id
export const deleteJuego = async (id: string): Promise<void> => {
  const response = await ejecutarFetch(
    `/juegos/${id}`,
    { method: "DELETE" },
    "Error al eliminar juego"
  );
  await ensureSuccess(response, "Error al eliminar juego");
};

// =====================
// === ENDPOINTS RESEÑAS ===
// =====================

// Obtiene todas las reseñas
export const getResenias = async (): Promise<Resenia[]> => {
  const response = await ejecutarFetch(
    RESENIAS_ENDPOINT,
    { method: "GET" },
    "Error al obtener reseñas"
  );
  const payload = await parseResponse<unknown>(
    response,
    "Error al obtener reseñas"
  );
  return normalizarListadoResenias(payload);
};

// Obtiene todas las reseñas de un juego específico
export const getReseniasPorJuego = async (
  juegoId: string
): Promise<Resenia[]> => {
  const response = await ejecutarFetch(
    `${normalizarEndpoint(RESENIAS_ENDPOINT)}/juego/${juegoId}`,
    { method: "GET" },
    "Error al obtener reseñas del juego"
  );
  const payload = await parseResponse<unknown>(
    response,
    "Error al obtener reseñas del juego"
  );
  return normalizarListadoResenias(payload);
};

// Crea una nueva reseña
export const createResenia = async (
  resenia: ReseniaPayload
): Promise<Resenia> => {
  const response = await ejecutarFetch(
    RESENIAS_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resenia),
    },
    "Error al crear reseña"
  );
  return parseResponse<Resenia>(response, "Error al crear reseña");
};

// Actualiza una reseña existente por id
export const updateResenia = async (
  id: string,
  resenia: Partial<ReseniaPayload>
): Promise<Resenia> => {
  const response = await ejecutarFetch(
    `${normalizarEndpoint(RESENIAS_ENDPOINT)}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resenia),
    },
    "Error al actualizar reseña"
  );
  return parseResponse<Resenia>(response, "Error al actualizar reseña");
};

// Elimina una reseña por id
export const deleteResenia = async (id: string): Promise<void> => {
  const response = await ejecutarFetch(
    `${normalizarEndpoint(RESENIAS_ENDPOINT)}/${id}`,
    { method: "DELETE" },
    "Error al eliminar reseña"
  );
  await ensureSuccess(response, "Error al eliminar reseña");
};
