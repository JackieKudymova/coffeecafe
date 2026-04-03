/*
  ContactsPage — страница «Контакты».
  Десктоп (lg, 1024px+): 12-колоночная сетка — контакты + форма; «Спасибо» — модалка (портал).
  Мобилка/планшет: форма остаётся в разметке (скрыта при успехе), «Спасибо» — absolute inset-0,
  те же ширина/высота, что у формы; без портала.
  Важно: портал в body не наследует display:none у скрытой lg-сетки — модалку монтируем только
  при min-width: 1024px, иначе на узком экране был бы дубль (inline + модалка сверху).
*/

import { useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ContactThanksPanel from '../components/ContactThanksPanel'
import VkIcon from '../components/icons/VkIcon'
import defaultCheckboxIcon from '../assets/images/default-chckbox-vector.svg'
import selectedCheckboxIcon from '../assets/images/selected-vector.svg'

function ContactsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  /** Смена key сбрасывает поля обеих форм после закрытия «Спасибо» */
  const [formResetKey, setFormResetKey] = useState(0)
  /** Совпадает с breakpoint `lg` в Tailwind — модалка только здесь, не на мобилке/планшете */
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)')

  function handleThanksClose() {
    setFormSent(false)
    setFormResetKey((k) => k + 1)
  }

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Основной контент. Хедер absolute ~57px, поэтому pt включает его высоту + отступ */}
      <main className="px-4 lg:px-16 xl:px-28 pt-[92px] lg:pt-[149px]">

        {/* Мобилка: одна колонка */}
        <div className="lg:hidden pb-[50px]">
          <h1 className="font-heading font-semibold text-cream text-[28px] leading-tight">
            Контакты
          </h1>

          <div className="text-cream-dark text-base leading-[19px] mt-10 space-y-6">
            <p>
              Мы находимся в центре города, в тихом дворике. Напишите нам или
              позвоните, если хотите забронировать стол или задать вопрос.
            </p>

            <div>
              <span className="block">Адрес:</span>
              <span>г. Санкт-Петербург, ул. Лесная, 12</span>
            </div>

            <div>
              <span className="block">Телефон:</span>
              <span>8 952 288 90 99</span>
            </div>

            <div>
              <span className="block">Почта:</span>
              <span>domcoffee@gmail.ru</span>
            </div>

            <div>
              <span className="block">Соцсети:</span>
              <a
                href="#"
                aria-label="ВКонтакте"
                className="mt-[20px] inline-block text-cream transition-colors duration-150 ease-out hover:text-brown-button active:text-brown-button [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
              >
                <VkIcon className="h-8 w-8" />
              </a>
            </div>
          </div>

          <div className="relative mt-10">
            <ContactForm
              key={formResetKey}
              className={formSent ? 'invisible pointer-events-none' : ''}
              ariaHidden={formSent}
              onSuccess={() => setFormSent(true)}
            />
            {formSent ? (
              <div className="absolute inset-0 z-10">
                <ContactThanksPanel
                  variant="inline"
                  onClose={handleThanksClose}
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Десктоп: 12-колоночная сетка */}
        <div className="hidden lg:grid grid-cols-12 gap-x-8 pb-[95px]">
          {/* Колонки 1-6: контактная информация. pt-[10px] — заголовок ниже формы по макету */}
          <div className="col-span-6 pt-[10px]">
            <h1 className="font-heading font-semibold text-cream text-[36px] leading-tight">
              Контакты
            </h1>

            <div className="text-cream-dark text-lg leading-[22px] mt-12 space-y-6">
              <p>
                Мы находимся в центре города, в тихом дворике. Напишите нам или
                позвоните, если хотите забронировать стол или задать вопрос.
              </p>

              <div>
                <span className="block">Адрес:</span>
                <span>г. Санкт-Петербург, ул. Лесная, 12</span>
              </div>

              <div>
                <span className="block">Телефон:</span>
                <span>8 952 288 90 99</span>
              </div>

              <div>
                <span className="block">Почта:</span>
                <span>domcoffee@gmail.ru</span>
              </div>

              <div>
                <span className="block">Соцсети:</span>
                <a
                  href="#"
                  aria-label="ВКонтакте"
                  className="mt-[20px] inline-block text-cream transition-colors duration-150 ease-out hover:text-brown-button active:text-brown-button [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
                >
                  <VkIcon className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>

          {/* Колонки 7-12: форма всегда; модалка «Спасибо» — только оверлей (портал), без снятия формы с экрана */}
          <div className="col-span-6 relative">
            <ContactForm
              key={formResetKey}
              onSuccess={() => setFormSent(true)}
            />
            {formSent && isDesktopLayout ? (
              <ContactThanksPanel
                variant="modal"
                onClose={handleThanksClose}
              />
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/*
  ContactForm — карточка с формой обратной связи.
  Тёмный фон #4b372b, поля ввода #5d483c, placeholder #cfc6bb.
  Кнопка «Отправить» — стандартный стиль brown-button.
*/
function ContactForm({
  className = '',
  onSuccess,
  ariaHidden = false,
}: {
  className?: string
  onSuccess: () => void
  /** Скрыта визуально, но остаётся в потоке — для overlay «Спасибо» 1:1 по размеру */
  ariaHidden?: boolean
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  /** Ошибки полей (UI-KIT Error). Сообщение — необязательное поле, error к нему не применяем. */
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    consent: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const next = {
      name: !name.trim(),
      phone: !isPhoneComplete(phone),
      consent: !consent,
    }
    setErrors(next)

    if (next.name || next.phone || next.consent) return

    onSuccess()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-hidden={ariaHidden}
      className={`bg-[#4b372b] rounded-[10px] px-8 pt-[22px] pb-8 lg:px-14 lg:pt-[48px] lg:pb-[48px] ${className}`}
    >
      <h2 className="text-cream font-normal text-2xl leading-[1.2] lg:leading-normal">
        Есть вопросы?
        <br className="min-[500px]:hidden" aria-hidden />
        {' '}
        Напишите нам
      </h2>

      <label className="block mt-[13px] lg:mt-[24px]">
        <span
          className={`block text-base lg:text-lg leading-[22px] ${errors.name ? 'text-input-border-error' : 'text-cream-dark'}`}
        >
          {errors.name ? 'Укажите имя' : 'Имя'}
        </span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setErrors((prev) => ({ ...prev, name: false }))
          }}
          placeholder="Как к вам обращаться?"
          autoComplete="name"
          aria-invalid={errors.name}
          className="
            w-full mt-2 h-[51px] px-4 rounded-[10px]
            bg-input-bg text-cream placeholder:text-placeholder
            border-2 border-transparent text-base outline-none transition-colors
            hover:bg-input-bg-hover
            focus-visible:border-input-border-focus focus-visible:outline-none
            aria-invalid:border-input-border-error
          "
        />
      </label>

      <label className="block mt-4">
        <span
          className={`block text-base lg:text-lg leading-[22px] ${errors.phone ? 'text-input-border-error' : 'text-cream-dark'}`}
        >
          {errors.phone ? 'Введите корректный номер телефона' : 'Телефон'}
        </span>
        <PhoneInput
          value={phone}
          invalid={errors.phone}
          onChange={(v) => {
            setPhone(v)
            setErrors((prev) => ({ ...prev, phone: false }))
          }}
        />
      </label>

      <div className="block mt-4">
        <span className="text-cream-dark text-base lg:text-lg">Сообщение</span>
        <div
          className="
            mt-2 h-[120px] px-4 py-4 rounded-[10px] overflow-hidden
            bg-input-bg border-2 border-transparent transition-colors
            hover:bg-input-bg-hover
            focus-within:border-input-border-focus
            has-[[aria-invalid=true]]:border-input-border-error
          "
        >
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите ваше сообщение"
            className="
              w-full h-full min-h-0 bg-transparent text-cream placeholder:text-placeholder
              text-base leading-[22px] outline-none resize-none overflow-y-auto
              scrollbar-hide
            "
          />
        </div>
      </div>

      <label className="flex items-center gap-[14px] mt-4 cursor-pointer">
        <span
          className={`
            relative inline-flex h-6 w-6 shrink-0 rounded-sm transition-opacity hover:opacity-90
            ${errors.consent ? 'ring-2 ring-input-border-error ring-offset-0' : ''}
          `}
        >
          <input
            type="checkbox"
            checked={consent}
            aria-invalid={errors.consent}
            onChange={(e) => {
              setConsent(e.target.checked)
              setErrors((prev) => ({ ...prev, consent: false }))
            }}
            className="peer sr-only outline-none focus:outline-none focus-visible:outline-none"
          />
          <img
            src={defaultCheckboxIcon}
            alt=""
            className="absolute inset-0 h-full w-full object-contain peer-checked:hidden"
            aria-hidden
          />
          <img
            src={selectedCheckboxIcon}
            alt=""
            className="absolute inset-0 hidden h-full w-full object-contain peer-checked:block"
            aria-hidden
          />
        </span>
        <span
          className={`text-sm lg:text-base leading-[19px] ${errors.consent ? 'text-input-border-error' : 'text-[#cfc6bb]'}`}
        >
          Даю согласие на обработку персональных данных
        </span>
      </label>

      <button
        type="submit"
        className="
          w-full h-[80px] lg:h-[54px] mt-6 rounded-[10px]
          bg-brown-button text-brown-dark font-medium
          text-base lg:text-lg uppercase tracking-wider
          transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
          cursor-pointer
        "
      >
        Отправить
      </button>
    </form>
  )
}

function isPhoneComplete(masked: string): boolean {
  const digits = masked.replace(/\D/g, '')
  if (digits.length === 11 && digits[0] === '7') return true
  if (digits.length === 11 && digits[0] === '8') return true
  return false
}

/*
  PhoneInput — маска +7 (XXX) XXX-XX-XX. Пока нет цифр — value пустой, виден placeholder.
  Контролируемый: value и onChange с родителя.
*/
const PHONE_PLACEHOLDER_EXAMPLE = '+7 (900) 123-45-67'

function PhoneInput({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const digitsOnly = raw.replace(/\D/g, '')
    const isDeleting = raw.length < value.length

    let national = digitsOnly
    if (national.length > 0 && (national[0] === '7' || national[0] === '8')) {
      national = national.slice(1)
    }
    national = national.slice(0, 10)

    if (national.length === 0) {
      if (digitsOnly.length === 1 && (digitsOnly[0] === '7' || digitsOnly[0] === '8')) {
        if (isDeleting) {
          onChange('')
          return
        }
        onChange('+7 (')
        return
      }
      onChange('')
      return
    }

    let formatted = '+7 ('
    formatted += national.slice(0, 3)
    if (national.length > 3) {
      formatted += ') ' + national.slice(3, 6)
    }
    if (national.length > 6) {
      formatted += '-' + national.slice(6, 8)
    }
    if (national.length > 8) {
      formatted += '-' + national.slice(8, 10)
    }

    onChange(formatted)
  }

  return (
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={value}
      onChange={handleChange}
      placeholder={PHONE_PLACEHOLDER_EXAMPLE}
      aria-invalid={invalid === true}
      className="
        w-full mt-2 h-[51px] px-4 rounded-[10px]
        bg-input-bg text-cream placeholder:text-placeholder
        border-2 border-transparent text-base outline-none transition-colors
        hover:bg-input-bg-hover
        focus-visible:border-input-border-focus focus-visible:outline-none
        aria-invalid:border-input-border-error
      "
    />
  )
}

export default ContactsPage
