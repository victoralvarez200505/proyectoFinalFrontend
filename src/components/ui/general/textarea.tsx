import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Textarea.module.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(styles.textarea, className)} {...props} />
  )
);

Textarea.displayName = "Textarea";

export { Textarea };
