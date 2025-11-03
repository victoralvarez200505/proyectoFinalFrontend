import type { Juego } from "@/types/juego";
import { apiConfig } from "@/config";

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

const limpiarUrl = (valor: string): string => {
  return valor.endsWith("/") ? valor.slice(0, -1) : valor;
};

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

const RESENIAS_ENDPOINT = (() => {
  const base = apiConfig.reseniasEndpoint || "/resenias";
  return base.startsWith("/") ? base : `/${base}`;
})();

const toHeaders = (value: HeadersInit | undefined): Headers => {
  if (!value) {
    return new Headers();
  }

  return new Headers(value);
};

const mergeHeaders = (incoming?: HeadersInit): Headers => {
  const headers = toHeaders(incoming);

  Object.entries(apiConfig.defaultHeaders).forEach(([clave, valor]) => {
    headers.set(clave, valor);
  });

  if (apiConfig.authToken && apiConfig.authToken.trim() !== "") {
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${apiConfig.authToken}`);
    }
  }

  return headers;
};

const ejecutarFetch = async (
  endpoint: string,
  init: RequestInit = {},
  fallback: string
) => {
  const intentosMaximos = Math.max(0, apiConfig.reintentos);
  let ultimoError: unknown = null;

  for (let intento = 0; intento <= intentosMaximos; intento++) {
    const controller = new AbortController();

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

export type ReseniaPayload = {
  juegoId: string;
  contenido: string;
  calificacion: number | null;
  autor: string;
  horasJugadas: number | null;
  dificultad: string;
  recomendaria: boolean;
};

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

// Juegos

export const getJuegos = async (): Promise<Juego[]> => {
  const response = await ejecutarFetch(
    "/juegos",
    { method: "GET" },
    "Error al obtener juegos"
  );
  return parseResponse<Juego[]>(response, "Error al obtener juegos");
};

export const getJuego = async (id: string): Promise<Juego> => {
  const response = await ejecutarFetch(
    `/juegos/${id}`,
    { method: "GET" },
    "Error al obtener juego"
  );
  return parseResponse<Juego>(response, "Error al obtener juego");
};

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

export const deleteJuego = async (id: string): Promise<void> => {
  const response = await ejecutarFetch(
    `/juegos/${id}`,
    { method: "DELETE" },
    "Error al eliminar juego"
  );
  await ensureSuccess(response, "Error al eliminar juego");
};

// Reseñas

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

export const deleteResenia = async (id: string): Promise<void> => {
  const response = await ejecutarFetch(
    `${normalizarEndpoint(RESENIAS_ENDPOINT)}/${id}`,
    { method: "DELETE" },
    "Error al eliminar reseña"
  );
  await ensureSuccess(response, "Error al eliminar reseña");
};
