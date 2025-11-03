import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconoTemaProps {
  onClick?: () => void;
  className?: string;
  title?: string;
}

export const IconoTema = ({ onClick, className, title }: IconoTemaProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("icono-tema-boton", className)}
    title={title || "Cambiar tema"}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
  >
    <Palette size={22} />
  </button>
);
