import { forwardRef, type LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Label.module.css";

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => (
  <label ref={ref} className={cn(styles.label, className)} {...props}>
    {children}
  </label>
));

Label.displayName = "Label";

export { Label };
