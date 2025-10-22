import type { Juego } from "@/tipos/juego";
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

type JsonObject = Record<string, unknown>;

// Tipos compartidos entre servicios y componentes
export interface Resenia {
  id: string;
  juegoId: string;
  puntuacion: number | null;
  texto: string;
  horasJugadas: number | null;
  dificultad: string;
  recomendaria: boolean;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export type ReseniaPayload = Omit<
  Resenia,
  "id" | "fechaCreacion" | "fechaActualizacion"
>;

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
  if (Array.isArray(payload)) {
    return payload as Resenia[];
  }

  if (payload && typeof payload === "object") {
    const registro = payload as JsonObject;
    const coleccion =
      (registro.resenias as unknown) ?? (registro["resenias"] as unknown);

    if (Array.isArray(coleccion)) {
      return coleccion as Resenia[];
    }
  }

  return [];
};

// Juegos
export const getJuegos = async (): Promise<Juego[]> => {
  const response = await fetch(`${API_URL}/juegos`);
  return parseResponse<Juego[]>(response, "Error al obtener juegos");
};

export const getJuego = async (id: string): Promise<Juego> => {
  const response = await fetch(`${API_URL}/juegos/${id}`);
  return parseResponse<Juego>(response, "Error al obtener juego");
};

export const createJuego = async (juego: Omit<Juego, "id">): Promise<Juego> => {
  const response = await fetch(`${API_URL}/juegos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(juego),
  });
  return parseResponse<Juego>(response, "Error al crear juego");
};

export const updateJuego = async (
  id: string,
  juego: Partial<Juego>
): Promise<Juego> => {
  const response = await fetch(`${API_URL}/juegos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(juego),
  });
  return parseResponse<Juego>(response, "Error al actualizar juego");
};

export const deleteJuego = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/juegos/${id}`, {
    method: "DELETE",
  });
  await ensureSuccess(response, "Error al eliminar juego");
};

// Reseñas
export const getResenias = async (): Promise<Resenia[]> => {
  const response = await fetch(`${API_URL}/resenias`);
  const payload = await parseResponse<unknown>(
    response,
    "Error al obtener reseñas"
  );
  return normalizarListadoResenias(payload);
};

export const getReseniasPorJuego = async (
  juegoId: string
): Promise<Resenia[]> => {
  const response = await fetch(`${API_URL}/resenias/juego/${juegoId}`);
  const payload = await parseResponse<unknown>(
    response,
    "Error al obtener reseñas del juego"
  );
  return normalizarListadoResenias(payload);
};

export const createResenia = async (
  resenia: ReseniaPayload
): Promise<Resenia> => {
  const response = await fetch(`${API_URL}/resenias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resenia),
  });
  return parseResponse<Resenia>(response, "Error al crear reseña");
};

export const updateResenia = async (
  id: string,
  resenia: Partial<ReseniaPayload>
): Promise<Resenia> => {
  const response = await fetch(`${API_URL}/resenias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resenia),
  });
  return parseResponse<Resenia>(response, "Error al actualizar reseña");
};

export const deleteResenia = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/resenias/${id}`, {
    method: "DELETE",
  });
  await ensureSuccess(response, "Error al eliminar reseña");
};
