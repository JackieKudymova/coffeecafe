/*
  Экран «Спасибо» после отправки формы на странице контактов.
  Десктоп: карточка по центру через портал.
  Мобилка (HF_mobile_thanks): inset-0 поверх формы; блок текста+кнопки по вертикали по центру (воздух сверху/снизу).
  Заголовок→подзаголовок узкий зазор; до кнопки больше (макет); кнопка max-w 326px по центру.
  На узком экране горизонталь px-4 (у формы p-8) — больше места для строки заголовка 28px без переноса; с min-[430px] снова px-8.
*/

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ContactThanksPanelProps {
  onClose: () => void
  /** true — только карточка в колонке (мобилка); false — портал с оверлеем (десктоп) */
  variant: 'inline' | 'modal'
  /** Для variant=inline — отступы относительно колонки (например mt-10) */
  className?: string
}

function ThanksCard({
  onClose,
  buttonLayout,
}: {
  onClose: () => void
  buttonLayout: 'mobile' | 'desktop'
}) {
  const isMobile = buttonLayout === 'mobile'

  return (
    <div
      className={`
        rounded-[10px] bg-[#cfc6bb] text-brown-dark
        ${
          isMobile
            ? 'box-border flex h-full w-full flex-col justify-center py-8 px-4 min-[430px]:px-8'
            : 'w-full max-w-[567px] px-8 py-12 sm:px-14'
        }
      `}
      role="dialog"
      aria-modal={!isMobile}
      aria-labelledby="contact-thanks-title"
    >
      {isMobile ? (
        <div className="w-full">
          <h2
            id="contact-thanks-title"
            className="text-center font-heading font-semibold text-[28px] leading-[37px] tracking-tight"
          >
            Спасибо за обращение!
          </h2>
          <p className="mt-3 text-center text-base leading-[19px]">
            Ваше обращение принято и скоро наш сотрудник свяжется с вами!
          </p>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="
                h-[80px] w-full max-w-[326px] rounded-[10px] bg-brown-button font-medium text-brown-dark
                text-base uppercase tracking-wider transition-colors
                hover:bg-brown-button-hover active:bg-brown-button-active
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-dark/30
              "
            >
              понятно
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2
            id="contact-thanks-title"
            className="text-center font-heading font-semibold text-[36px] leading-[48px]"
          >
            Спасибо за обращение!
          </h2>
          <p className="mt-6 text-center text-lg leading-[22px]">
            Ваше обращение принято и скоро наш сотрудник свяжется с вами!
          </p>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex h-[54px] w-[280px] items-center justify-center rounded-[10px]
                bg-brown-button font-medium text-brown-dark text-lg uppercase tracking-wider
                transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-dark/30
              "
            >
              понятно
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ContactThanksPanel({ onClose, variant, className = '' }: ContactThanksPanelProps) {
  useEffect(() => {
    if (variant !== 'modal') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant, onClose])

  if (variant === 'inline') {
    return (
      <div className={`h-full w-full min-h-0 ${className}`}>
        <ThanksCard onClose={onClose} buttonLayout="mobile" />
      </div>
    )
  }

  const modal = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-transparent px-4 py-8"
      role="presentation"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[567px]">
        <ThanksCard onClose={onClose} buttonLayout="desktop" />
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default ContactThanksPanel
