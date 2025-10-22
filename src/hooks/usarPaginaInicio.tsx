import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useGameStore } from "@/hooks/useGameStore.ts";
import { GENEROS } from "@/lib/generos";
import type { Juego } from "@/tipos/juego";

interface JuegoConOpcionalId extends Omit<Juego, "id"> {
  id?: string;
}

export const usarPaginaInicio = () => {
  const {
    juegos,
    cargando,
    error,
    agregarJuego,
    actualizarJuego,
    eliminarJuego,
  } = useGameStore();

  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Juego | null>(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const genreCounts = useMemo(() => {
    return GENEROS.map((genero) => ({
      genre: genero,
      count: juegos.filter((juego: Juego) => juego.genero === genero).length,
    }));
  }, [juegos]);

  const totalCompletados = useMemo(() => {
    return juegos.filter((juego: Juego) => juego.completado).length;
  }, [juegos]);

  const totalPendientes = useMemo(() => {
    return Math.max(juegos.length - totalCompletados, 0);
  }, [juegos.length, totalCompletados]);

  const hayBusquedaActiva = terminoBusqueda.trim() !== "";

  const juegosFiltrados = useMemo(() => {
    if (!hayBusquedaActiva) {
      return juegos;
    }

    const termino = terminoBusqueda.trim().toLowerCase();

    return juegos.filter((juego: Juego) => {
      const nombre = juego.nombre.toLowerCase();
      const genero = juego.genero.toLowerCase();
      const plataforma = juego.plataforma.toLowerCase();
      const desarrollador = juego.desarrollador?.toLowerCase() ?? "";
      const tienda = juego.tienda?.toLowerCase() ?? "";
      const sinopsis = juego.sinopsis?.toLowerCase() ?? "";
      const año = juego.año ? String(juego.año) : "";

      return (
        nombre.includes(termino) ||
        genero.includes(termino) ||
        plataforma.includes(termino) ||
        desarrollador.includes(termino) ||
        tienda.includes(termino) ||
        sinopsis.includes(termino) ||
        año.includes(termino)
      );
    });
  }, [hayBusquedaActiva, juegos, terminoBusqueda]);

  const guardarJuego = useCallback(
    (juegoData: JuegoConOpcionalId) => {
      if (juegoData.id) {
        actualizarJuego(juegoData as Juego);
      } else {
        agregarJuego(juegoData);
      }
      setEditingGame(null);
    },
    [actualizarJuego, agregarJuego]
  );

  const abrirFormulario = useCallback(() => {
    setEditingGame(null);
    setIsFormOpen(true);
  }, []);

  const editarJuego = useCallback((juego: Juego) => {
    setEditingGame(juego);
    setIsFormOpen(true);
  }, []);

  const eliminarJuegoConConfirmacion = useCallback(
    (id: string) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este juego?")) {
        eliminarJuego(id);
      }
    },
    [eliminarJuego]
  );

  const gestionarResenias = useCallback(
    (juego: Juego) => {
      navigate(`/resenias/${juego.id}`);
    },
    [navigate]
  );

  const establecerTerminoBusqueda = useCallback((valor: string) => {
    setTerminoBusqueda(valor);
  }, []);

  const cambiarEstadoFormulario = useCallback((estado: boolean) => {
    setIsFormOpen(estado);
  }, []);

  const limpiarBusqueda = useCallback(() => setTerminoBusqueda(""), []);

  return {
    juegos,
    cargando,
    error,
    genreCounts,
    totalCompletados,
    totalPendientes,
    juegosFiltrados,
    terminoBusqueda,
    hayBusquedaActiva,
    isFormOpen,
    editingGame,
    abrirFormulario,
    editarJuego,
    eliminarJuegoConConfirmacion,
    gestionarResenias,
    guardarJuego,
    establecerTerminoBusqueda,
    limpiarBusqueda,
    cambiarEstadoFormulario,
  };
};
