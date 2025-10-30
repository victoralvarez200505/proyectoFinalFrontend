import { Pencil, Trash2, MessageSquareHeart } from "lucide-react";
import type { Juego } from "@/types/juego";
import { Button } from "@/components/ui/general/boton";
// import { Badge } from "@/components/ui/general/badge";
import { cn } from "@/lib/utils";
import styles from "@/styles/components/GameCard.module.css";
import * as Tooltip from "@radix-ui/react-tooltip";

const formateadorFecha = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
});

type GameCardProps = {
  juego: Juego;
  onEdit?: (juego: Juego) => void;
  onDelete?: (id: string) => void;
  onManageReviews?: (juego: Juego) => void;
};

export const GameCard = ({
  juego,
  onEdit,
  onDelete,
  onManageReviews,
}: GameCardProps) => {
  const fechaCreacionFormateada = (() => {
    if (!juego.fechaCreacion) return null;
    const fecha = new Date(juego.fechaCreacion);
    if (Number.isNaN(fecha.getTime())) {
      return null;
    }
    return formateadorFecha.format(fecha);
  })();
  const descripcion =
    juego.sinopsis && juego.sinopsis.trim() !== ""
      ? juego.sinopsis.trim()
      : "Sin sinopsis disponible.";
  const genero =
    juego.genero && juego.genero.trim() !== "" ? juego.genero : "—";
  const plataforma =
    juego.plataforma && juego.plataforma.trim() !== "" ? juego.plataforma : "—";
  const tienda =
    juego.tienda && juego.tienda.trim() !== "" ? juego.tienda : "—";
  const desarrollador =
    juego.desarrollador && juego.desarrollador.trim() !== ""
      ? juego.desarrollador
      : "—";
  const lanzamiento = juego.año ?? "—";
  const fechaAgregado = fechaCreacionFormateada ?? "—";
  const estadoJuego = juego.completado ? "Completado" : "En progreso";
  const descripcionLimite = 180;
  const descripcionTieneMasContenido = descripcion.length > descripcionLimite;

  const descripcionId = `descripcion-${juego.id}`;

  return (
    <div className={styles.card}>
      {/* Imagen */}
      <div className={styles.cardImage}>
        <img
          src={
            juego.imagen ||
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800"
          }
          alt={juego.nombre}
          className={styles.image}
        />
      </div>
      {/* Fila DEV y Género */}
      <div className={styles.rowDevGenero}>
        <div className={styles.devBox}>{desarrollador}</div>
        <div className={styles.generoBox}>{genero}</div>
      </div>
      {/* Sinopsis */}
      <div className={styles.sinopsisBox}>
        {descripcionTieneMasContenido ? (
          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <p
                className={styles.description}
                id={descripcionId}
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                {descripcion.slice(0, descripcionLimite)}
                <span
                  style={{ color: "var(--color-primario)", fontWeight: "bold" }}
                >
                  ...
                </span>
              </p>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="bottom"
              align="start"
              className={styles.tooltipContent}
              sideOffset={8}
            >
              {descripcion}
              <Tooltip.Arrow className={styles.tooltipArrow} />
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <p className={styles.description} id={descripcionId}>
            {descripcion}
          </p>
        )}
      </div>
      {/* Info principal */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCol}>
          <div className={styles.infoLabel}>Estado</div>
          <div className={styles.infoValue}>{estadoJuego}</div>
          <div className={styles.infoLabel}>Lanzamiento</div>
          <div className={styles.infoValue}>{lanzamiento}</div>
          <div className={styles.infoLabel}>Agregado</div>
          <div className={styles.infoValue}>{fechaAgregado}</div>
        </div>
        <div className={styles.infoCol}>
          <div className={styles.infoLabel}>Plataforma</div>
          <div className={styles.infoValue}>{plataforma}</div>
          <div className={styles.infoLabel}>Tienda</div>
          <div className={styles.infoValue}>{tienda}</div>
        </div>
      </div>
      {/* Botones */}
      <div className={styles.footer}>
        <div className={styles.actions}>
          {onManageReviews && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManageReviews(juego)}
              className={cn(styles.actionButton, styles.actionReviews)}
            >
              <MessageSquareHeart size={16} aria-hidden="true" />
              Reseñas
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(juego)}
              className={cn(styles.actionButton, styles.actionEdit)}
            >
              <Pencil size={16} aria-hidden="true" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(juego.id)}
              className={cn(styles.actionButton, styles.actionDelete)}
            >
              <Trash2 size={16} aria-hidden="true" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
