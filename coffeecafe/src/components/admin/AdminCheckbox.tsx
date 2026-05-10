/*
  AdminCheckbox - кастомный чекбокс админки.
  Визуально совпадает с чекбоксом формы Контакты: тот же SVG в двух
  состояниях (default-chckbox-vector / selected-vector).
  Сам <input> скрыт через sr-only - фокус и клавиатура работают, поверх
  рисуем иконку. Размер 20×20 (между мобильным и десктопным контактным).
*/

import type { ReactNode } from 'react'
import defaultIcon from '../../assets/images/default-chckbox-vector.svg'
import selectedIcon from '../../assets/images/selected-vector.svg'

interface AdminCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  disabled?: boolean
  /** Дополнительные классы на label-обёртку (нужно для sm:mt-8 в строке с инпутами). */
  className?: string
}

function AdminCheckbox({ checked, onChange, label, disabled, className = '' }: AdminCheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2 text-cream cursor-pointer select-none ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      <span className="relative inline-flex h-5 w-5 shrink-0 rounded-sm transition-opacity hover:opacity-90">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only outline-none focus:outline-none focus-visible:outline-none"
        />
        <img
          src={checked ? selectedIcon : defaultIcon}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          aria-hidden
        />
      </span>
      <span>{label}</span>
    </label>
  )
}

export default AdminCheckbox
