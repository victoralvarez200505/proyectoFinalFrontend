import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";

import { CardBase } from "@/components/ui/general/CardBase";
import styles from "@/styles/components/GenreCard.module.css";

interface GenreCardProps {
  genero: string;
  icono: LucideIcon;
  total: number;
}

export const GenreCard = ({ genero, icono: Icono, total }: GenreCardProps) => {
  const destino = `/genero/${genero.toLowerCase()}`;
  return (
    <Link to={destino} aria-label={`Abrir vista del género ${genero}`}>
      <CardBase
        title={genero}
        badges={
          <span className={styles.iconWrapper}>
            <Icono className={styles.icon} aria-hidden="true" />
          </span>
        }
        description={
          <p className={styles.count}>
            {total} {total === 1 ? "juego" : "juegos"}
          </p>
        }
        className={styles.card}
      >
        <div className={styles.gradient} />
      </CardBase>
    </Link>
  );
};
