export const GENEROS_BASE = [
  "Acción",
  "Aventura",
  "Rol",
  "Estrategia",
  "Simulación",
  "Deportes",
  "Carreras",
  "Plataformas",
  "Puzzle",
  "Metroidvania",
  "Indie",
] as const;

export type Genero = string;

export interface Juego {
  id: string;
  nombre: string;
  año: number;
  genero: string;
  plataforma: string;
  imagen: string;
  sinopsis: string;
  desarrollador?: string;
  tienda?: string;
  completado?: boolean;
  favorito?: boolean;
  pendiente?: boolean;
  fechaCreacion?: string | null;
}
