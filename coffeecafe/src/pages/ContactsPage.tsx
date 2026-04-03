/*
  ContactsPage — страница «Контакты».
  Десктоп: 12-колоночная сетка — контактная информация (кол. 1-6) + форма (кол. 7-12).
  Мобилка: одна колонка — контакты сверху, форма снизу.
  Форма пока без отправки — только визуал по макету.
*/

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import VkIcon from '../components/icons/VkIcon'
import defaultCheckboxIcon from '../assets/images/default-chckbox-vector.svg'
import selectedCheckboxIcon from '../assets/images/selected-vector.svg'

function ContactsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

          {/* Форма — мобилка */}
          <ContactForm className="mt-10" />
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

          {/* Колонки 7-12: форма обратной связи */}
          <div className="col-span-6">
            <ContactForm />
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
function ContactForm({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#4b372b] rounded-[10px] p-8 lg:px-14 lg:pt-[48px] lg:pb-[48px] ${className}`}>
      <h2 className="text-cream font-normal text-xl lg:text-2xl whitespace-nowrap">
        Есть вопросы? Напишите нам
      </h2>

      {/* Поле «Имя». Отступы по Figma: label 24px от заголовка, input 8px от label */}
      <label className="block mt-6 lg:mt-[24px]">
        <span className="text-cream-dark text-base lg:text-lg">Имя</span>
        <input
          type="text"
          placeholder="Как к вам обращаться?"
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

      {/* Поле «Телефон». Маска +7 (XXX) XXX-XX-XX */}
      <label className="block mt-4">
        <span className="text-cream-dark text-base lg:text-lg">Телефон</span>
        <PhoneInput />
      </label>

      {/* Поле «Сообщение». Высота: 4 строки × 22px line-height + py-4 (32px) ≈ 120px; иначе нижняя строка обрезается */}
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
            placeholder="Введите ваше сообщение"
            className="
              w-full h-full min-h-0 bg-transparent text-cream placeholder:text-placeholder
              text-base leading-[22px] outline-none resize-none overflow-y-auto
              scrollbar-hide
            "
          />
        </div>
      </div>

      {/* Чекбокс UI Kit: default — default-chckbox-vector.svg; checked — selected-vector.svg */}
      <label className="flex items-center gap-[14px] mt-4 cursor-pointer">
        <span className="relative inline-flex h-6 w-6 shrink-0 rounded-sm transition-opacity hover:opacity-90">
          <input
            type="checkbox"
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
        <span className="text-[#cfc6bb] text-sm lg:text-base leading-[19px]">
          Даю согласие на обработку персональных данных
        </span>
      </label>

      {/* Кнопка «Отправить». 24px от чекбокса */}
      <button
        type="button"
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
    </div>
  )
}

/*
  PhoneInput — маска +7 (XXX) XXX-XX-XX. Пока нет цифр — value пустой, виден placeholder.
  Ведущие 7/8 — один раз; одна 7/8 даёт +7 (; при стирании назад — value '', снова виден placeholder.
*/
const PHONE_PLACEHOLDER_EXAMPLE = '+7 (900) 123-45-67'

function PhoneInput() {
  const [value, setValue] = useState('')

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
          setValue('')
          return
        }
        setValue('+7 (')
        return
      }
      setValue('')
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

    setValue(formatted)
  }

  return (
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={value}
      onChange={handleChange}
      placeholder={PHONE_PLACEHOLDER_EXAMPLE}
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
