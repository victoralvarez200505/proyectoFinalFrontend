import type { ChangeEvent, ReactNode } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Gamepad2,
  Loader2,
  Monitor,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import type { Juego } from "@/tipos/juego";
import { Button } from "@/components/ui/general/boton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/general/alertas";
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
              className={cn(
                styles.entradaBusquedaPortada,
                styles.entradaBusqueda
              )}
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
            <div className={styles.resumenLista}>
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
              {juegos.map((juego) => {
                const etiquetas: Array<{
                  id: string;
                  texto: string;
                  icono: ReactNode;
                }> = [];

                if (juego.completado) {
                  etiquetas.push({
                    id: "completado",
                    texto: "Completado",
                    icono: <CheckCircle2 size={16} />,
                  });
                } else if (juego.pendiente) {
                  etiquetas.push({
                    id: "pendiente",
                    texto: "Pendiente",
                    icono: <Clock size={16} />,
                  });
                }

                if (juego.favorito) {
                  etiquetas.push({
                    id: "favorito",
                    texto: "Favorito",
                    icono: <Star size={16} />,
                  });
                }

                return (
                  <li key={juego.id} className={styles.elementoTarjetaJuego}>
                    <article className={styles.tarjetaJuego}>
                      <div className={styles.marcoImagenJuego}>
                        {juego.imagen ? (
                          <img
                            src={juego.imagen}
                            alt={`Portada de ${juego.nombre}`}
                            className={styles.imagenJuego}
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.imagenJuegoFallback}>
                            <Gamepad2 size={28} />
                          </div>
                        )}
                      </div>

                      <div className={styles.tarjetaJuegoContenido}>
                        <header className={styles.tarjetaJuegoEncabezado}>
                          <h3 className={styles.tarjetaJuegoTitulo}>
                            {juego.nombre}
                          </h3>
                          {etiquetas.length > 0 ? (
                            <div className={styles.tarjetaJuegoEtiquetas}>
                              {etiquetas.map((etiqueta) => (
                                <span
                                  key={etiqueta.id}
                                  className={styles.etiquetaJuego}
                                  data-variant={etiqueta.id}
                                >
                                  {etiqueta.icono}
                                  {etiqueta.texto}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </header>

                        <div className={styles.tarjetaJuegoMeta}>
                          <span>
                            <Calendar size={14} />
                            {juego.año}
                          </span>
                          <span>
                            <Gamepad2 size={14} />
                            {juego.genero}
                          </span>
                          <span>
                            <Monitor size={14} />
                            {juego.plataforma}
                          </span>
                        </div>

                        {juego.desarrollador ? (
                          <div className={styles.tarjetaJuegoDetalle}>
                            Desarrollador:{" "}
                            <strong>{juego.desarrollador}</strong>
                          </div>
                        ) : null}

                        {juego.tienda ? (
                          <div className={styles.tarjetaJuegoDetalle}>
                            Disponible en: <strong>{juego.tienda}</strong>
                          </div>
                        ) : null}

                        {juego.sinopsis ? (
                          <p className={styles.tarjetaJuegoSinopsis}>
                            {juego.sinopsis}
                          </p>
                        ) : null}

                        <div className={styles.tarjetaJuegoAcciones}>
                          {onSelectJuego ? (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => onSelectJuego(juego)}
                              className={styles.botonAccionPrimario}
                            >
                              Ver reseñas
                            </Button>
                          ) : null}
                          {onEditarJuego ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => onEditarJuego(juego)}
                            >
                              <Pencil
                                size={16}
                                className={styles.iconoBotonMediano}
                              />
                              Editar
                            </Button>
                          ) : null}
                          {onEliminarJuego ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => onEliminarJuego(juego.id)}
                            >
                              <Trash2
                                size={16}
                                className={styles.iconoBotonMediano}
                              />
                              Eliminar
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>

            {totalPaginas > 1 ? (
              <div className={styles.paginacion}>
                <div className={styles.paginacionControles}>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={onPaginaAnterior}
                    disabled={paginaActual <= 1}
                  >
                    Anterior
                  </Button>
                  <div className={styles.paginacionPaginas}>
                    {paginas.map((pagina) => (
                      <button
                        key={pagina}
                        type="button"
                        className={styles.paginacionPagina}
                        data-active={pagina === paginaActual}
                        onClick={() => onPaginaChange(pagina)}
                        aria-current={
                          pagina === paginaActual ? "page" : undefined
                        }
                        aria-label={`Ir a la página ${pagina}`}
                      >
                        {pagina}
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={onPaginaSiguiente}
                    disabled={paginaActual >= totalPaginas}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
};
