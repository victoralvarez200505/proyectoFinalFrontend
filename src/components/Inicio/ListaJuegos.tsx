import type { ChangeEvent } from "react";
import {
  AlertCircle,
  Gamepad2,
  Loader2,
  Plus,
  Search,
  XCircle,
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
import { apiConfig, uiConfig } from "@/config";
import { cn, reemplazarVariables } from "@/lib/utils";

interface ListaJuegosProps {
  juegos: Juego[];
  totalDisponibles: number;
  totalFiltrados: number;
  cargando: boolean;
  error: string | null;
  hayBusquedaActiva: boolean;
  terminoBusqueda: string;
  placeholderBusqueda: string;
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
  placeholderBusqueda,
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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

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
          <div className={styles.contenedorBusqueda}>
            <Search size={18} className={styles.iconoBusqueda} />
            <input
              type="search"
              value={terminoBusqueda}
              onChange={handleSearchChange}
              placeholder={placeholderBusqueda}
              className={styles.entradaBusqueda}
              aria-label="Buscar en la biblioteca"
            />
            {terminoBusqueda ? (
              <button
                type="button"
                className={styles.botonLimpiarBusqueda}
                onClick={onClearBusqueda}
                aria-label="Limpiar búsqueda"
              >
                <XCircle size={18} />
              </button>
            ) : null}
          </div>
          <div className={styles.botonesFiltro}>
            <Button
              onClick={onAddJuego}
              size="sm"
              className={styles.accionPrincipal}
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
            <div className={styles.paginacionControles}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onPaginaAnterior}
                disabled={paginaActual <= 1}
              >
                Página anterior
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onPaginaSiguiente}
                disabled={paginaActual >= totalPaginas}
              >
                Página siguiente
              </Button>
            </div>
            <div className={styles.paginacionPaginas}>
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
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
