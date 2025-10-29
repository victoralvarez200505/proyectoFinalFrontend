import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  Monitor,
  CheckCircle2,
  MessageSquareHeart,
  Building2,
  CalendarClock,
  Store,
  Tag,
} from "lucide-react";
import type { Juego } from "@/types/juego";
import { CardBase } from "@/components/ui/general/CardBase";
import { Button } from "@/components/ui/general/boton";
import { Badge } from "@/components/ui/general/badge";
import { cn } from "@/lib/utils";
import styles from "@/styles/components/GameCard.module.css";

const formateadorFecha = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
});

interface GameCardProps {
  juego: Juego;
  onEdit?: (juego: Juego) => void;
  onDelete?: (id: string) => void;
  onManageReviews?: (juego: Juego) => void;
}

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
  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] =
    useState(false);
  const descripcionTieneMasContenido = descripcion.length > 300;

  useEffect(() => {
    setMostrarDescripcionCompleta(false);
  }, [juego.id]);

  const infoBase = [
    {
      etiqueta: "Estado",
      valor: estadoJuego,
      icono: CheckCircle2,
    },
    {
      etiqueta: "Género",
      valor: genero,
      icono: Tag,
    },
    {
      etiqueta: "Plataforma",
      valor: plataforma,
      icono: Monitor,
    },
    {
      etiqueta: "Tienda",
      valor: tienda,
      icono: Store,
    },
    {
      etiqueta: "Desarrollador",
      valor: desarrollador,
      icono: Building2,
    },
    {
      etiqueta: "Lanzamiento",
      valor: lanzamiento,
      icono: Calendar,
    },
    {
      etiqueta: "Agregado",
      valor: fechaAgregado,
      icono: CalendarClock,
    },
  ];

  const infoFiltrada = infoBase.filter((item) => item.valor !== "—");
  const descripcionId = `descripcion-${juego.id}`;
  const tieneAcciones = Boolean(onManageReviews || onEdit || onDelete);

  return (
    <CardBase
      image={
        juego.imagen ||
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800"
      }
      title={juego.nombre}
      subtitle={desarrollador !== "—" ? desarrollador : undefined}
      badges={null}
      className={styles.card}
      bodyClassName={styles.body}
    >
      <div className={styles.content}>
        <div className={styles.titleSection}>
          {/* El título y subtítulo ya están en CardBase, pero mantenemos la estructura para el grid */}
        </div>
        <div className={styles.badgeRow}>
          {(juego.completado || genero !== "—") && (
            <>
              {juego.completado && (
                <Badge variant="outline" className={styles.badgeCompleted}>
                  <CheckCircle2 size={14} aria-hidden="true" /> Completado
                </Badge>
              )}
              {genero !== "—" && (
                <Badge variant="outline" className={styles.badgeGenre}>
                  {genero}
                </Badge>
              )}
            </>
          )}
        </div>
        <div className={styles.descriptionSection}>
          <p
            className={cn(
              styles.description,
              mostrarDescripcionCompleta && styles.descriptionExpanded
            )}
            id={descripcionId}
          >
            {descripcion}
          </p>
          {descripcionTieneMasContenido ? (
            <button
              type="button"
              className={styles.toggleDescription}
              onClick={() => setMostrarDescripcionCompleta((prev) => !prev)}
              aria-expanded={mostrarDescripcionCompleta ? "true" : "false"}
              aria-controls={descripcionId}
            >
              {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
            </button>
          ) : null}
        </div>
        <dl className={styles.infoList}>
          {infoFiltrada.map(({ etiqueta, valor, icono: Icono }) => (
            <div key={etiqueta} className={styles.infoItem}>
              <dt className={styles.infoLabel}>{etiqueta}</dt>
              <dd className={styles.infoValue}>
                <Icono
                  size={14}
                  className={styles.infoIcon}
                  aria-hidden="true"
                />
                <span>{valor}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {tieneAcciones && (
        <div className={styles.footer}>
          <div className={styles.divider} />
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
      )}
    </CardBase>
  );
};
