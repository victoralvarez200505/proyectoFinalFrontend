import { forwardRef, type ComponentProps } from "react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Input.module.css";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(styles.input, className)}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
