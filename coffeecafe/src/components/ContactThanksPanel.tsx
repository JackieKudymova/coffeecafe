/*
  Экран «Спасибо» после отправки формы на странице контактов.
  Всегда: портал в document.body, fixed поверх вьюпорта (как раньше на десктопе).
  Клик по свободной области или Escape - закрытие; без затемнения фона (bg-transparent).

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
      className="w-full max-w-[358px] md:max-w-[567px] lg:max-w-[579px] rounded-[5px] bg-[#A6937F] text-brown-dark px-4 py-14 md:px-14 md:py-12 lg:px-12 lg:py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-thanks-title"
    >
      {/*
        Заголовок по макету:
          - КАПСЛОК на всех BP (uppercase),
          - на мобилке перенос строки после «СПАСИБО» (br виден только на мобилке),
          - на планшете и десктопе - в одну строку (whitespace-nowrap начиная с md).
        Размеры/leading/tracking - точные значения из Figma (24/32/36, ls 0.02em).
      */}
      <h2
        id="contact-thanks-title"
        className="
          text-center font-heading font-semibold uppercase tracking-[0.02em]
          md:whitespace-nowrap
          text-[24px] leading-[32.74px]
          md:text-[32px] md:leading-[43.65px]
          lg:text-[36px] lg:leading-[49.1px]
        "
      >
        Спасибо
                <br className="md:hidden" />
        <span className="hidden md:inline"> </span>
        за обращение!
      </h2>
      <p className="mt-4 md:mt-6 text-center text-base leading-[19px] md:text-[17px] md:leading-[21px] lg:text-lg lg:leading-[22px]">
        Ваше обращение принято и скоро наш сотрудник свяжется с вами!
      </p>
      <div className="mt-[34px] md:mt-12 flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="
            inline-flex h-[67px] w-full max-w-[326px] items-center justify-center
            bg-transparent border border-[#FDD4A9] text-[#FDD4A9] font-medium text-base uppercase tracking-wider
            md:max-w-[386px]
            lg:h-[54px] lg:max-w-[280px] lg:text-lg
            transition-colors hover:border-[#FFC68A] hover:text-[#FFC68A] active:border-[#EDC091] active:text-[#EDC091]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDD4A9]/30
            rounded-[5px]
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
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[358px] md:max-w-[567px] lg:max-w-[579px]">
          <ThanksCard onClose={onClose} />
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default ContactThanksPanel
