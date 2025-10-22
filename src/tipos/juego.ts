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
  fechaCreacion?: string | null;
}
