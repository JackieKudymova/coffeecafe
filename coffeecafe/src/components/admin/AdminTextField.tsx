import type { InputHTMLAttributes } from 'react'
import { adminInputClassName } from './adminFieldStyles'

type Props = {
  label: string
  error?: boolean
  labelClassName?: string
  containerClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

export default function AdminTextField({
  label,
  error,
  labelClassName,
  containerClassName,
  className,
  ...rest
}: Props) {
  return (
    <label className={`block ${containerClassName ?? ''}`}>
      <span
        className={`block text-sm leading-[22px] ${error ? 'text-input-border-error' : 'text-cream-dark'} ${labelClassName ?? ''}`}
      >
        {label}
      </span>
      <input
        aria-invalid={error === true}
        className={`${adminInputClassName} ${className ?? ''}`}
        {...rest}
      />
    </label>
  )
}
