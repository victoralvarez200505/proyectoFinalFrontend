import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "@/styles/pages/PaginaNoEncontrada.module.css";

const PaginaNoEncontrada = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Error 404: Esta página no existe:", location.pathname);
  }, [location.pathname]);

  return (
    <div className={styles.pagina}>
      <div className={styles.tarjeta}>
        <h1 className={styles.titulo}>404</h1>
        <p className={styles.mensaje}>
          Ups, no encontramos la página que estabas buscando.
        </p>
        <Link to="/" className={styles.enlace}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PaginaNoEncontrada;
