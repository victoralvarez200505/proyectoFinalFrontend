import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useGameStore } from "@/hooks/useGameStore.ts";
import { GENEROS } from "@/lib/generos";
import type { Juego } from "@/types/juego";
import { bibliotecaConfig, uiConfig } from "@/config";
import { reemplazarVariables } from "@/lib/utils";

interface JuegoConOpcionalId extends Omit<Juego, "id"> {
  id?: string;
}

const CAMPOS_FALLBACK = ["nombre", "genero", "plataforma"] as const;

type DireccionOrden = "asc" | "desc";
type CampoOrden = "fecha" | "nombre" | "año";

const obtenerCamposBusqueda = (): string[] => {
  const configurados = bibliotecaConfig.camposBusqueda
    .map((campo) => campo.toLowerCase().trim())
    .filter((campo) => campo.length > 0);

  if (configurados.length > 0) {
    return configurados;
  }

  return [...CAMPOS_FALLBACK];
};

const obtenerOrdenPorDefecto = (): {
  campo: CampoOrden;
  direccion: DireccionOrden;
} => {
  const [campoCrudo = "fecha", direccionCruda = "desc"] =
    bibliotecaConfig.ordenPredeterminado.toLowerCase().split("-");

  let campo: CampoOrden = "fecha";
  if (campoCrudo === "nombre") {
    campo = "nombre";
  } else if (campoCrudo === "año" || campoCrudo === "ano") {
    campo = "año";
  }

  const direccion: DireccionOrden = direccionCruda === "asc" ? "asc" : "desc";

  return { campo, direccion };
};

const coincideConBusqueda = (
  juego: Juego,
  campo: string,
  termino: string
): boolean => {
  switch (campo) {
    case "nombre":
      return juego.nombre.toLowerCase().includes(termino);
    case "genero":
      return juego.genero.toLowerCase().includes(termino);
    case "plataforma":
      return juego.plataforma.toLowerCase().includes(termino);
    case "desarrollador":
      return (juego.desarrollador ?? "").toLowerCase().includes(termino);
    case "tienda":
      return (juego.tienda ?? "").toLowerCase().includes(termino);
    case "sinopsis":
      return (juego.sinopsis ?? "").toLowerCase().includes(termino);
    case "año":
      return juego.año ? String(juego.año).includes(termino) : false;
    case "id":
      return juego.id.toLowerCase().includes(termino);
    default: {
      const registroGenerico = juego as unknown as Record<string, unknown>;
      const valor = registroGenerico[campo];
      if (typeof valor === "string") {
        return valor.toLowerCase().includes(termino);
      }

      if (typeof valor === "number") {
        return String(valor).includes(termino);
      }

      return false;
    }
  }
};

const estaPendiente = (juego: Juego): boolean => {
  if (typeof juego.pendiente === "boolean") {
    return juego.pendiente;
  }

  if (typeof juego.completado === "boolean") {
    return !juego.completado;
  }

  return true;
};

