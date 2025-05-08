import { type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        size !== 'medium' && styles[size],
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled,
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        children
      )}
    </button>
  );
}; 