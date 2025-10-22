import { Gamepad2, Plus, Loader2, AlertCircle } from "lucide-react";
import type { Juego } from "@/tipos/juego";
import { Button } from "@/components/ui/general/boton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/general/alertas"; // Revisar Luego
import { GameCarousel } from "@/components/ui/general/GameCarousel";
import styles from "@/styles/pages/Inicio.module.css";

interface SeccionPrincipalProps {
  juegosTotales: number;
  juegosCompletados: number;
  juegosPendientes: number;
  isLoading: boolean;
  error: string | null;
  juegos: Juego[]; // Falta Crear Tipo
  onAddJuego: () => void;
  onSelectJuego: (juego: Juego) => void; // Falta Crear Tipo
}

export const SeccionPrincipal = ({
  juegosTotales,
  juegosCompletados,
  juegosPendientes,
  isLoading,
  error,
  juegos,
  onAddJuego,
  onSelectJuego,
}: SeccionPrincipalProps) => (
  <section className={styles.portada}>
    <div className={styles.portadaSuperposicion} />
    <div className={styles.portadaContenido}>
      <div className={styles.portadaIcono}>
        <Gamepad2 />
      </div>
      <h1 className={styles.portadaTitulo}>MIS JUEGOS</h1>
      <p className={styles.portadaSubtitulo}>
        Tu biblioteca personal de videojuegos
      </p>
      <div className={styles.portadaConteo}>
        {juegosTotales} {juegosTotales === 1 ? "juego" : "juegos"} en total
      </div>
      <div className={styles.portadaEstadisticas}>
        <span className={styles.portadaInsigniaEstado}>
          Completados: {juegosCompletados}
        </span>
        <span className={styles.portadaInsigniaEstado}>
          Pendientes: {juegosPendientes}
        </span>
      </div>

      <div className={styles.portadaAcciones}>
        <Button
          onClick={onAddJuego}
          className={styles.portadaBotonPrincipal}
          size="lg"
        >
          <Plus size={24} className={styles.iconoBotonGrande} />
          Agregar Juego
        </Button>
      </div>

      <div className={styles.portadaMensajes}>
        {error && (
          <Alert variant="destructive" className={styles.portadaAlerta}>
            <AlertCircle size={18} />
            <AlertTitle>Error de conexión</AlertTitle>
            <AlertDescription>
              {error}. Verifica que tu servidor esté corriendo en
              http://localhost:3000
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className={styles.portadaCargador}>
            <Loader2 className={styles.iconoCarga} />
            <p>Cargando biblioteca...</p>
          </div>
        )}
      </div>

      {juegos.length > 0 && (
        <div className={styles.portadaCarrusel}>
          <GameCarousel
            games={juegos}
            title="Explora rápidamente tus juegos"
            subtitle="Desliza para revisar cualquier título y entra a sus reseñas al instante"
            onSelect={onSelectJuego}
          />
        </div>
      )}

      <div className={styles.portadaDesplazamiento}>
        <span>Desliza para ver más</span>
        <svg
          className={styles.portadaIconoDesplazamiento}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  </section>
);
