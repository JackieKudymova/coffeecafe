/*
  ContactsPage — страница «Контакты».
  Десктоп: 12-колоночная сетка — контактная информация (кол. 1-6) + форма (кол. 7-12).
  Мобилка: одна колонка — контакты сверху, форма снизу.
  Форма пока без отправки — только визуал по макету.
*/

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import vkIcon from '../assets/images/mingcute_vkontakte-fill.svg'

function ContactsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Основной контент. Хедер absolute ~57px, поэтому pt включает его высоту + отступ */}
      <main className="px-4 lg:px-16 xl:px-28 pt-[112px] lg:pt-[149px]">

        {/* Мобилка: одна колонка */}
        <div className="lg:hidden">
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
              <a href="#" aria-label="VK" className="inline-block mt-[20px]">
                <img src={vkIcon} alt="ВКонтакте" className="w-8 h-8" />
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
                <a href="#" aria-label="VK" className="inline-block mt-[20px]">
                  <img src={vkIcon} alt="ВКонтакте" className="w-8 h-8" />
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
            bg-[#5d483c] text-cream placeholder-[#cfc6bb]
            text-base outline-none
          "
        />
      </label>

      {/* Поле «Телефон». 16px от предыдущего инпута */}
      <label className="block mt-4">
        <span className="text-cream-dark text-base lg:text-lg">Телефон</span>
        <input
          type="tel"
          placeholder="+7 (   ) __ - ____"
          className="
            w-full mt-2 h-[51px] px-4 rounded-[10px]
            bg-[#5d483c] text-cream placeholder-[#cfc6bb]
            text-base outline-none
          "
        />
      </label>

      {/* Поле «Сообщение». 16px от предыдущего инпута */}
      <label className="block mt-4">
        <span className="text-cream-dark text-base lg:text-lg">Сообщение</span>
        <textarea
          placeholder="Введите ваше сообщение"
          className="
            w-full mt-2 h-[100px] px-4 py-3 rounded-[10px]
            bg-[#5d483c] text-cream placeholder-[#cfc6bb]
            text-base outline-none resize-none
          "
        />
      </label>

      {/* Чекбокс согласия. 16px от textarea */}
      <label className="flex items-center gap-[14px] mt-4 cursor-pointer">
        <input
          type="checkbox"
          className="
            w-6 h-6 shrink-0 appearance-none rounded
            border-2 border-[#cfc6bb] bg-transparent
            checked:bg-brown-button checked:border-brown-button
            cursor-pointer
          "
        />
        <span className="text-[#cfc6bb] text-sm lg:text-base leading-[19px]">
          Даю согласие на обработку персональных данных
        </span>
      </label>

      {/* Кнопка «Отправить». 24px от чекбокса */}
      <button
        type="button"
        className="
          w-full h-[54px] mt-6 rounded-[10px]
          bg-brown-button text-brown-dark font-medium
          text-base lg:text-lg uppercase tracking-wider
          transition-colors hover:bg-brown-button/90
          cursor-pointer
        "
      >
        Отправить
      </button>
    </div>
  )
}

export default ContactsPage
