import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';
import classNames from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, disabled, ...rest }, ref) => {
    return (
      <div className={styles.formGroup}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            styles.input,
            error && styles.inputError,
            disabled && styles.disabled,
            className
          )}
          disabled={disabled}
          {...rest}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
); 