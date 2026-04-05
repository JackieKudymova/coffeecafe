/*
  Экран «Спасибо» после отправки формы на странице контактов.
  Всегда: портал в document.body, fixed поверх вьюпорта (как раньше на десктопе).
  Клик по свободной области или Escape — закрытие; без затемнения фона (bg-transparent).

  Отступы карточки как у старого inline-варианта: px-4 на узких экранах, иначе заголовок
  визуально уже, чем «внутри формы», хотя внешняя ширина та же.
*/

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ContactThanksPanelProps {
  onClose: () => void
}

function ThanksCard({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="w-full max-w-[567px] rounded-[10px] bg-[#cfc6bb] text-brown-dark px-4 py-8 min-[430px]:px-8 min-[430px]:py-12 lg:px-14 lg:py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-thanks-title"
    >
      <h2
        id="contact-thanks-title"
        className="
          text-center font-heading font-semibold tracking-tight whitespace-nowrap
          text-[28px] leading-[37px]
          lg:text-[36px] lg:leading-[48px]
        "
      >
        Спасибо за обращение!
      </h2>
      <p className="mt-4 text-center text-base leading-[19px] lg:mt-6 lg:text-lg lg:leading-[22px]">
        Ваше обращение принято и скоро наш сотрудник свяжется с вами!
      </p>
      <div className="mt-10 flex justify-center lg:mt-12">
        <button
          type="button"
          onClick={onClose}
          className="
            inline-flex h-[80px] w-full max-w-[326px] items-center justify-center rounded-[10px]
            bg-brown-button font-medium text-brown-dark text-base uppercase tracking-wider
            lg:h-[54px] lg:max-w-[280px] lg:text-lg
            transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-dark/30
          "
        >
          понятно
        </button>
      </div>
    </div>
  )
}

function ContactThanksPanel({ onClose }: ContactThanksPanelProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const modal = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-transparent px-4 py-8"
      role="presentation"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[567px]">
          <ThanksCard onClose={onClose} />
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default ContactThanksPanel
