import { Star, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/general/badge";
import { Button } from "@/components/ui/general/boton";
import { cn } from "@/lib/utils";
import styles from "@/styles/pages/Resenias.module.css";
import type { Resenia } from "@/services/api";

interface ReseniaCardProps {
  resenia: Resenia;
  indice: number;
  onEditar: (resenia: Resenia) => void;
  onEliminar: (resenia: Resenia) => void;
  formatoFecha: (fecha: string | null | undefined) => string;
}

export const ReseniaCard = ({
  resenia,
  indice,
  onEditar,
  onEliminar,
  formatoFecha,
}: ReseniaCardProps) => {
  const comentario = resenia.texto?.trim();
  return (
    <article className={styles.tarjetaResenia}>
      <div className={styles.cabeceraResenia}>
        <div className={styles.metaResenia}>
          <div className={styles.estrellasResenia}>
            {Array.from({ length: 5 }, (_, estrella) => estrella + 1).map(
              (valor) => (
                <Star
                  key={valor}
                  className={cn(
                    styles.iconoEstrellaPequena,
                    valor <= (resenia.puntuacion ?? 0) &&
                      styles.iconoEstrellaPequenaActiva
                  )}
                  aria-hidden="true"
                />
              )
            )}
          </div>
          <span className={styles.indiceResenia}>#{indice + 1}</span>
        </div>
        <div className={styles.fechaResenia}>
          {formatoFecha(resenia.fechaActualizacion ?? resenia.fechaCreacion)}
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
          {resenia.horasJugadas !== null && resenia.horasJugadas !== undefined
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
        >
          {resenia.recomendaria ? "Recomendado" : "No recomendado"}
        </Badge>
      </div>

      <div className={styles.accionesResenia}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditar(resenia)}
          className={styles.botonContorno}
        >
          <Pencil size={14} aria-hidden="true" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onEliminar(resenia)}
          className={styles.botonDestructivo}
        >
          <Trash2 size={14} aria-hidden="true" />
          Eliminar
        </Button>
      </div>
    </article>
  );
};
