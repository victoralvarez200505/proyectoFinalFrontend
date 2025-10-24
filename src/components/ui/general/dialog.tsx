import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Dialog.module.css";

interface DialogContextValue {
  open: boolean;
  close: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const close = useCallback(() => onOpenChange?.(false), [onOpenChange]);

  const value = useMemo<DialogContextValue>(
    () => ({ open, close }),
    [open, close]
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
};

type DialogContentProps = ComponentPropsWithoutRef<"div"> & {
  onDismiss?: () => void;
  showCloseButton?: boolean;
};

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, onDismiss, showCloseButton = true, ...props },
    ref
  ) => {
    const { open, close } = useDialogContext();
    const handleClose = useCallback(() => {
      if (onDismiss) onDismiss();
      close();
    }, [close, onDismiss]);

    useEffect(() => {
      if (!open) return;
      const handler = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          handleClose();
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [open, handleClose]);

    if (!open) return null;

    return createPortal(
      <>
        <div className={styles.overlay} onClick={handleClose} />
        <div className={styles.contentWrapper}>
          <div ref={ref} className={cn(styles.content, className)} {...props}>
            {showCloseButton ? (
              <button
                type="button"
                aria-label="Cerrar"
                onClick={handleClose}
                className={styles.closeButton}
              >
                <X size={18} />
              </button>
            ) : null}
            {children}
          </div>
        </div>
      </>,
      document.body
    );
  }
);

DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => (
  <div className={cn(styles.header, className)} {...props} />
);

const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<"h3">
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn(styles.title, className)} {...props} />
));

DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props} />
));

DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
