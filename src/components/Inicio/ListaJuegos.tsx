import {
  AlertCircle,
  Gamepad2,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GameCard } from "@/components/Inicio/GameCard";
import { Button } from "@/components/ui/general/boton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/general/alertas";
import type { Juego } from "@/tipos/juego";
import styles from "@/styles/pages/Inicio.module.css";
import { apiConfig, uiConfig, bibliotecaConfig } from "@/config";
import { cn, reemplazarVariables } from "@/lib/utils";
// import { BarraBusqueda } from "@/components/ui/general/BarraBusqueda";

interface ListaJuegosProps {
  juegos: Juego[];
  totalDisponibles: number;
  totalFiltrados: number;
  cargando: boolean;
  error: string | null;
  hayBusquedaActiva: boolean;
  terminoBusqueda: string;
  textoSinResultados: string;
  paginaActual: number;
  totalPaginas: number;
  juegosPorPagina: number;
  onPaginaAnterior: () => void;
  onPaginaSiguiente: () => void;
  onPaginaChange: (pagina: number) => void;
  onAddJuego: () => void;
  onSelectJuego?: (juego: Juego) => void;
  onEditarJuego?: (juego: Juego) => void;
  onEliminarJuego?: (id: string) => void;
  onSearchChange: (valor: string) => void;
  onClearBusqueda: () => void;
}

const crearRangoPaginado = (totalPaginas: number): number[] => {
  return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
};

