import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Alertas.module.css"; // Cambiar más tarde || A lo mejor no.

type VarianteAlerta = "base" | "peligro";

interface PropiedadesAlerta extends HTMLAttributes<HTMLDivElement> {
  variante?: VarianteAlerta;
  variant?: VarianteAlerta | "default" | "destructive"; // Compatibilidad con versiones anteriores
}

const Alerta = forwardRef<HTMLDivElement, PropiedadesAlerta>(
  ({ className, variante, variant, ...props }, ref) => {
    const varianteNormalizada = (() => {
      const valor = variante ?? variant ?? "base";
      if (valor === "default") return "base" as VarianteAlerta;
      if (valor === "destructive") return "peligro" as VarianteAlerta;
      return valor as VarianteAlerta;
    })();

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(styles.alerta, className)}
        data-variant={varianteNormalizada}
        {...props}
      />
    );
  }
);

Alerta.displayName = "Alerta";

const TituloAlerta = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn(styles.tituloAlerta, className)} {...props} />
));

TituloAlerta.displayName = "TituloAlerta";

const DescripcionAlerta = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.descripcionAlerta, className)} {...props} />
));

DescripcionAlerta.displayName = "DescripcionAlerta";

const Alert = Alerta;
const AlertTitle = TituloAlerta;
const AlertDescription = DescripcionAlerta;

export {
  Alerta,
  TituloAlerta,
  DescripcionAlerta,
  Alert,
  AlertTitle,
  AlertDescription,
};
