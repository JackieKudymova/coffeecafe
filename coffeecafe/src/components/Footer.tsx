/*
  Footer — подвал сайта.
  Десктоп: 4 колонки (лого+VK, контакты, навигация×2) + копирайт + кнопка наверх.
  Мобилка: одна колонка по центру (лого, VK, контакты, копирайт). Без навигации и кнопки наверх.
*/

import { NavLink } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import VkIcon from './icons/VkIcon'

const navCol1 = [
  { label: 'Главная', href: '#' },
  { label: 'О нас', href: '#about' },
  { label: 'Меню', href: '#menu' },
]

const navCol2 = [
  { label: 'Политика конфиденциальности', href: '#' },
  { label: 'Новости и акции', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
]

function Footer() {
  return (
    <footer className="bg-brown-footer overflow-hidden">

      {/* Мобилка: одна колонка по центру */}
      <div className="lg:hidden px-4 py-4 flex flex-col items-center text-center">
        <img src={logo} alt="ДомКофе" className="h-[22px] w-auto" />

        {/* Иконка VK — 24×24, по центру под логотипом */}
        <a
          href="#"
          aria-label="ВКонтакте"
          className="mt-4 inline-block text-cream transition-colors duration-150 ease-out hover:text-brown-button active:text-brown-button [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
        >
          <VkIcon className="h-6 w-6" />
        </a>

        <div className="mt-4 flex flex-col gap-1 text-cream text-base">
          <span className="font-normal">Адрес:</span>
          <span>г. Санкт-Петербург, ул. Лесная, 12</span>
          <span className="font-normal mt-2">Телефон:</span>
          <span>8 952 288 90 99</span>
          <span className="font-normal mt-2">Почта:</span>
          <span>domcoffee@gmail.ru</span>
        </div>

        <p className="text-cream text-[13px] mt-6">
          © 2026 ДомКофе. Все права защищены
        </p>
      </div>

      {/*
        Десктоп: 12-колоночная сетка (как в Figma: 12 колонок, gutter 32px, margin 112px).
        Колонки: 1-3 (лого+VK), 4-7 (контакты), 8-9 (нав1), 10-12 (нав2).
        pt/pb по 24px, между контентом и копирайтом 48px, копирайт и кнопка выровнены по низу.
      */}
      <div className="hidden lg:block px-16 xl:px-28 pt-6 pb-6">
        <div className="grid grid-cols-12 gap-x-8">

          {/* Колонка 1-3: Лого + VK. items-start чтобы логотип не растягивался */}
          <div className="col-span-3 flex flex-col items-start">
            <img src={logo} alt="ДомКофе" className="h-[29px] w-auto" />
            {/* Иконка VK — 32×32, под логотипом с отступом 32px */}
            <a
              href="#"
              aria-label="ВКонтакте"
              className="mt-8 inline-block text-cream transition-colors duration-150 ease-out hover:text-brown-button active:text-brown-button [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
            >
              <VkIcon className="h-8 w-8" />
            </a>
          </div>

          {/* Колонка 4-7: Контакты. Между меткой и значением 8px, между группами 16px */}
          <div className="col-span-4 flex flex-col text-cream font-medium text-lg">
            <span>Адрес:</span>
            <span className="mt-2">г. Санкт-Петербург, ул. Лесная, 12</span>
            <span className="mt-4">Телефон:</span>
            <span className="mt-2">8 952 288 90 99</span>
            <span className="mt-4">Почта:</span>
            <span className="mt-2">domcoffee@gmail.ru</span>
          </div>

          {/* Колонка 8-9: Навигация 1. Между ссылками 32px */}
          <nav className="col-start-8 col-span-2 flex flex-col gap-8 text-cream font-medium text-lg">
            {navCol1.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Колонка 10-12: Навигация 2. overflow-visible — текст может выходить за границу колонки */}
          <nav className="col-start-10 col-span-3 flex flex-col gap-8 text-cream font-medium text-lg whitespace-nowrap overflow-visible">
            {navCol2.map((link) =>
              link.href.startsWith('/') ? (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className="transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm whitespace-nowrap"
                >
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm whitespace-nowrap"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
        </div>

        {/* Нижняя строка: копирайт + кнопка наверх. items-end — выровнены по низу как в макете */}
        <div className="flex justify-between items-end mt-12">
          <p className="text-cream text-base">
            © 2026 ДомКофе. Все права защищены
          </p>
          {/* Кнопка «Наверх» 48×48 — UI-KIT Up: круг #d2a679 → hover #c49567 → active #a68463 (не opacity) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Наверх"
            className="group cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-footer"
          >
            <svg
              width={48}
              height={48}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block h-12 w-12"
              aria-hidden
            >
              <g clipPath="url(#footerScrollUpClip)">
                <path
                  d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                  className="fill-brown-button transition-[fill] duration-150 ease-out group-hover:fill-brown-button-hover group-active:fill-brown-button-active"
                />
                <path
                  d="M24.7078 14.2929C24.3173 13.9024 23.6841 13.9024 23.2936 14.2929L16.9296 20.6569C16.5391 21.0474 16.5391 21.6805 16.9296 22.0711C17.3202 22.4616 17.9533 22.4616 18.3438 22.0711L24.0007 16.4142L29.6576 22.0711C30.0481 22.4616 30.6812 22.4616 31.0718 22.0711C31.4623 21.6805 31.4623 21.0474 31.0718 20.6569L24.7078 14.2929ZM24.0007 36H25.0007V15H24.0007H23.0007V36H24.0007Z"
                  className="fill-brown-dark"
                />
              </g>
              <defs>
                <clipPath id="footerScrollUpClip">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
