import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "@/styles/pages/PaginaNoEncontrada.module.css";

const PaginaNoEncontrada = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Error 404: Esta página no existe:", location.pathname);
  });
  [location.pathname];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>
          Ups, no encontramos la página que estabas buscando.
        </p>
        <Link to="/" className={styles.link}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PaginaNoEncontrada;
