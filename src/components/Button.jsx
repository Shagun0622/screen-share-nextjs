'use client'

import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <button
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        isDisabled ? styles.disabled : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon ? (
        <span className={styles.icon} aria-hidden="true">{icon}</span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </button>
  )
}
