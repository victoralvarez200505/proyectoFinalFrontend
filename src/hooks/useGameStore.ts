import { useCallback, useEffect, useMemo, useState } from "react";
import type { Juego } from "@/types/juego";
import { toast } from "sonner";
import * as api from "@/services/api";
import { bibliotecaConfig, uiConfig } from "@/config";
import { reemplazarVariables } from "@/lib/utils";

type TipoToast = "success" | "error" | "warning";

const mostrarToast = (tipo: TipoToast, mensaje: string) => {
  if (!uiConfig.habilitarToasts) {
    if (tipo === "error") {
      console.error(mensaje);
    } else if (tipo === "warning") {
      console.warn(mensaje);
    }
    return;
  }

  switch (tipo) {
    case "success":
      toast.success(mensaje);
      break;
    case "warning":
      toast.warning(mensaje);
      break;
    case "error":
    default:
      toast.error(mensaje);
      break;
  }
};

const obtenerMensajeLimite = (
  tipo: "favoritos" | "pendientes",
  limite: number
) => {
  const plantillaBase =
    tipo === "favoritos"
      ? uiConfig.mensajes.limiteFavoritos ||
        "Alcanzaste el límite de {limite} juegos favoritos."
      : uiConfig.mensajes.limitePendientes ||
        "Alcanzaste el límite de {limite} juegos pendientes.";

  return reemplazarVariables(plantillaBase, { limite });
};

const esFavorito = (juego: Partial<Juego> | undefined): boolean => {
  return Boolean(juego?.favorito);
};

const esPendiente = (juego: Partial<Juego> | undefined): boolean => {
  if (typeof juego?.pendiente === "boolean") {
    return juego.pendiente;
  }

  if (typeof juego?.completado === "boolean") {
    return !juego.completado;
  }

  return true;
};

const contarFavoritos = (coleccion: Juego[]): number => {
  return coleccion.filter((item) => esFavorito(item)).length;
};

const contarPendientes = (coleccion: Juego[]): number => {
  return coleccion.filter((item) => esPendiente(item)).length;
};

export const useGameStore = () => {
  const usarPredeterminados =
    bibliotecaConfig.habilitarJuegosPredeterminados &&
    bibliotecaConfig.juegos.length > 0;

  const [juegos, setJuegos] = useState<Juego[]>(
    usarPredeterminados ? bibliotecaConfig.juegos : []
  );
  const [cargando, setCargando] = useState(!usarPredeterminados);
  const [error, setError] = useState<string | null>(null);

  const limiteFavoritos = useMemo(
    () => Math.max(0, bibliotecaConfig.maxFavoritos),
    []
  );
  const limitePendientes = useMemo(
    () => Math.max(0, bibliotecaConfig.maxPendientes),
    []
  );

  const cargarJuegos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await api.getJuegos();
      setJuegos(datos);
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al cargar juegos";
      setError(mensaje);
      if (usarPredeterminados) {
        setJuegos(bibliotecaConfig.juegos);
        mostrarToast(
          "warning",
          `${mensaje}. Se mostrarán los juegos definidos en el archivo de configuración.`
        );
      } else {
        mostrarToast("error", mensaje);
      }
    } finally {
      setCargando(false);
    }
  }, [usarPredeterminados]);

  useEffect(() => {
    void cargarJuegos();
  }, [cargarJuegos]);

  const agregarJuego = async (datosJuego: Omit<Juego, "id">) => {
    if (limiteFavoritos > 0 && esFavorito(datosJuego)) {
      const totalFavoritos = contarFavoritos(juegos);
      if (totalFavoritos >= limiteFavoritos) {
        const mensaje = obtenerMensajeLimite("favoritos", limiteFavoritos);
        mostrarToast("warning", mensaje);
        throw new Error(mensaje);
      }
    }

    if (limitePendientes > 0 && esPendiente(datosJuego)) {
      const totalPendientes = contarPendientes(juegos);
      if (totalPendientes >= limitePendientes) {
        const mensaje = obtenerMensajeLimite("pendientes", limitePendientes);
        mostrarToast("warning", mensaje);
        throw new Error(mensaje);
      }
    }

    try {
      const juegoNuevo = await api.createJuego(datosJuego);
      setJuegos((prev) => [...prev, juegoNuevo]);
      mostrarToast("success", "Juego agregado exitosamente");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al agregar juego";
      mostrarToast("error", mensaje);
      throw err;
    }
  };

  const actualizarJuego = async (datosJuego: Juego) => {
    const juegoOriginal = juegos.find((item) => item.id === datosJuego.id);

    if (juegoOriginal) {
      if (limiteFavoritos > 0) {
        const favoritosSinActual = juegos.filter(
          (item) => item.id !== datosJuego.id && esFavorito(item)
        );

        const seraFavorito = esFavorito(datosJuego);
        const eraFavorito = esFavorito(juegoOriginal);

        if (
          !eraFavorito &&
          seraFavorito &&
          favoritosSinActual.length >= limiteFavoritos
        ) {
          const mensaje = obtenerMensajeLimite("favoritos", limiteFavoritos);
          mostrarToast("warning", mensaje);
          throw new Error(mensaje);
        }
      }

      if (limitePendientes > 0) {
        const pendientesSinActual = juegos.filter(
          (item) => item.id !== datosJuego.id && esPendiente(item)
        );

        const seraPendiente = esPendiente(datosJuego);
        const eraPendiente = esPendiente(juegoOriginal);

        if (
          !eraPendiente &&
          seraPendiente &&
          pendientesSinActual.length >= limitePendientes
        ) {
          const mensaje = obtenerMensajeLimite("pendientes", limitePendientes);
          mostrarToast("warning", mensaje);
          throw new Error(mensaje);
        }
      }
    }

    try {
      const juegoActualizado = await api.updateJuego(datosJuego.id, datosJuego);
      setJuegos((prev) =>
        prev.map((juego) =>
          juego.id === datosJuego.id ? juegoActualizado : juego
        )
      );
      mostrarToast("success", "Juego actualizado exitosamente");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al actualizar juego";
      mostrarToast("error", mensaje);
      throw err;
    }
  };

  const eliminarJuego = async (id: string) => {
    try {
      await api.deleteJuego(id);
      setJuegos((prev) => prev.filter((juego) => juego.id !== id));
      mostrarToast("success", "Juego eliminado exitosamente");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al eliminar juego";
      mostrarToast("error", mensaje);
      throw err;
    }
  };

  return {
    juegos,
    cargando,
    error,
    agregarJuego,
    actualizarJuego,
    eliminarJuego,
    refrescarJuegos: cargarJuegos,
  };
};
