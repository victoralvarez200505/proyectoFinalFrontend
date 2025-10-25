import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/general/input";
import { Button } from "@/components/ui/general/boton";
import { cn } from "@/lib/utils";
import styles from "@/styles/pages/Resenias.module.css";
import type { ChangeEvent, FC } from "react";

interface BarraBusquedaProps {
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  className?: string;
}

export const BarraBusqueda: FC<BarraBusquedaProps> = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}) => {
  return (
    <div
      className={cn(styles.envolturaBusqueda, className)}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
      tabIndex={-1}
    >
      <Search className={styles.iconoBusqueda} size={16} aria-hidden="true" />
      <Input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={styles.entradaBusqueda}
        aria-label="Buscar"
        style={{ paddingRight: value ? "2.2rem" : undefined }}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className={styles.botonFiltro + " " + styles.botonLimpiarBusqueda}
          aria-label="Limpiar búsqueda"
          style={{
            position: "absolute",
            right: "0.3rem",
            top: "50%",
            transform: "translateY(-50%)",
            padding: 0,
            width: "1.8rem",
            height: "1.8rem",
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 0.18s",
          }}
        >
          <XCircle size={16} />
        </Button>
      )}
      <style>{`
        .${styles.envolturaBusqueda}:hover .${styles.botonLimpiarBusqueda},
        .${styles.envolturaBusqueda}:focus-within .${styles.botonLimpiarBusqueda} {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
};