export const ListaJuegos = ({
  juegos,
  totalDisponibles,
  totalFiltrados,
  cargando,
  error,
  hayBusquedaActiva,
  terminoBusqueda,
  textoSinResultados,
  paginaActual,
  totalPaginas,
  juegosPorPagina,
  onPaginaAnterior,
  onPaginaSiguiente,
  onPaginaChange,
  onAddJuego,
  onSelectJuego,
  onEditarJuego,
  onEliminarJuego,
  onSearchChange,
  onClearBusqueda,
}: ListaJuegosProps) => {
  const titulosLista = uiConfig.titulos.lista;
  const mensajes = uiConfig.mensajes;

  const tituloSeccion =
    titulosLista.titulo.trim() !== "" ? titulosLista.titulo : "Tu biblioteca";
  const subtituloSeccion =
    titulosLista.subtitulo.trim() !== ""
      ? titulosLista.subtitulo
      : "Gestiona tus juegos a tu manera";

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

  const servidorObjetivo = apiConfig.baseUrl || "el servidor configurado";
  const plantillaError =
    mensajes.errorConexion.trim() !== ""
      ? mensajes.errorConexion
      : "No pudimos conectar con {servidor}. Detalle: {detalles}";

  const descripcionError = error
    ? reemplazarVariables(plantillaError, {
        servidor: servidorObjetivo,
        detalles: error,
      })
    : "";

  const sinResultados =
    !cargando && !error && hayBusquedaActiva && totalFiltrados === 0;
  const sinJuegosTotales = !cargando && !error && totalDisponibles === 0;
  const mostrarListado =
    !cargando && !error && totalFiltrados > 0 && juegos.length > 0;

  const sinPaginacion =
    !Number.isFinite(juegosPorPagina) || juegosPorPagina <= 0;
  const rangoInicio = mostrarListado
    ? sinPaginacion
      ? 1
      : (paginaActual - 1) * juegosPorPagina + 1
    : 0;
  const rangoFin = mostrarListado
    ? sinPaginacion
      ? juegos.length
      : Math.min(rangoInicio + juegos.length - 1, totalFiltrados)
    : 0;

  const paginas = crearRangoPaginado(totalPaginas);

  return (
    <section className={styles.seccionLista} aria-labelledby="lista-juegos">
      <div className={styles.encabezadoLista}>
        <div className={styles.grupoEncabezadoLista}>
          <h2 id="lista-juegos" className={styles.tituloLista}>
            {tituloSeccion}
          </h2>
          <p className={styles.subtituloLista}>{subtituloSeccion}</p>
        </div>
        <div className={styles.filtros}>
          <div className={styles.portadaCampoBusqueda}>
            <svg
              className={styles.iconoBusquedaPortada}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={terminoBusqueda}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={bibliotecaConfig.placeholderBusqueda}
              className={styles.entradaBusquedaPortada}
              aria-label="Buscar en la biblioteca"
            />
            {terminoBusqueda ? (
              <button
                type="button"
                className={styles.botonLimpiarBusqueda}
                onClick={onClearBusqueda}
                aria-label="Limpiar búsqueda"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            ) : null}
          </div>
          <div className={styles.botonesFiltro}>
            <Button
              onClick={onAddJuego}
              className={styles.accionPrincipal}
              size="sm"
            >
              <Plus size={16} className={styles.iconoBotonMediano} />
              Agregar juego
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.contenidoLista}>
        {error ? (
          <div className={styles.estadoError}>
            <Alert variant="destructive" className={styles.portadaAlerta}>
              <AlertCircle size={20} />
              <AlertTitle>Error de conexión</AlertTitle>
              <AlertDescription>{descripcionError}</AlertDescription>
            </Alert>
          </div>
        ) : null}

        {!error && cargando ? (
          <div className={styles.estadoCargando}>
            <div className={styles.estadoCargandoInterior}>
              <Loader2 className={styles.iconoCarga} />
              <p>{mensajeCargando}</p>
            </div>
          </div>
        ) : null}

        {!error && !cargando && sinJuegosTotales ? (
          <div className={styles.estadoVacio}>
            <div
              className={cn(styles.cajaDelimitada, styles.panelMensajeLista)}
            >
              <div className={styles.insigniaDestacada}>
                <Gamepad2 />
              </div>
              <h3 className={styles.tituloVacio}>Tu biblioteca espera</h3>
              <p className={styles.textoVacio}>{mensajeSinJuegos}</p>
              <Button onClick={onAddJuego} size="sm">
                <Plus size={16} className={styles.iconoBotonMediano} />
                Agregar juego
              </Button>
            </div>
          </div>
        ) : null}

        {!error && !cargando && sinResultados ? (
          <div className={styles.estadoVacio}>
            <div
              className={cn(styles.cajaDelimitada, styles.panelMensajeLista)}
            >
              <div className={styles.insigniaDestacada}>
                <AlertCircle />
              </div>
              <h3 className={styles.tituloVacio}>
                {mensajeSinResultadosPlantilla}
              </h3>
              <p className={styles.textoVacio}>{textoSinResultados}</p>
              <Button onClick={onClearBusqueda} size="sm" variant="secondary">
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : null}

        {mostrarListado ? (
          <>
            <div
              className={styles.resumenLista}
              role="status"
              aria-live="polite"
            >
              <span>
                Mostrando <strong>{rangoInicio}</strong> -{" "}
                <strong>{rangoFin}</strong> de <strong>{totalFiltrados}</strong>{" "}
                juegos
              </span>
              {hayBusquedaActiva ? (
                <span>
                  Filtro activo: "<strong>{terminoBusqueda}</strong>"
                </span>
              ) : null}
            </div>

            <ul className={styles.rejillaTarjetas}>
              {juegos.map((juego) => (
                <li key={juego.id} className={styles.elementoTarjetaJuego}>
                  <GameCard
                    juego={juego}
                    onManageReviews={onSelectJuego}
                    onEdit={onEditarJuego}
                    onDelete={onEliminarJuego}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {mostrarListado && paginas.length > 1 ? (
          <div className={styles.paginacion}>
            <div className={styles.paginacionPaginas}>
              <button
                type="button"
                className={styles.paginacionFlecha}
                onClick={onPaginaAnterior}
                disabled={paginaActual <= 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={20} />
              </button>
              {paginas.map((pagina) => (
                <button
                  key={pagina}
                  type="button"
                  className={styles.paginacionPagina}
                  data-active={pagina === paginaActual ? "true" : undefined}
                  onClick={() => onPaginaChange(pagina)}
                >
                  {pagina}
                </button>
              ))}
              <button
                type="button"
                className={styles.paginacionFlecha}
                onClick={onPaginaSiguiente}
                disabled={paginaActual >= totalPaginas}
                aria-label="Página siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
