import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import styles from "@/styles/ui/Select.module.css";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, children, placeholder, value, defaultValue, ...props },
    ref
  ) => {
    const currentValue = value ?? defaultValue ?? "";
    const shouldHidePlaceholder = currentValue !== "";

    return (
      <div className={styles.selectWrapper}>
        <select
          ref={ref}
          className={cn(styles.select, className)}
          value={value}
          defaultValue={defaultValue}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden={shouldHidePlaceholder}>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
