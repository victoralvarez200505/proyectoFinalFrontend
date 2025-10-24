import { useState, useEffect } from "react";

import type { Juego } from "@/tipos/juego";
import { GENEROS } from "@/lib/generos";
import { Button } from "@/components/ui/general/boton";
import { Input } from "@/components/ui/general/input";
import { Label } from "@/components/ui/general/label";
import { Textarea } from "@/components/ui/general/textarea";
import { Select } from "@/components/ui/general/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/general/dialog";
import { Switch } from "@/components/ui/general/switch";
import { Badge } from "@/components/ui/general/badge";
import styles from "@/styles/components/GameForm.module.css";

interface GameFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (juego: Omit<Juego, "id"> & { id?: string }) => void;
  editingGame?: Juego | null;
}

const formateadorFechaHora = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

const crearEstadoInicial = () => ({
  nombre: "",
  año: new Date().getFullYear(),
  genero: "",
  plataforma: "",
  tienda: "",
  imagen: "",
  sinopsis: "",
  desarrollador: "",
  completado: false,
});

export const GameForm = ({
  open,
  onOpenChange,
  onSave,
  editingGame,
}: GameFormProps) => {
  const [formData, setFormData] = useState(crearEstadoInicial);

  useEffect(() => {
    if (editingGame) {
      setFormData({
        nombre: editingGame.nombre,
        año: editingGame.año,
        genero: editingGame.genero,
        plataforma: editingGame.plataforma,
        tienda: editingGame.tienda ?? "",
        imagen: editingGame.imagen,
        sinopsis: editingGame.sinopsis,
        desarrollador: editingGame.desarrollador ?? "",
        completado: Boolean(editingGame.completado),
      });
    } else {
      setFormData(crearEstadoInicial());
    }
  }, [editingGame, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...formData,
      tienda: formData.tienda.trim(),
      desarrollador: formData.desarrollador.trim(),
      sinopsis: formData.sinopsis.trim(),
    };

    onSave(editingGame ? { ...payload, id: editingGame.id } : payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle className={styles.title}>
            {editingGame ? "Editar juego" : "Agregar nuevo juego"}
          </DialogTitle>
          <DialogDescription className={styles.description}>
            Completa los detalles para sumar un juego a tu biblioteca
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="nombre">Nombre del juego</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, nombre: event.target.value }))
              }
              placeholder="Ej: The Last of Us"
              required
            />
          </div>

          <div className={`${styles.fieldGrid} ${styles.fieldGridTwo}`}>
            <div className={styles.field}>
              <Label htmlFor="año">Año de lanzamiento</Label>
              <Input
                id="año"
                type="number"
                min="1970"
                max={new Date().getFullYear() + 5}
                value={formData.año}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    año: Number.parseInt(event.target.value, 10) || prev.año,
                  }))
                }
                required
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="genero">Género</Label>
              <Select
                id="genero"
                value={formData.genero}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    genero: event.target.value,
                  }))
                }
                placeholder="Selecciona un género"
                required
              >
                <option value="" disabled>
                  Selecciona un género
                </option>
                {GENEROS.map((genero) => (
                  <option key={genero} value={genero}>
                    {genero}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className={`${styles.fieldGrid} ${styles.fieldGridTwo}`}>
            <div className={styles.field}>
              <Label htmlFor="plataforma">Plataforma</Label>
              <Input
                id="plataforma"
                value={formData.plataforma}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    plataforma: event.target.value,
                  }))
                }
                placeholder="Ej: PlayStation 5, PC, Xbox Series X"
                required
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="tienda">Tienda</Label>
              <Input
                id="tienda"
                value={formData.tienda}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    tienda: event.target.value,
                  }))
                }
                placeholder="Ej: Steam, PlayStation Store, Epic Games"
              />
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="desarrollador">Desarrollador</Label>
            <Input
              id="desarrollador"
              value={formData.desarrollador}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  desarrollador: event.target.value,
                }))
              }
              placeholder="Ej: Naughty Dog, FromSoftware"
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="imagen">URL de la imagen</Label>
            <Input
              id="imagen"
              type="url"
              value={formData.imagen}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, imagen: event.target.value }))
              }
              placeholder="https://ejemplo.com/portada.jpg"
            />
            {formData.imagen ? (
              <div className={styles.preview}>
                <img
                  src={formData.imagen}
                  alt="Preview"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800";
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="sinopsis">Sinopsis</Label>
            <Textarea
              id="sinopsis"
              value={formData.sinopsis}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  sinopsis: event.target.value,
                }))
              }
              placeholder="Resume la historia o premisa principal del juego..."
              rows={4}
              required
            />
          </div>

          <div className={styles.switchRow}>
            <div className={styles.switchCopy}>
              <Label htmlFor="completado">Juego completado</Label>
              <p>Marca esta opción cuando hayas terminado el juego.</p>
            </div>
            <Switch
              id="completado"
              checked={formData.completado}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, completado: checked }))
              }
            />
          </div>

          {editingGame?.fechaCreacion ? (
            <div className={styles.metaInfo}>
              <Badge variant="secondary">Registrado</Badge>
              <span>
                {(() => {
                  const fecha = new Date(editingGame.fechaCreacion ?? "");
                  return Number.isNaN(fecha.getTime())
                    ? "Fecha desconocida"
                    : formateadorFechaHora.format(fecha);
                })()}
              </span>
            </div>
          ) : null}

          <div className={styles.footer}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className={styles.primaryAction}>
              {editingGame ? "Actualizar" : "Agregar"} juego
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
