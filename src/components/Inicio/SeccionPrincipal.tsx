import {
  Gamepad2,
  Plus,
  Loader2,
  AlertCircle,
  WifiOff,
  Star,
  Clock,
} from "lucide-react";
import type { Juego } from "@/tipos/juego";
import { Button } from "@/components/ui/general/boton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/general/alertas";
import { GameCarousel } from "@/components/ui/general/GameCarousel";
import styles from "@/styles/pages/Inicio.module.css";
import { apiConfig, uiConfig } from "@/config";
import { reemplazarVariables } from "@/lib/utils";

interface SeccionPrincipalProps {
  juegosTotales: number;
  juegosCompletados: number;
  juegosPendientes: number;
  totalFiltrados: number;
  isLoading: boolean;
  error: string | null;
  juegos: Juego[];
  // terminoBusqueda: string;
  // placeholderBusqueda: string;
  textoSinResultados: string;
  hayBusquedaActiva: boolean;
  modoOffline: boolean;
  onAddJuego: () => void;
  onSelectJuego?: (juego: Juego) => void;
  // onSearchChange: (valor: string) => void;
  // onClearBusqueda: () => void;
  limiteFavoritosAlcanzado: boolean;
  limitePendientesAlcanzado: boolean;
  mensajeLimiteFavoritos: string;
  mensajeLimitePendientes: string;
}

export const SeccionPrincipal = ({
  juegosTotales,
  juegosCompletados,
  juegosPendientes,
  totalFiltrados,
  isLoading,
  error,
  juegos,
  // terminoBusqueda,
  // placeholderBusqueda,
  textoSinResultados,
  hayBusquedaActiva,
  modoOffline,
  onAddJuego,
  onSelectJuego,
  // onSearchChange,
  // onClearBusqueda,
  limiteFavoritosAlcanzado,
  limitePendientesAlcanzado,
  mensajeLimiteFavoritos,
  mensajeLimitePendientes,
}: SeccionPrincipalProps) => {
  const titulos = uiConfig.titulos;
  const mensajes = uiConfig.mensajes;
  const carrusel = uiConfig.carrusel;
  const mostrarCarrusel = uiConfig.mostrarCarrusel && juegos.length > 0;

  const tituloHero =
    titulos.principal.trim() !== "" ? titulos.principal : "Mis Juegos";
  const subtituloHero =
    titulos.subtitulo.trim() !== ""
      ? titulos.subtitulo
      : "Tu biblioteca personal al alcance";

  const mensajeCargando =
    mensajes.cargandoBiblioteca.trim() !== ""
      ? mensajes.cargandoBiblioteca
      : "Cargando tu biblioteca...";
  const mensajeSinJuegos =
    mensajes.sinJuegos.trim() !== ""
      ? mensajes.sinJuegos
      : "Aún no añadiste ningún juego";
  const mensajeSinResultadosPlantilla =
    mensajes.sinResultados.trim() !== ""
      ? mensajes.sinResultados
      : "No hay coincidencias";
  const mensajeModoOffline =
    mensajes.modoOffline.trim() !== ""
      ? mensajes.modoOffline
      : "Modo offline activo. Los cambios no se sincronizarán.";
  const textoLimiteFavoritos = mensajeLimiteFavoritos;
  const textoLimitePendientes = mensajeLimitePendientes;
  const etiquetaAccionPrincipal =
    titulos.lista.titulo.trim() !== ""
      ? `Agregar a ${titulos.lista.titulo.toLowerCase()}`
      : "Agregar juego";

  const servidorObjetivo = apiConfig.baseUrl || "el servidor configurado";
  const plantillaError =
    mensajes.errorConexion.trim() !== ""
      ? mensajes.errorConexion
      : "No pudimos conectar con {servidor}. Detalle: {detalles}";

  const haySinResultados =
    hayBusquedaActiva && !isLoading && totalFiltrados === 0;
  const haySinJuegos = !isLoading && juegosTotales === 0;

  const descripcionError = error
    ? reemplazarVariables(plantillaError, {
        servidor: servidorObjetivo,
        detalles: error,
      })
    : "";

  // const handleBusquedaChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   onSearchChange(event.target.value);
  // };

  const textoConteo = hayBusquedaActiva ? totalFiltrados : juegosTotales;
  const etiquetaConteo =
    hayBusquedaActiva && totalFiltrados >= 0
      ? `${textoConteo} ${textoConteo === 1 ? "juego" : "juegos"} coinciden`
      : `${textoConteo} ${textoConteo === 1 ? "juego" : "juegos"} en total`;

  return (
    <section className={styles.portada}>
      <div className={styles.portadaSuperposicion} />
      <div className={styles.portadaContenido}>
        <div className={styles.portadaIcono}>
          <Gamepad2 />
        </div>
        <h1 className={styles.portadaTitulo}>{tituloHero}</h1>
        <p className={styles.portadaSubtitulo}>{subtituloHero}</p>

        <div className={styles.portadaConteo}>{etiquetaConteo}</div>
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
            {etiquetaAccionPrincipal}
          </Button>
        </div>

        {modoOffline ? (
          <div className={styles.portadaAvisoOffline}>
            <WifiOff size={18} />
            <span>{mensajeModoOffline}</span>
          </div>
        ) : null}

        <div className={styles.portadaMensajes}>
          {error ? (
            <Alert variant="destructive" className={styles.portadaAlerta}>
              <AlertCircle size={18} />
              <AlertTitle>Error de conexión</AlertTitle>
              <AlertDescription>{descripcionError}</AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            <div className={styles.portadaCargador}>
              <Loader2 className={styles.iconoCarga} />
              <p>{mensajeCargando}</p>
            </div>
          ) : null}

          {haySinJuegos ? (
            <div className={styles.portadaMensajeEstado}>
              <h2>{tituloHero}</h2>
              <p>{mensajeSinJuegos}</p>
            </div>
          ) : null}

          {haySinResultados ? (
            <div className={styles.portadaMensajeEstado}>
              <h2>{mensajeSinResultadosPlantilla}</h2>
              <p>{textoSinResultados}</p>
            </div>
          ) : null}

          {limiteFavoritosAlcanzado ? (
            <div className={styles.portadaAvisoLimite} data-variant="favoritos">
              <Star size={20} />
              <p>{textoLimiteFavoritos}</p>
            </div>
          ) : null}

          {limitePendientesAlcanzado ? (
            <div
              className={styles.portadaAvisoLimite}
              data-variant="pendientes"
            >
              <Clock size={20} />
              <p>{textoLimitePendientes}</p>
            </div>
          ) : null}
        </div>

        {mostrarCarrusel ? (
          <div className={styles.portadaCarrusel}>
            <GameCarousel
              games={juegos}
              title={
                carrusel.titulo.trim() !== ""
                  ? carrusel.titulo
                  : "Explora rápidamente tus juegos"
              }
              subtitle={
                carrusel.subtitulo.trim() !== ""
                  ? carrusel.subtitulo
                  : "Desliza para revisar cualquier título"
              }
              onSelect={onSelectJuego}
            />
          </div>
        ) : null}

        {mostrarCarrusel ? (
          <div className={styles.portadaDesplazamiento}>
            <span>{"Desliza para ver más"}</span>
            <svg
              className={styles.portadaIconoDesplazamiento}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="presentation"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        ) : null}
      </div>
    </section>
  );
};
