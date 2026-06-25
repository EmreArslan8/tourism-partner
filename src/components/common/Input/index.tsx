import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./styles";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...props }, ref) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={ref}
        className={cn(
          styles.input,
          error && styles.error,
          className
        )}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
