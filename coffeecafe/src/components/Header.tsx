/*
  Header — шапка сайта.
  На мобилках при нажатии бургера открывается полноэкранное меню (overlay).
  На десктопе — обычная горизонтальная навигация.
*/

/* Десктопная навигация включает "Главная", мобильная — нет (по макету) */
const desktopLinks = [
  { label: 'Главная', href: '#' },
  { label: 'О нас', href: '#about' },
  { label: 'Меню', href: '#menu' },
  { label: 'Новости и акции', href: '#news' },
  { label: 'Контакты', href: '#contacts' },
]

const mobileLinks = [
  { label: 'О нас', href: '#about' },
  { label: 'Меню', href: '#menu' },
  { label: 'Новости и акции', href: '#news' },
  { label: 'Контакты', href: '#contacts' },
]

interface HeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

function Header({ isMenuOpen, onToggleMenu }: HeaderProps) {
  return (
    <>
      {/* Шапка — всегда поверх контента */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="flex items-center justify-between px-4 lg:px-16 xl:px-28 py-4 lg:py-6">
          <a href="#" className="font-bold text-lg lg:text-2xl leading-[29px] text-[#ebebeb]">
            ДомКофе
          </a>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex gap-4 lg:gap-8">
            {desktopLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-cream font-medium text-sm lg:text-lg leading-[22px] hover:text-brown-button transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Бургер-кнопка (только мобилки) */}
          <button
            className="lg:hidden text-cream"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/*
        Полноэкранное мобильное меню (overlay).
        Перекрывает весь экран тёмным фоном.
        transition-opacity для плавного появления/исчезновения.
      */}
      <div
        className={`
          fixed inset-0 z-30 bg-brown-dark lg:hidden
          flex flex-col transition-opacity duration-300
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        {/* Верхняя строка: логотип + крестик */}
        <div className="flex items-center justify-between px-4 py-4">
          <a href="#" className="font-bold text-lg text-cream">
            ДомКофе
          </a>
          <button
            className="text-cream"
            onClick={onToggleMenu}
            aria-label="Закрыть меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Пункты меню — по центру экрана */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-8">
          {mobileLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-cream font-normal text-[28px] leading-[34px]"
              onClick={onToggleMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Header
