import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Badge.module.css";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(styles.badge, className)}
      data-variant={variant}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export { Badge };
