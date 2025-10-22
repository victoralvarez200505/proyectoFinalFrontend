import { useEffect, useState } from "react";
import type { Juego } from "@/tipos/juego";
import { toast } from "sonner";
import * as api from "@/services/api";
import { bibliotecaConfig } from "@/config";

export const useGameStore = () => {
  const usarPredeterminados =
    bibliotecaConfig.habilitarJuegosPredeterminados &&
    bibliotecaConfig.juegos.length > 0;

  const [juegos, setJuegos] = useState<Juego[]>(
    usarPredeterminados ? bibliotecaConfig.juegos : []
  );
  const [cargando, setCargando] = useState(!usarPredeterminados);
  const [error, setError] = useState<string | null>(null);

  const cargarJuegos = async () => {
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
        toast.warning(
          `${mensaje}. Se mostrarán los juegos definidos en el archivo de configuración.`
        );
      } else {
        toast.error(mensaje);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarJuegos();
  }, []);

  const agregarJuego = async (datosJuego: Omit<Juego, "id">) => {
    try {
      const juegoNuevo = await api.createJuego(datosJuego);
      setJuegos((prev) => [...prev, juegoNuevo]);
      toast.success("Juego agregado exitosamente");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al agregar juego";
      toast.error(mensaje);
      throw err;
    }
  };

  const actualizarJuego = async (datosJuego: Juego) => {
    try {
      const juegoActualizado = await api.updateJuego(datosJuego.id, datosJuego);
      setJuegos((prev) =>
        prev.map((juego) =>
          juego.id === datosJuego.id ? juegoActualizado : juego
        )
      );
      toast.success("Juego actualizado exitosamente");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al actualizar juego";
      toast.error(mensaje);
      throw err;
    }
  };

  const eliminarJuego = async (id: string) => {
    try {
      await api.deleteJuego(id);
      setJuegos((prev) => prev.filter((juego) => juego.id !== id));
      toast.success("Juego eliminado exitosamente");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error al eliminar juego";
      toast.error(mensaje);
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
