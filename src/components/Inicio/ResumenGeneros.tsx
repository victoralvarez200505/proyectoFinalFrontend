import type { LucideIcon } from "lucide-react";
import {
  Skull,
  Trophy,
  Car,
  Sword,
  Castle,
  MapPin,
  Gamepad2,
  Joystick,
  Puzzle,
  Layers,
  MountainSnow,
  Rocket,
  Dumbbell,
  Target,
  Crosshair,
  Swords,
  Users,
  Shield,
  Music4,
  Compass,
  Dices,
  BookOpen,
  Eye,
} from "lucide-react";

import styles from "@/styles/pages/Inicio.module.css";
import { GenreCard } from "@/components/Inicio/GenreCard";

interface ResumenGenero {
  genre: string;
  count: number;
}

interface ResumenGenerosProps {
  generos: ResumenGenero[];
  visible: boolean;
}

const normalizarGenero = (nombre: string) =>
  nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ICONOS_GENERO: Record<string, LucideIcon> = {
  terror: Skull,
  horror: Skull,
  deportes: Trophy,
  deporte: Trophy,
  autos: Car,
  carreras: Car,
  velocidad: Car,
  accion: Sword,
  action: Sword,
  aventura: MapPin,
  exploracion: MapPin,
  rol: Castle,
  rpg: Castle,
  jrpg: Castle,
  "rol por turnos": Castle,
  fantasia: Castle,
  estrategia: Target,
  tactico: Target,
  "estrategia en tiempo real": Target,
  simulacion: Joystick,
  simulador: Joystick,
  logica: Puzzle,
  puzzle: Puzzle,
  rompecabezas: Puzzle,
  plataformas: Layers,
  plataforma: Layers,
  metroidvania: Rocket,
  indie: Joystick,
  sandbox: Layers,
  "mundo abierto": Compass,
  "open world": Compass,
  "mundo libre": Compass,
  supervivencia: MountainSnow,
  cooperativo: Dumbbell,
  shooter: Crosshair,
  disparos: Crosshair,
  fps: Crosshair,
  "shooter tactico": Crosshair,
  mmo: Users,
  mmorpg: Users,
  multijugador: Users,
  "battle royale": Shield,
  roguelike: Dices,
  roguelite: Dices,
  "aventura grafica": BookOpen,
  "novela visual": BookOpen,
  musica: Music4,
  musical: Music4,
  ritmo: Music4,
  stealth: Eye,
  sigilo: Eye,
  lucha: Swords,
  peleas: Swords,
  fighting: Swords,
};

export const ResumenGeneros = ({ generos, visible }: ResumenGenerosProps) => {
  if (!visible) {
    return null;
  }

  return (
    <section className={styles.seccionCategorias}>
      <div className={styles.contenedorSeccion}>
        <div className={styles.encabezadoSeccion}>
          <h2 className={styles.tituloSeccion}>Explorar por género</h2>
          <p className={styles.subtituloSeccion}>
            Selecciona un género para recorrer tu biblioteca por categoría
          </p>
        </div>

        <div className={styles.rejillaGeneros}>
          {generos.length === 0 ? (
            <div className={styles.estadoVacio}>
              <div>
                <div className={styles.insigniaDestacada}>
                  <Gamepad2 />
                </div>
                <h3 className={styles.tituloVacio}>
                  Aún no hay géneros disponibles
                </h3>
                <p className={styles.textoVacio}>
                  Agrega tus primeros juegos para ver el resumen por género.
                </p>
              </div>
            </div>
          ) : (
            generos.map(({ genre, count }) => {
              const Icono = ICONOS_GENERO[normalizarGenero(genre)] ?? Gamepad2;
              return (
                <div key={genre} className={styles.tarjetaGenero}>
                  <GenreCard genero={genre} icono={Icono} total={count} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
