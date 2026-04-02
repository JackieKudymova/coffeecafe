/*
  Footer — подвал сайта.
  Десктоп: 4 колонки (лого+VK, контакты, навигация×2) + копирайт + кнопка наверх.
  Мобилка: одна колонка по центру (лого, VK, контакты, копирайт). Без навигации и кнопки наверх.
*/

import logo from '../assets/images/logo.svg'
import vkIcon from '../assets/images/mingcute_vkontakte-fill.svg'
import upIcon from '../assets/images/up.svg'

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
        <a href="#" aria-label="VK" className="mt-4">
          <img src={vkIcon} alt="ВКонтакте" className="w-6 h-6" />
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
            <a href="#" aria-label="VK" className="mt-8">
              <img src={vkIcon} alt="ВКонтакте" className="w-8 h-8" />
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
              <a key={link.label} href={link.href} className="hover:text-brown-button transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Колонка 10-12: Навигация 2. overflow-visible — текст может выходить за границу колонки */}
          <nav className="col-start-10 col-span-3 flex flex-col gap-8 text-cream font-medium text-lg whitespace-nowrap overflow-visible">
            {navCol2.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-brown-button transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Нижняя строка: копирайт + кнопка наверх. items-end — выровнены по низу как в макете */}
        <div className="flex justify-between items-end mt-12">
          <p className="text-cream text-base">
            © 2026 ДомКофе. Все права защищены
          </p>
          {/* Кнопка «Наверх» — 48×48 */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Наверх"
            className="cursor-pointer"
          >
            <img src={upIcon} alt="Наверх" className="w-12 h-12" />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
