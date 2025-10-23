import styles from "@/styles/pages/Inicio.module.css";
import { SeccionPrincipal } from "@/components/Inicio/SeccionPrincipal";
import { ListaJuegos } from "@/components/Inicio/ListaJuegos";
import { usePaginaInicio } from "@/hooks/usarPaginaInicio";
import { apiConfig, integracionesConfig } from "@/config";

const Inicio = () => {
  const {
    juegosPaginados,
    cargando,
    error,
    totalCompletados,
    totalPendientes,
    abrirFormulario,
    editarJuego,
    eliminarJuegoConConfirmacion,
    gestionarResenias,
    terminoBusqueda,
    hayBusquedaActiva,
    placeholderBusqueda,
    textoSinResultados,
    establecerTerminoBusqueda,
    limpiarBusqueda,
    totalDisponibles,
    totalFiltrados,
    paginaActual,
    totalPaginas,
    paginaSiguiente,
    paginaAnterior,
    irAPagina,
    juegosPorPagina,
    limiteFavoritosAlcanzado,
    limitePendientesAlcanzado,
    mensajeLimiteFavoritos,
    mensajeLimitePendientes,
  } = usePaginaInicio();

  const juegosTotales = totalDisponibles;
  const puedeGestionarResenias =
    integracionesConfig.featureFlags.habilitarResenias !== false;
  const modoOffline =
    integracionesConfig.featureFlags.habilitarModoOffline === true ||
    apiConfig.usarMock === true;

  return (
    <>
      <div className={styles.pagina}>
        <SeccionPrincipal
          juegosTotales={juegosTotales}
          juegosCompletados={totalCompletados}
          juegosPendientes={totalPendientes}
          isLoading={cargando}
          error={error}
          juegos={juegosPaginados}
          totalFiltrados={totalFiltrados}
          terminoBusqueda={terminoBusqueda}
          placeholderBusqueda={placeholderBusqueda}
          textoSinResultados={textoSinResultados}
          hayBusquedaActiva={hayBusquedaActiva}
          onAddJuego={abrirFormulario}
          onSelectJuego={puedeGestionarResenias ? gestionarResenias : undefined}
          onSearchChange={establecerTerminoBusqueda}
          onClearBusqueda={limpiarBusqueda}
          modoOffline={modoOffline}
          limiteFavoritosAlcanzado={limiteFavoritosAlcanzado}
          limitePendientesAlcanzado={limitePendientesAlcanzado}
          mensajeLimiteFavoritos={mensajeLimiteFavoritos}
          mensajeLimitePendientes={mensajeLimitePendientes}
        />

        <ListaJuegos
          juegos={juegosPaginados}
          totalDisponibles={totalDisponibles}
          totalFiltrados={totalFiltrados}
          cargando={cargando}
          error={error}
          hayBusquedaActiva={hayBusquedaActiva}
          terminoBusqueda={terminoBusqueda}
          placeholderBusqueda={placeholderBusqueda}
          textoSinResultados={textoSinResultados}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          juegosPorPagina={juegosPorPagina}
          onPaginaAnterior={paginaAnterior}
          onPaginaSiguiente={paginaSiguiente}
          onPaginaChange={irAPagina}
          onAddJuego={abrirFormulario}
          onSelectJuego={puedeGestionarResenias ? gestionarResenias : undefined}
          onEditarJuego={editarJuego}
          onEliminarJuego={eliminarJuegoConConfirmacion}
          onSearchChange={establecerTerminoBusqueda}
          onClearBusqueda={limpiarBusqueda}
        />
      </div>
    </>
  );
};

export default Inicio;
