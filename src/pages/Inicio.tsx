// Importación de estilos y componentes principales de la página de inicio
import styles from "@/styles/pages/Inicio.module.css";
import { SeccionPrincipal } from "@/components/Inicio/SeccionPrincipal";
import { ListaJuegos } from "@/components/Inicio/ListaJuegos";
import { ResumenGeneros } from "@/components/Inicio/ResumenGeneros";
import { GameForm } from "@/components/Inicio/GameForm";
import { usePaginaInicio } from "@/hooks/usePaginaInicio";
import { integracionesConfig } from "@/config";

import { uiConfig } from "@/config";
import { useState } from "react";
import { Select } from "@/components/ui/general/select";
import { aplicarTema } from "@/lib/tema";
import { IconoTema } from "@/components/ui/general/IconoTema";

// Componente principal de la página de inicio
const Inicio = () => {
  // Se obtienen los estados y funciones necesarias desde el hook personalizado usePaginaInicio
  const {
    juegosConfigurados, // Lista de juegos con configuración aplicada
    juegosPaginados, // Juegos a mostrar en la página actual
    cargando, // Estado de carga
    error, // Estado de error
    genreCounts, // Conteo de juegos por género
    totalCompletados, // Total de juegos completados
    totalPendientes, // Total de juegos pendientes
    abrirFormulario, // Función para abrir el formulario de juego
    editarJuego, // Función para editar un juego
    eliminarJuegoConConfirmacion, // Función para eliminar un juego con confirmación
    gestionarResenias, // Función para gestionar reseñas
    guardarJuego, // Función para guardar un juego
    cambiarEstadoFormulario, // Cambia el estado de apertura del formulario
    terminoBusqueda, // Término de búsqueda actual
    hayBusquedaActiva, // Indica si hay una búsqueda activa
    textoSinResultados, // Mensaje cuando no hay resultados
    establecerTerminoBusqueda, // Cambia el término de búsqueda
    limpiarBusqueda, // Limpia la búsqueda
    totalDisponibles, // Total de juegos disponibles
    totalFiltrados, // Total de juegos filtrados
    paginaActual, // Página actual
    totalPaginas, // Total de páginas
    paginaSiguiente, // Ir a la página siguiente
    paginaAnterior, // Ir a la página anterior
    irAPagina, // Ir a una página específica
    juegosPorPagina, // Juegos por página
    limiteFavoritosAlcanzado, // Límite de favoritos alcanzado
    limitePendientesAlcanzado, // Límite de pendientes alcanzado
    mensajeLimiteFavoritos, // Mensaje de límite de favoritos
    mensajeLimitePendientes, // Mensaje de límite de pendientes
    isFormOpen, // Estado de apertura del formulario
    editingGame, // Juego en edición
  } = usePaginaInicio();

  // Total de juegos disponibles
  const juegosTotales = totalDisponibles;
  // Determina si se pueden gestionar reseñas según la configuración
  const puedeGestionarResenias =
    integracionesConfig.featureFlags.habilitarResenias !== false;

  // Estado para el tema seleccionado y visibilidad del menú
  const [temaSeleccionado, setTemaSeleccionado] = useState(
    uiConfig.tema.variant
  );
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // Manejar cambio de tema
  const handleChangeTema = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTema = e.target.value;
    setTemaSeleccionado(nuevoTema);
    setMostrarMenu(false);
    aplicarTema({
      nombre: nuevoTema,
      paletaColores: uiConfig.tema.presets[nuevoTema]?.paletaColores || {},
      gradientes: uiConfig.tema.presets[nuevoTema]?.gradientes || {},
    });
  };

  // Renderizado de la página de inicio
  return (
    <>
      {/* Icono de selección de tema a la derecha */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          margin: "1rem 0",
          position: "relative",
        }}
      >
        <IconoTema
          onClick={() => setMostrarMenu((v) => !v)}
          title="Cambiar tema visual"
        />
        {mostrarMenu && (
          <div
            style={{
              position: "absolute",
              top: "2.5rem",
              right: 0,
              background: "#23263a",
              border: "1px solid #444",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              zIndex: 100,
              padding: "0.5rem 1rem",
            }}
          >
            <Select
              value={temaSeleccionado}
              onChange={handleChangeTema}
              style={{ width: 160 }}
            >
              {Object.keys(uiConfig.tema.presets).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/-/g, " ")}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
      {/* Contenedor principal de la página */}
      <div className={styles.pagina}>
        {/* Sección principal con resumen y acciones rápidas */}
        <SeccionPrincipal
          juegosTotales={juegosTotales}
          juegosCompletados={totalCompletados}
          juegosPendientes={totalPendientes}
          isLoading={cargando}
          error={error}
          juegos={juegosConfigurados}
          totalFiltrados={totalFiltrados}
          textoSinResultados={textoSinResultados}
          hayBusquedaActiva={hayBusquedaActiva}
          onAddJuego={abrirFormulario}
          onSelectJuego={puedeGestionarResenias ? gestionarResenias : undefined}
          limiteFavoritosAlcanzado={limiteFavoritosAlcanzado}
          limitePendientesAlcanzado={limitePendientesAlcanzado}
          mensajeLimiteFavoritos={mensajeLimiteFavoritos}
          mensajeLimitePendientes={mensajeLimitePendientes}
        />

        {/* Resumen de géneros de los juegos */}
        <ResumenGeneros generos={genreCounts} visible={!cargando && !error} />

        {/* Lista de juegos con paginación y acciones */}
        <ListaJuegos
          juegos={juegosPaginados}
          totalDisponibles={totalDisponibles}
          totalFiltrados={totalFiltrados}
          cargando={cargando}
          error={error}
          hayBusquedaActiva={hayBusquedaActiva}
          terminoBusqueda={terminoBusqueda}
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

      {/* Formulario para agregar o editar juegos */}
      <GameForm
        open={isFormOpen}
        onOpenChange={cambiarEstadoFormulario}
        onSave={guardarJuego}
        editingGame={editingGame}
      />
    </>
  );
};

// Exporta el componente de la página de inicio
export default Inicio;
