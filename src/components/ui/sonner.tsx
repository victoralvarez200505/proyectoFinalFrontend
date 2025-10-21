import { Toaster as Sonner } from "sonner";
import styles from "@/styles/ui/Sonner.module.css";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ theme = "dark", ...props }: ToasterProps) => (
  <Sonner
    theme={theme}
    className={styles.toaster}
    toastOptions={{
      classNames: {
        toast: styles.toast,
        description: styles.description,
        actionButton: styles.actionButton,
        cancelButton: styles.cancelButton,
      },
    }}
    {...props}
  />
);

export default Toaster;
