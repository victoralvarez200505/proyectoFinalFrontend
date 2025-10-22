import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import styles from "@/styles/components/GameCarousel.module.css";
import type { Juego } from "@/tipos/juego";

interface GameCarouselProps {
  games: Juego[];
  title?: string;
  subtitle?: string;
  onSelect?: (juego: Juego) => void;
}

export const GameCarousel = ({
  games,
  title = "Vistazo rápido a tu biblioteca",
  subtitle = "Recorre toda tu colección desde aquí",
  onSelect,
}: GameCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasGames = games.length > 0;

  const orderedGames = useMemo(() => {
    return [...games].sort((a, b) => {
      const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
      const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
      return fechaB - fechaA;
    });
  }, [games]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollRef.current;
      if (!container) {
        return;
      }

      const child = container.children[index] as HTMLElement | undefined;
      if (!child) {
        return;
      }

      const childRect = child.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = childRect.left - containerRect.left + container.scrollLeft;

      container.scrollTo({ left: offset, behavior });
    },
    []
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const updateScrollState = () => {
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) {
        setCurrentIndex(0);
        return;
      }

      const viewportLeft = container.scrollLeft;
      const epsilon = 4;

      const candidateIndex = children.findIndex((child) => {
        return child.offsetLeft >= viewportLeft - epsilon;
      });

      const nextIndex =
        candidateIndex === -1 ? children.length - 1 : candidateIndex;
      setCurrentIndex(nextIndex);
    };

    updateScrollState();

    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [orderedGames.length]);

  useEffect(() => {
    if (orderedGames.length === 0) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => {
      const nextIndex = Math.min(prev, orderedGames.length - 1);
      requestAnimationFrame(() => scrollToIndex(nextIndex, "auto"));
      return nextIndex;
    });
  }, [orderedGames.length, scrollToIndex]);

  useEffect(() => {
    if (orderedGames.length <= 1 || isHovered || isFocused) {
      return;
    }

    const intervalo = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % orderedGames.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 5000);

    return () => window.clearInterval(intervalo);
  }, [orderedGames.length, isHovered, isFocused, scrollToIndex]);

  const handleNavigate = (direction: "left" | "right") => {
    if (orderedGames.length <= 1) {
      return;
    }

    setCurrentIndex((prev) => {
      const nextIndex =
        direction === "left"
          ? (prev - 1 + orderedGames.length) % orderedGames.length
          : (prev + 1) % orderedGames.length;

      scrollToIndex(nextIndex);
      return nextIndex;
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (evento: FocusEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) {
      setIsFocused(false);
      return;
    }

    if (
      !evento.relatedTarget ||
      !container.contains(evento.relatedTarget as Node)
    ) {
      setIsFocused(false);
    }
  };

  if (!hasGames) {
    return null;
  }

  return (
    <section className={styles.carrusel} aria-label="Carrusel de juegos">
      <div className={styles.encabezado}>
        <div className={styles.grupoTitulos}>
          <span className={styles.iconoEncabezado}>
            <Sparkles size={20} strokeWidth={1.5} />
          </span>
          <div>
            <h3 className={styles.titulo}>{title}</h3>
            {subtitle ? <p className={styles.subtitulo}>{subtitle}</p> : null}
          </div>
        </div>
        <div className={styles.controles}>
          <button
            type="button"
            className={styles.botonControl}
            aria-label="Desplazar carrusel a la izquierda"
            onClick={() => handleNavigate("left")}
            disabled={orderedGames.length <= 1}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.botonControl}
            aria-label="Desplazar carrusel a la derecha"
            onClick={() => handleNavigate("right")}
            disabled={orderedGames.length <= 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        className={styles.contenedorVisor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.degradadoIzquierda} aria-hidden="true" />
        <div className={styles.degradadoDerecha} aria-hidden="true" />
        <div
          ref={scrollRef}
          className={styles.visor}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {orderedGames.map((game, index) => {
            const tieneImagen = Boolean(game.imagen);
            const inicial = game.nombre.charAt(0).toUpperCase();
            const completado = Boolean(game.completado);
            const isActive = index === currentIndex;

            const handleClick = () => {
              setCurrentIndex(index);
              if (onSelect) {
                onSelect(game);
              }
            };

            const handleKeyDown = (evento: KeyboardEvent<HTMLElement>) => {
              if (!onSelect) {
                return;
              }

              if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                setCurrentIndex(index);
                onSelect(game);
              }
            };

            return (
              <article
                key={game.id}
                className={styles.tarjeta}
                data-active={isActive ? "true" : undefined}
                role={onSelect ? "button" : undefined}
                tabIndex={onSelect ? 0 : undefined}
                onClick={onSelect ? handleClick : undefined}
                onKeyDown={onSelect ? handleKeyDown : undefined}
              >
                <div className={styles.portada}>
                  {tieneImagen ? (
                    <img
                      src={game.imagen}
                      alt={`Portada de ${game.nombre}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.marcador} aria-hidden="true">
                      {inicial}
                    </div>
                  )}
                </div>

                <div className={styles.cuerpoTarjeta}>
                  <div className={styles.encabezadoTarjeta}>
                    <h4 className={styles.tituloTarjeta}>{game.nombre}</h4>
                    {completado ? (
                      <span className={styles.insigniaCompletado}>
                        Completado
                      </span>
                    ) : null}
                  </div>
                  <p className={styles.datosTarjeta}>
                    <span>{game.genero}</span>
                    {game.plataforma ? <span>{game.plataforma}</span> : null}
                    {game.año ? <span>{game.año}</span> : null}
                  </p>
                  {game.desarrollador ? (
                    <p className={styles.desarrolladorTarjeta}>
                      Desarrollado por {game.desarrollador}
                    </p>
                  ) : null}
                  {game.sinopsis ? (
                    <p className={styles.descripcionTarjeta}>{game.sinopsis}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
