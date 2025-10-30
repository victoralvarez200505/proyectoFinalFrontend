import React from "react";
import styles from "@/styles/components/CardBase.module.css";

export interface CardBaseProps {
  image?: string;
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  description?: React.ReactNode;
  infoList?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

/**
 * Componente base reutilizable para tarjetas visuales.
 * Permite personalizar imagen, título, subtítulo, badges, descripción, info extra y acciones.
 */
export const CardBase: React.FC<CardBaseProps> = ({
  image,
  title,
  subtitle,
  badges,
  description,
  infoList,
  actions,
  className = "",
  bodyClassName = "",
  children,
}) => (
  <div className={`${styles["card-base"]} ${className}`.trim()}>
    {image && (
      <div className={styles["card-base__media"]}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className={styles["card-base__image"]}
        />
      </div>
    )}
    <div className={`${styles["card-base__body"]} ${bodyClassName}`.trim()}>
      <div className={styles["card-base__header"]}>
        <h3 className={styles["card-base__title"]} title={title}>
          {title}
        </h3>
        {subtitle && (
          <p className={styles["card-base__subtitle"]}>{subtitle}</p>
        )}
        {badges && <div className={styles["card-base__badges"]}>{badges}</div>}
      </div>
      {description && (
        <div className={styles["card-base__description"]}>{description}</div>
      )}
      {infoList && <div className={styles["card-base__info"]}>{infoList}</div>}
      {children}
      {actions && <div className={styles["card-base__actions"]}>{actions}</div>}
    </div>
  </div>
);
