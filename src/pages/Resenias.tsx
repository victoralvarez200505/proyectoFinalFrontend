import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Loader2, Pencil, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import styles from "@/styles/pages/Resenias.module.css";
import { useGameStore } from "@/hooks/useGameStore";
import type { Juego } from "@/tipos/juego";
import {
  createResenia,
  deleteResenia,
  getJuego,
  getReseniasPorJuego,
  updateResenia,
  type Resenia,
  type ReseniaPayload,
} from "@/services/api";
import { Button } from "@/components/ui/general/boton";
import { Badge } from "@/components/ui/general/badge";
import { GameCard } from "@/components/Inicio/GameCard";
import { Input } from "@/components/ui/general/input";
import { Select } from "@/components/ui/general/select";
import { Switch } from "@/components/ui/general/switch";
import { Textarea } from "@/components/ui/general/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/general/dialog";
import { cn } from "@/lib/utils";

const dificultades = [
  "Muy fácil",
  "Fácil",
  "Normal",
  "Difícil",
  "Muy difícil",
] as const;

type FormState = {
  puntuacion: number | null;
  texto: string;
  horasJugadas: string;
  dificultad: string;
  recomendaria: boolean;
};

const crearEstadoInicial = (): FormState => ({
  puntuacion: 3,
  texto: "",
  horasJugadas: "",
  dificultad: "Normal",
  recomendaria: true,
});

const formatoFecha = (valor: string | null | undefined): string => {
  if (!valor) {
    return "—";
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "—";
  }

  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
};

const normalizarBusqueda = (valor: string) => valor.trim().toLowerCase();

