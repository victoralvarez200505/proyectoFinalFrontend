import styles from "@/styles/pages/Inicio.module.css";
import { SeccionPrincipal } from "@/components/Inicio/SeccionPrincipal";
import { usarPaginaInicio } from "@/hooks/usarPaginaInicio";

const Inicio = () => {
  const {
    juegos,
    cargando,
    error,
    totalCompletados,
    totalPendientes,
    abrirFormulario,
    gestionarResenias,
  } = usarPaginaInicio();

  const juegosTotales = juegos.length;

  return (
    <>
      <div className={styles.pagina}>
        <SeccionPrincipal
          juegosTotales={juegosTotales}
          juegosCompletados={totalCompletados}
          juegosPendientes={totalPendientes}
          isLoading={cargando}
          error={error}
          juegos={juegos}
          onAddJuego={abrirFormulario}
          onSelectJuego={gestionarResenias}
        />
      </div>
    </>
  );
};

export default Inicio;