export const usePaginaInicio = () => {
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
  const [paginaActual, setPaginaActual] = useState(1);

  const camposBusqueda = useMemo(obtenerCamposBusqueda, []);
  const ordenPorDefecto = useMemo(obtenerOrdenPorDefecto, []);
  const juegosPorPagina = useMemo(
    () => Math.max(0, bibliotecaConfig.juegosPorPagina),
    []
  );

  const juegosConfigurados = useMemo(() => {
    const base = bibliotecaConfig.mostrarSoloCompletados
      ? juegos.filter((juego) => Boolean(juego.completado))
      : juegos;

    const coleccionOrdenada = [...base];

    coleccionOrdenada.sort((a, b) => {
      const factor = ordenPorDefecto.direccion === "asc" ? 1 : -1;

      if (ordenPorDefecto.campo === "nombre") {
        return a.nombre.localeCompare(b.nombre) * factor;
      }

      if (ordenPorDefecto.campo === "año") {
        const valorA = Number.isFinite(a.año) ? a.año : 0;
        const valorB = Number.isFinite(b.año) ? b.año : 0;
        return (valorA - valorB) * factor;
      }

      const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
      const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
      return (fechaA - fechaB) * factor;
    });

    return coleccionOrdenada;
  }, [juegos, ordenPorDefecto]);

  const genreCounts = useMemo(() => {
    return GENEROS.map((genero) => ({
      genre: genero,
      count: juegosConfigurados.filter(
        (juego: Juego) => juego.genero === genero
      ).length,
    }));
  }, [juegosConfigurados]);

  const totalCompletados = useMemo(() => {
    return juegosConfigurados.filter((juego: Juego) => juego.completado).length;
  }, [juegosConfigurados]);

  const totalPendientes = useMemo(() => {
    return Math.max(juegosConfigurados.length - totalCompletados, 0);
  }, [juegosConfigurados.length, totalCompletados]);

  const hayBusquedaActiva = terminoBusqueda.trim() !== "";

  const juegosFiltrados = useMemo(() => {
    if (!hayBusquedaActiva) {
      return juegosConfigurados;
    }

    const termino = terminoBusqueda.trim().toLowerCase();

    return juegosConfigurados.filter((juego: Juego) =>
      camposBusqueda.some((campo) => coincideConBusqueda(juego, campo, termino))
    );
  }, [camposBusqueda, hayBusquedaActiva, juegosConfigurados, terminoBusqueda]);

  const juegosPaginados = useMemo(() => {
    if (!Number.isFinite(juegosPorPagina) || juegosPorPagina <= 0) {
      return juegosFiltrados;
    }

    const inicio = (paginaActual - 1) * juegosPorPagina;
    return juegosFiltrados.slice(inicio, inicio + juegosPorPagina);
  }, [juegosFiltrados, juegosPorPagina, paginaActual]);

  const totalPaginas = useMemo(() => {
    if (!Number.isFinite(juegosPorPagina) || juegosPorPagina <= 0) {
      return 1;
    }

    return Math.max(1, Math.ceil(juegosFiltrados.length / juegosPorPagina));
  }, [juegosFiltrados.length, juegosPorPagina]);

  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda, juegosPorPagina]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const irAPagina = useCallback(
    (pagina: number) => {
      if (pagina < 1 || pagina > totalPaginas) {
        return;
      }
      setPaginaActual(pagina);
    },
    [totalPaginas]
  );

  const paginaSiguiente = useCallback(() => {
    irAPagina(paginaActual + 1);
  }, [irAPagina, paginaActual]);

  const paginaAnterior = useCallback(() => {
    irAPagina(paginaActual - 1);
  }, [irAPagina, paginaActual]);

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

  const limiteFavoritos = Math.max(0, bibliotecaConfig.maxFavoritos);
  const limitePendientes = Math.max(0, bibliotecaConfig.maxPendientes);

  const totalFavoritos = useMemo(() => {
    return juegosConfigurados.filter((juego) => Boolean(juego.favorito)).length;
  }, [juegosConfigurados]);

  const totalPendientesLimite = useMemo(() => {
    return juegosConfigurados.filter((juego) => estaPendiente(juego)).length;
  }, [juegosConfigurados]);

  const mensajeLimiteFavoritos = useMemo(() => {
    if (limiteFavoritos > 0 && totalFavoritos >= limiteFavoritos) {
      const plantilla =
        uiConfig.mensajes.limiteFavoritos ||
        "Alcanzaste el límite de {limite} juegos favoritos.";
      return reemplazarVariables(plantilla, { limite: limiteFavoritos });
    }
    return "";
  }, [limiteFavoritos, totalFavoritos]);

  const mensajeLimitePendientes = useMemo(() => {
    if (limitePendientes > 0 && totalPendientesLimite >= limitePendientes) {
      const plantilla =
        uiConfig.mensajes.limitePendientes ||
        "Alcanzaste el límite de {limite} juegos pendientes.";
      return reemplazarVariables(plantilla, { limite: limitePendientes });
    }
    return "";
  }, [limitePendientes, totalPendientesLimite]);

  const limiteFavoritosAlcanzado = mensajeLimiteFavoritos.trim() !== "";
  const limitePendientesAlcanzado = mensajeLimitePendientes.trim() !== "";

  return {
    juegos,
    juegosConfigurados,
    cargando,
    error,
    genreCounts,
    totalCompletados,
    totalPendientes,
    juegosFiltrados,
    juegosPaginados,
    totalFiltrados: juegosFiltrados.length,
    paginaActual,
    totalPaginas,
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
    totalDisponibles: juegosConfigurados.length,
    paginaSiguiente,
    paginaAnterior,
    irAPagina,
    juegosPorPagina,
    placeholderBusqueda:
      bibliotecaConfig.placeholderBusqueda || "Buscar en tu biblioteca",
    textoSinResultados:
      bibliotecaConfig.textoSinResultados ||
      uiConfig.mensajes.sinResultados ||
      "No hay coincidencias para los filtros aplicados",
    limiteFavoritos,
    limitePendientes,
    totalFavoritos,
    totalPendientesLimite,
    limiteFavoritosAlcanzado,
    limitePendientesAlcanzado,
    mensajeLimiteFavoritos,
    mensajeLimitePendientes,
  };
};
