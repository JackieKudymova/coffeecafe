import type { SelectHTMLAttributes } from 'react'
import { adminSelectClassName } from './adminFieldStyles'

type Props = {
  label: string
  error?: boolean
} & SelectHTMLAttributes<HTMLSelectElement>

export default function AdminSelect({ label, error, className, children, ...rest }: Props) {
  return (
    <label className="block">
      <span className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${error ? 'text-input-border-error' : 'text-cream-dark'}`}>{label}</span>
      <select
        aria-invalid={error === true}
        className={`${adminSelectClassName} ${className ?? ''}`}
        {...rest}
      >
        {children}
      </select>
    </label>
  )
}
