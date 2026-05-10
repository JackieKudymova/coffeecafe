/*
  AllergenFilter - фильтр аллергенов на странице «Меню».
  Три чекбокса: «Без молока», «Без глютена», «Без яиц».
  Иконки чекбокса (SVG) переиспользованы из формы обратной связи -
  это компонент UI-KIT/checkbox: квадрат с обводкой и галочкой при выборе.
  Размеры по макетам Figma:
    мобилка HF_phone_menu_1 (Group 1809):  иконка 16px, текст 14px Inter Regular,
    планшет Hf_ipad_menu (Frame 1808):     иконка 17px, текст 14px Inter Regular,
    десктоп HF_desktop_menu (Frame 1808):  иконка 19px, текст 16px Inter Regular.
  Между Vector и текстом - 8px, между чекбоксами - 16px.
*/

import type { Allergen } from '../types/menu'
import defaultCheckboxIcon from '../assets/images/default-chckbox-vector.svg'
import selectedCheckboxIcon from '../assets/images/selected-vector.svg'

const FILTERS: { key: Allergen; label: string }[] = [
  { key: 'milk', label: 'Без молока' },
  { key: 'gluten', label: 'Без глютена' },
  { key: 'egg', label: 'Без яиц' },
]

interface Props {
  selected: Allergen[]
  onToggle: (key: Allergen) => void
}

function AllergenFilter({ selected, onToggle }: Props) {
  return (
    <div
      role="group"
      aria-label="Фильтр по аллергенам"
      className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-2"
    >
      {FILTERS.map(({ key, label }) => {
        const isOn = selected.includes(key)
        return (
          <label
            key={key}
            className="flex items-center gap-x-2 cursor-pointer select-none text-cream-dark text-sm lg:text-base leading-none"
          >
            <span className="relative inline-flex h-4 w-4 md:h-[17px] md:w-[17px] lg:h-[19px] lg:w-[19px] shrink-0 transition-opacity hover:opacity-90">
              <input
                type="checkbox"
                checked={isOn}
                onChange={() => onToggle(key)}
                className="peer sr-only outline-none focus:outline-none focus-visible:outline-none"
              />
              <img
                src={isOn ? selectedCheckboxIcon : defaultCheckboxIcon}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-contain"
              />
            </span>
            {label}
          </label>
        )
      })}
    </div>
  )
}

export default AllergenFilter
