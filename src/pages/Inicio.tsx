import styles from "@/styles/pages/Inicio.module.css";
import { SeccionPrincipal } from "@/components/Inicio/SeccionPrincipal";

const Inicio = () => {
  return (
    <>
      <div className={styles.pagina}>
        <SeccionPrincipal
          juegosTotales={}
          juegosCompletados={}
          juegosPendientes={}
          isLoading={}
          error={}
          juegos={}
          onAddJuego={}
          onSelectJuego={}
        />
      </div>
    </>
  );
};

export default Inicio;
