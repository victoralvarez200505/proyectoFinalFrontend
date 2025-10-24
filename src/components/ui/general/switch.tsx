import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Switch.module.css";

interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, className, ...props }, ref) => {
    const handleClick = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-checked={checked ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(styles.switch, className)}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <span className={styles.thumb} />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
