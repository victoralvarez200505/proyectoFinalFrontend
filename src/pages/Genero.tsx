import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Loader2, Plus, Search } from "lucide-react";

import styles from "@/styles/pages/Genero.module.css";
import { useGameStore } from "@/hooks/useGameStore";
import type { Juego } from "@/types/juego";
import { Button } from "@/components/ui/general/boton";
import { Input } from "@/components/ui/general/input";
import { GameCard } from "@/components/Inicio/GameCard";
import { GameForm } from "@/components/Inicio/GameForm";
import { GENEROS } from "@/lib/generos";
import { bibliotecaConfig } from "@/config";
import { cn } from "@/lib/utils";

const normalizar = (valor: string) =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const capitalizar = (valor: string) => {
  if (!valor) return "";
  const texto = valor.replace(/[-_]+/g, " ").trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const Genero = () => {
  const { genero: generoParam = "" } = useParams<{ genero: string }>();
  const navigate = useNavigate();
  const {
    juegos,
    cargando,
    error,
    agregarJuego,
    actualizarJuego,
    eliminarJuego,
  } = useGameStore();

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Juego | null>(null);

  useEffect(() => {
    setTerminoBusqueda("");
    setEditingGame(null);
    setIsFormOpen(false);
  }, [generoParam]);

  const slugNormalizado = useMemo(
    () => normalizar(decodeURIComponent(generoParam)),
    [generoParam]
  );

  const generoCanonico = useMemo(() => {
    if (!slugNormalizado) return "";

    const coincidencia = GENEROS.find(
      (nombre) => normalizar(nombre) === slugNormalizado
    );
    if (coincidencia) {
      return coincidencia;
    }

    const juegoCoincidente = juegos.find(
      (juegoActual) => normalizar(juegoActual.genero) === slugNormalizado
    );
    if (juegoCoincidente) {
      return juegoCoincidente.genero;
    }

    return capitalizar(decodeURIComponent(generoParam));
  }, [generoParam, juegos, slugNormalizado]);

  const juegosPorGenero = useMemo(() => {
    if (!slugNormalizado) {
      return [];
    }

    return juegos.filter(
      (juegoActual) => normalizar(juegoActual.genero) === slugNormalizado
    );
  }, [juegos, slugNormalizado]);

  const hayBusquedaActiva = terminoBusqueda.trim() !== "";

  const juegosFiltrados = useMemo(() => {
    if (!hayBusquedaActiva) {
      return juegosPorGenero;
    }

    const termino = terminoBusqueda.trim().toLowerCase();

    return juegosPorGenero.filter((juegoActual) => {
      const nombre = juegoActual.nombre.toLowerCase();
      const plataforma = juegoActual.plataforma.toLowerCase();
      const desarrollador = (juegoActual.desarrollador ?? "").toLowerCase();
      const tienda = (juegoActual.tienda ?? "").toLowerCase();
      const sinopsis = (juegoActual.sinopsis ?? "").toLowerCase();
      const año = juegoActual.año ? String(juegoActual.año) : "";

      return (
        nombre.includes(termino) ||
        plataforma.includes(termino) ||
        desarrollador.includes(termino) ||
        tienda.includes(termino) ||
        sinopsis.includes(termino) ||
        año.includes(termino)
      );
    });
  }, [hayBusquedaActiva, juegosPorGenero, terminoBusqueda]);

  const handleGuardarJuego = (datos: Omit<Juego, "id"> & { id?: string }) => {
    if (datos.id) {
      return actualizarJuego(datos as Juego);
    }

    return agregarJuego(datos);
  };

  const handleAgregarJuego = () => {
    setEditingGame(null);
    setIsFormOpen(true);
  };

  const handleEditarJuego = (juegoActual: Juego) => {
    setEditingGame(juegoActual);
    setIsFormOpen(true);
  };

  const handleEliminarJuego = (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este juego de tu biblioteca?"
      )
    ) {
      void eliminarJuego(id);
    }
  };

  const handleGestionarResenias = (juegoActual: Juego) => {
    navigate(`/resenias/${juegoActual.id}`);
  };

  const placeholderBusqueda =
    bibliotecaConfig.placeholderBusqueda ||
    "Buscar por nombre, plataforma o sinopsis";
  const mensajeSinResultados =
    bibliotecaConfig.textoSinResultados ||
    "No hay coincidencias para los filtros aplicados";

  const mostrarEstadoSinGenero =
    !cargando && !error && slugNormalizado && juegosPorGenero.length === 0;

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <div className={styles.encabezadoContenido}>
          <div className={styles.encabezadoPrincipal}>
            <Link to="/">
              <Button
                variant="outline"
                size="icon"
                className={styles.botonVolver}
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </Button>
            </Link>
            <div className={styles.grupoTitulo}>
              <h1 className={styles.titulo}>{generoCanonico || "Género"}</h1>
              <p className={styles.subtitulo}>
                {hayBusquedaActiva
                  ? `${juegosFiltrados.length} coincidencia${
                      juegosFiltrados.length === 1 ? "" : "s"
                    } de ${juegosPorGenero.length}`
                  : `${juegosPorGenero.length} juego${
                      juegosPorGenero.length === 1 ? "" : "s"
                    } disponibles`}
              </p>
            </div>
          </div>

          <div className={styles.acciones}>
            <div className={styles.grupoBusqueda}>
              <div className={styles.campoBusqueda}>
                <Search
                  className={styles.iconoBusqueda}
                  size={16}
                  aria-hidden="true"
                />
                <Input
                  value={terminoBusqueda}
                  onChange={(evento) => setTerminoBusqueda(evento.target.value)}
                  placeholder={placeholderBusqueda}
                  className={styles.entradaBusqueda}
                  aria-label="Buscar dentro de este género"
                />
                {hayBusquedaActiva ? (
                  <button
                    type="button"
                    className={styles.botonLimpiar}
                    onClick={() => setTerminoBusqueda("")}
                  >
                    Limpiar
                  </button>
                ) : null}
              </div>
            </div>

            <Button
              onClick={handleAgregarJuego}
              className={styles.botonPrincipal}
            >
              <Plus
                size={18}
                className={styles.iconoBoton}
                aria-hidden="true"
              />
              Agregar juego
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.contenido}>
        {cargando ? (
          <div className={styles.estado}>
            <div className={styles.estadoInterior}>
              <Loader2 className={styles.iconoCarga} aria-hidden="true" />
              <p>Cargando juegos del género...</p>
            </div>
          </div>
        ) : error ? (
          <div className={styles.estado}>
            <div className={cn(styles.panelMensaje, styles.panelError)}>
              <AlertCircle size={20} aria-hidden="true" />
              <div>
                <h2>Ocurrió un problema</h2>
                <p>{error}. Verifica que tu servidor esté disponible.</p>
              </div>
            </div>
          </div>
        ) : mostrarEstadoSinGenero ? (
          <div className={styles.estado}>
            <div className={cn(styles.panelMensaje, styles.panelVacio)}>
              <h2>No hay juegos de este género</h2>
              <p>
                Agrega tu primer juego de {generoCanonico || generoParam} para
                construir esta colección.
              </p>
              <Button onClick={handleAgregarJuego} size="sm">
                <Plus
                  size={16}
                  className={styles.iconoBoton}
                  aria-hidden="true"
                />
                Agregar juego
              </Button>
            </div>
          </div>
        ) : juegosFiltrados.length === 0 ? (
          <div className={styles.estado}>
            <div className={cn(styles.panelMensaje, styles.panelBusqueda)}>
              <AlertCircle size={20} aria-hidden="true" />
              <div>
                <h2>{mensajeSinResultados}</h2>
                <p>Prueba ajustando tu búsqueda o limpia los filtros.</p>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setTerminoBusqueda("")}
                >
                  Limpiar búsqueda
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ul className={styles.rejilla}>
            {juegosFiltrados.map((juegoActual) => (
              <li key={juegoActual.id} className={styles.elementoJuego}>
                <GameCard
                  juego={juegoActual}
                  onEdit={handleEditarJuego}
                  onDelete={handleEliminarJuego}
                  onManageReviews={handleGestionarResenias}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <GameForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleGuardarJuego}
        editingGame={editingGame}
      />
    </div>
  );
};

export default Genero;
