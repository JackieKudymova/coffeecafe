import type { TextareaHTMLAttributes } from 'react'
import { adminTextareaInnerClassName, adminTextareaShellClassName } from './adminFieldStyles'

type Props = {
  label: string
  error?: boolean
  shellClassName?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export default function AdminTextArea({ label, error, shellClassName, className, ...rest }: Props) {
  return (
    <div className="block">
      <span
        className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${error ? 'text-input-border-error' : 'text-cream-dark'}`}
      >
        {label}
      </span>
      <div className={`${adminTextareaShellClassName} ${shellClassName ?? ''}`}>
        <textarea
          aria-invalid={error === true}
          className={`${adminTextareaInnerClassName} ${className ?? ''}`}
          {...rest}
        />
      </div>
    </div>
  )
}
