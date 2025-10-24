import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/general/card";
import styles from "@/styles/components/GenreCard.module.css";

interface GenreCardProps {
  genero: string;
  icono: LucideIcon;
  total: number;
}

export const GenreCard = ({ genero, icono: Icono, total }: GenreCardProps) => {
  const destino = `/genero/${genero.toLowerCase()}`;
  return (
    <Link to={destino}>
      <Card className={styles.card}>
        <div className={styles.gradient} />
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <Icono className={styles.icon} />
          </div>
          <div>
            <h3 className={styles.title}>{genero}</h3>
            <p className={styles.count}>
              {total} {total === 1 ? "juego" : "juegos"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