const Resenias = () => {
  const { id } = useParams<{ id: string }>();
  const {
    juegos,
    cargando: cargandoJuegos,
    error: errorJuegos,
  } = useGameStore();

  const [juegoActual, setJuegoActual] = useState<Juego | null>(null);
  const [errorJuego, setErrorJuego] = useState<string | null>(null);
  const [haBuscadoJuego, setHaBuscadoJuego] = useState(false);

  const [cargandoResenias, setCargandoResenias] = useState(false);
  const [resenias, setResenias] = useState<Resenia[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [reseniaEditando, setReseniaEditando] = useState<Resenia | null>(null);
  const [formData, setFormData] = useState<FormState>(crearEstadoInicial);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setHaBuscadoJuego(false);
    setJuegoActual(null);
    setErrorJuego(null);
    setResenias([]);
    setReseniaEditando(null);
    setFormData(crearEstadoInicial());
    setTerminoBusqueda("");
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const juegoEnCache = juegos.find((item) => item.id === id);

    if (juegoEnCache) {
      setJuegoActual(juegoEnCache);
      setErrorJuego(null);
      return;
    }

    if (cargandoJuegos || haBuscadoJuego) {
      return;
    }

    setHaBuscadoJuego(true);

    void (async () => {
      try {
        const juego = await getJuego(id);
        setJuegoActual(juego);
        setErrorJuego(null);
      } catch (error) {
        const mensaje =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la información del juego";
        setErrorJuego(mensaje);
      }
    })();
  }, [id, juegos, cargandoJuegos, haBuscadoJuego]);

  useEffect(() => {
    if (!juegoActual) {
      return;
    }

    let activo = true;
    setCargandoResenias(true);

    void (async () => {
      try {
        const datos = await getReseniasPorJuego(juegoActual.id);
        if (!activo) {
          return;
        }
        setResenias(datos);
      } catch (error) {
        if (!activo) {
          return;
        }
        const mensaje =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las reseñas";
        toast.error(mensaje);
      } finally {
        if (activo) {
          setCargandoResenias(false);
        }
      }
    })();

    return () => {
      activo = false;
      setCargandoResenias(false);
    };
  }, [juegoActual]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const coincidencia = juegos.find((item) => item.id === id);
    if (coincidencia) {
      setJuegoActual(coincidencia);
    }
  }, [id, juegos]);

  const enlaceRetorno = juegoActual
    ? `/genero/${encodeURIComponent(juegoActual.genero)}`
    : "/";

  const hayBusquedaActiva = terminoBusqueda.trim() !== "";

  const reseniasOrdenadas = useMemo(() => {
    if (resenias.length === 0) {
      return [];
    }

    return [...resenias].sort((a, b) => {
      const fechaA = new Date(
        a.fechaActualizacion ?? a.fechaCreacion ?? 0
      ).getTime();
      const fechaB = new Date(
        b.fechaActualizacion ?? b.fechaCreacion ?? 0
      ).getTime();

      return (fechaB || 0) - (fechaA || 0);
    });
  }, [resenias]);

  const reseniasFiltradas = useMemo(() => {
    if (!hayBusquedaActiva) {
      return reseniasOrdenadas;
    }

    const termino = normalizarBusqueda(terminoBusqueda);

    return reseniasOrdenadas.filter((resenia) => {
      const comentario = normalizarBusqueda(resenia.texto ?? "");
      const dificultad = normalizarBusqueda(resenia.dificultad ?? "");
      const recomendacion = resenia.recomendaria
        ? "recomendado"
        : "no recomendado";
      const horas =
        resenia.horasJugadas !== null && resenia.horasJugadas !== undefined
          ? `${resenia.horasJugadas}`
          : "";

      return (
        comentario.includes(termino) ||
        dificultad.includes(termino) ||
        recomendacion.includes(termino) ||
        horas.includes(termino)
      );
    });
  }, [hayBusquedaActiva, reseniasOrdenadas, terminoBusqueda]);

  const promedioPuntuacion = useMemo(() => {
    if (resenias.length === 0) {
      return null;
    }

    const suma = resenias.reduce((total, resenia) => {
      return total + (resenia.puntuacion ?? 0);
    }, 0);

    const promedio = suma / resenias.length;
    return Number.isNaN(promedio) ? null : promedio.toFixed(1);
  }, [resenias]);

  const horasPromedio = useMemo(() => {
    const horas = resenias
      .map((resenia) => resenia.horasJugadas)
      .filter(
        (valor): valor is number => valor !== null && valor !== undefined
      );

    if (horas.length === 0) {
      return null;
    }

    const promedio =
      horas.reduce((total, valor) => total + valor, 0) / horas.length;
    return Math.round(promedio);
  }, [resenias]);

  const abrirFormulario = (resenia?: Resenia | null) => {
    if (resenia) {
      setReseniaEditando(resenia);
      setFormData({
        puntuacion: resenia.puntuacion,
        texto: resenia.texto,
        horasJugadas:
          resenia.horasJugadas === null || resenia.horasJugadas === undefined
            ? ""
            : String(resenia.horasJugadas),
        dificultad: resenia.dificultad,
        recomendaria: resenia.recomendaria,
      });
    } else {
      setReseniaEditando(null);
      setFormData(crearEstadoInicial());
    }

    setFormularioAbierto(true);
  };

  const manejarGuardar = async () => {
    if (!juegoActual) {
      toast.error("No se encontró el juego para asociar la reseña");
      return;
    }

    if (formData.puntuacion === null) {
      toast.error("Selecciona una puntuación entre 1 y 5 estrellas");
      return;
    }

    const comentario = formData.texto.trim();

    if (comentario === "") {
      toast.error("Agrega algunos detalles sobre tu experiencia");
      return;
    }

    if (comentario.length < 10) {
      toast.error("La reseña debe tener al menos 10 caracteres");
      return;
    }

    let horasNormalizadas: number | null = null;

    if (formData.horasJugadas.trim() !== "") {
      const numero = Number(formData.horasJugadas);

      if (Number.isNaN(numero) || numero < 0) {
        toast.error("Ingresa un número de horas válido (mayor o igual a 0)");
        return;
      }

      horasNormalizadas = numero;
    }

    const payload: ReseniaPayload = {
      juegoId: juegoActual.id,
      puntuacion: formData.puntuacion,
      texto: comentario,
      horasJugadas: horasNormalizadas,
      dificultad: formData.dificultad,
      recomendaria: formData.recomendaria,
    };

    setGuardando(true);

    try {
      if (reseniaEditando) {
        const actualizada = await updateResenia(reseniaEditando.id, payload);

        setResenias((prev) =>
          prev.map((resenia) =>
            resenia.id === reseniaEditando.id ? actualizada : resenia
          )
        );
        toast.success("Reseña actualizada correctamente");
      } else {
        const creada = await createResenia(payload);
        setResenias((prev) => [creada, ...prev]);
        toast.success("Reseña creada correctamente");
      }

      setFormularioAbierto(false);
      setReseniaEditando(null);
      setFormData(crearEstadoInicial());
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "No se pudo guardar la reseña";
      toast.error(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (resenia: Resenia | null) => {
    if (!resenia) {
      return;
    }

    const confirmado = window.confirm(
      "¿Seguro que deseas eliminar esta reseña?"
    );

    if (!confirmado) {
      return;
    }

    try {
      await deleteResenia(resenia.id);
      setResenias((prev) =>
        prev.filter((registro) => registro.id !== resenia.id)
      );
      toast.success("Reseña eliminada");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la reseña";
      toast.error(mensaje);
    }
  };

  const manejarCambioFormulario = (
    campo: keyof FormState,
    valor: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const manejarCierreDialogo = (abierto: boolean) => {
    setFormularioAbierto(abierto);

    if (!abierto) {
      setReseniaEditando(null);
      setFormData(crearEstadoInicial());
      setGuardando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.layout}>
        {errorJuegos && (
          <div className={styles.bannerError}>
            <p>
              <strong>Error al cargar juegos</strong>
            </p>
            <p>{errorJuegos}</p>
          </div>
        )}

        {errorJuego && !juegoActual ? (
          <div className={styles.tarjetaError}>
            <h2>No se encontró el juego</h2>
            <p>{errorJuego}</p>
          </div>
        ) : !juegoActual ? (
          <div className={styles.estadoCargando}>
            <div className={styles.cargandoInterno}>
              <Loader2 className={styles.iconoCargando} aria-hidden="true" />
              <p>Cargando información del juego...</p>
            </div>
          </div>
        ) : (
          <div className={styles.rejillaPrincipal}>
            <section className={styles.panelPrincipal}>
              <div className={styles.superposicionPanel} />
              <div className={styles.contenidoPanel}>
                <div className={styles.cabeceraPanel}>
                  <div>
                    <div className={styles.migaPan}>
                      <Link to={enlaceRetorno}>
                        <Button
                          variant="outline"
                          size="icon"
                          className={styles.botonMigaPan}
                        >
                          <ArrowLeft
                            className={styles.iconoMigaPan}
                            aria-hidden="true"
                          />
                        </Button>
                      </Link>
                      <span>Reseñas</span>
                    </div>
                    <h1 className={styles.titulo}>{juegoActual.nombre}</h1>
                  </div>
                  <Button
                    onClick={() => abrirFormulario(null)}
                    className={styles.botonAgregar}
                  >
                    Agregar reseña
                  </Button>
                </div>

                <div className={styles.rejillaEstadisticas}>
                  <div className={styles.tarjetaEstadistica}>
                    <p className={styles.etiquetaEstadistica}>Reseñas</p>
                    <p className={styles.valorEstadistica}>{resenias.length}</p>
                  </div>
                  <div className={styles.tarjetaEstadistica}>
                    <p className={styles.etiquetaEstadistica}>Promedio</p>
                    <p className={styles.valorEstadistica}>
                      {promedioPuntuacion ?? "—"}
                    </p>
                  </div>
                  <div className={styles.tarjetaEstadistica}>
                    <p className={styles.etiquetaEstadistica}>Horas medias</p>
                    <p className={styles.valorEstadistica}>
                      {horasPromedio !== null ? `${horasPromedio}h` : "—"}
                    </p>
                  </div>
                </div>

                <div className={styles.tarjetaResenias}>
                  <div className={styles.cabeceraSeccion}>
                    <p className={styles.etiquetaSeccion}>Todas las reseñas</p>
                    {reseniasOrdenadas.length > 0 && (
                      <span className={styles.contadorSeccion}>
                        {hayBusquedaActiva
                          ? `${reseniasFiltradas.length} coincidencia${
                              reseniasFiltradas.length === 1 ? "" : "s"
                            } de ${reseniasOrdenadas.length}`
                          : `${reseniasOrdenadas.length} registro${
                              reseniasOrdenadas.length === 1 ? "" : "s"
                            }`}
                      </span>
                    )}
                  </div>

                  <div className={styles.filaFiltro}>
                    <div className={styles.envolturaBusqueda}>
                      <Search
                        className={styles.iconoBusqueda}
                        size={16}
                        aria-hidden="true"
                      />
                      <Input
                        value={terminoBusqueda}
                        onChange={(evento) =>
                          setTerminoBusqueda(evento.target.value)
                        }
                        placeholder="Buscar por comentario, dificultad, horas..."
                        className={styles.entradaBusqueda}
                        aria-label="Buscar reseñas"
                      />
                    </div>
                    {hayBusquedaActiva && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTerminoBusqueda("")}
                        className={styles.botonFiltro}
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>

                  {cargandoResenias ? (
                    <div className={styles.mensajeSeccion}>
                      Cargando reseñas...
                    </div>
                  ) : reseniasFiltradas.length === 0 ? (
                    <div className={styles.cajaMarcador}>
                      {hayBusquedaActiva
                        ? "No se encontraron reseñas que coincidan con tu búsqueda."
                        : 'Aún no hay reseñas registradas. Usa "Agregar reseña" para compartir la primera experiencia.'}
                    </div>
                  ) : (
                    <div className={styles.listaResenias}>
                      {reseniasFiltradas.map((resenia, indice) => {
                        const comentario = resenia.texto?.trim();

                        return (
                          <article
                            key={resenia.id}
                            className={styles.tarjetaResenia}
                          >
                            <div className={styles.cabeceraResenia}>
                              <div className={styles.metaResenia}>
                                <div className={styles.estrellasResenia}>
                                  {Array.from(
                                    { length: 5 },
                                    (_, estrella) => estrella + 1
                                  ).map((valor) => (
                                    <Star
                                      key={valor}
                                      className={cn(
                                        styles.iconoEstrellaPequena,
                                        valor <= (resenia.puntuacion ?? 0) &&
                                          styles.iconoEstrellaPequenaActiva
                                      )}
                                      aria-hidden="true"
                                    />
                                  ))}
                                </div>
                                <span className={styles.indiceResenia}>
                                  #{indice + 1}
                                </span>
                              </div>
                              <div className={styles.fechaResenia}>
                                {formatoFecha(
                                  resenia.fechaActualizacion ??
                                    resenia.fechaCreacion
                                )}
                              </div>
                            </div>

                            <p className={styles.contenidoResenia}>
                              {comentario && comentario.length > 0
                                ? comentario
                                : "Esta reseña no incluye comentario, pero sí aporta valoración y datos."}
                            </p>

                            <div className={styles.etiquetasResenia}>
                              <span className={styles.etiquetaResenia}>
                                {resenia.dificultad || "Sin dificultad"}
                              </span>
                              <span className={styles.etiquetaResenia}>
                                {resenia.horasJugadas !== null &&
                                resenia.horasJugadas !== undefined
                                  ? `${resenia.horasJugadas} h`
                                  : "Horas no registradas"}
                              </span>
                              <Badge
                                className={cn(
                                  styles.insigniaRecomendacion,
                                  resenia.recomendaria
                                    ? styles.recomendacionPositiva
                                    : styles.recomendacionNegativa
                                )}
                                variant="outline"
                              >
                                {resenia.recomendaria
                                  ? "Recomendado"
                                  : "No recomendado"}
                              </Badge>
                            </div>

                            <div className={styles.accionesResenia}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => abrirFormulario(resenia)}
                                className={styles.botonContorno}
                              >
                                <Pencil size={14} aria-hidden="true" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => manejarEliminar(resenia)}
                                className={styles.botonDestructivo}
                              >
                                <Trash2 size={14} aria-hidden="true" />
                                Eliminar
                              </Button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className={styles.barraLateral}>
              {juegoActual && <GameCard juego={juegoActual} />}
            </aside>
          </div>
        )}
      </div>

      <Dialog open={formularioAbierto} onOpenChange={manejarCierreDialogo}>
        <DialogContent className={styles.contenidoDialogo}>
          <DialogHeader>
            <DialogTitle>
              {reseniaEditando ? "Editar reseña" : "Crear reseña"}
            </DialogTitle>
            <DialogDescription className={styles.descripcionDialogo}>
              Comparte cómo fue tu experiencia con este juego. La comunidad usa
              estos datos para decidir si se anima a probarlo.
            </DialogDescription>
          </DialogHeader>

          <div className={styles.seccionDialogo}>
            <div>
              <p className={styles.etiquetaDialogo}>Puntuación</p>
              <div className={styles.estrellasDialogo}>
                {Array.from({ length: 5 }, (_, indice) => indice + 1).map(
                  (valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() =>
                        manejarCambioFormulario("puntuacion", valor)
                      }
                      className={cn(
                        styles.botonEstrellaDialogo,
                        formData.puntuacion !== null &&
                          valor <= formData.puntuacion &&
                          styles.botonEstrellaDialogoActiva
                      )}
                      aria-label={`Asignar puntuación de ${valor}`}
                    >
                      {valor} ★
                    </button>
                  )
                )}
              </div>
            </div>

            <div className={styles.campoDialogo}>
              <label className={styles.etiquetaDialogo} htmlFor="comentario">
                Comentario
              </label>
              <Textarea
                id="comentario"
                value={formData.texto}
                onChange={(evento) =>
                  manejarCambioFormulario("texto", evento.target.value)
                }
                placeholder="Describe tu experiencia, los puntos fuertes y lo que mejorarías"
                minLength={10}
                className={styles.areaTextoDialogo}
              />
            </div>

            <div className={styles.rejillaCampoDialogo}>
              <div className={styles.campoDialogo}>
                <label className={styles.etiquetaDialogo} htmlFor="horas">
                  Horas jugadas
                </label>
                <Input
                  id="horas"
                  value={formData.horasJugadas}
                  onChange={(evento) =>
                    manejarCambioFormulario("horasJugadas", evento.target.value)
                  }
                  placeholder="Ej. 25"
                  className={styles.entradaDialogo}
                  inputMode="numeric"
                />
              </div>
              <div className={styles.campoDialogo}>
                <label className={styles.etiquetaDialogo} htmlFor="dificultad">
                  Dificultad percibida
                </label>
                <Select
                  id="dificultad"
                  value={formData.dificultad}
                  onChange={(evento) =>
                    manejarCambioFormulario("dificultad", evento.target.value)
                  }
                  placeholder="Selecciona dificultad"
                  className={styles.seleccionDialogo}
                >
                  {dificultades.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className={styles.interruptorDialogo}>
              <div className={styles.informacionInterruptorDialogo}>
                <p className={styles.etiquetaDialogo}>¿Lo recomendarías?</p>
                <p>
                  Indica si consideras que otras personas deberían probarlo.
                </p>
              </div>
              <Switch
                checked={formData.recomendaria}
                onCheckedChange={(valor) =>
                  manejarCambioFormulario("recomendaria", valor)
                }
              />
            </div>

            <div className={styles.accionesDialogo}>
              <Button
                type="button"
                variant="outline"
                onClick={() => manejarCierreDialogo(false)}
                className={styles.cancelarDialogo}
                disabled={guardando}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={manejarGuardar}
                className={styles.confirmarDialogo}
                disabled={guardando}
              >
                {guardando ? (
                  <span className={styles.guardandoDialogo}>
                    <Loader2
                      className={styles.iconoGuardandoDialogo}
                      aria-hidden="true"
                    />{" "}
                    Guardando...
                  </span>
                ) : (
                  "Guardar reseña"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resenias;
