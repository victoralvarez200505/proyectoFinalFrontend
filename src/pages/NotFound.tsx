// Importa hooks y utilidades de React Router y estilos para la página 404
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "@/styles/pages/NotFound.module.css";

// Componente de página no encontrada (404)
// Muestra un mensaje amigable cuando la ruta no existe y un enlace para volver al inicio
const PaginaNoEncontrada = () => {
  // Obtiene la ubicación actual para mostrar en consola la ruta no encontrada
  const location = useLocation();

  // Efecto para registrar en consola el error 404
  useEffect(() => {
    console.error("Error 404: Esta página no existe:", location.pathname);
  }, [location.pathname]);

  return (
    <div className={styles.pagina}>
      <div className={styles.tarjeta}>
        {/* Título grande de error */}
        <h1 className={styles.titulo}>404</h1>
        {/* Mensaje de error */}
        <p className={styles.mensaje}>
          Ups, no encontramos la página que estabas buscando.
        </p>
        {/* Enlace para volver al inicio */}
        <Link to="/" className={styles.enlace}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PaginaNoEncontrada;
