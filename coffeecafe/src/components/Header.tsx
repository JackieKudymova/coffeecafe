/*
  Header — шапка сайта.
  На мобилках при нажатии бургера открывается полноэкранное меню (overlay).
  На десктопе — обычная горизонтальная навигация.
  Логотип — векторный SVG, масштабируется под разрешение.
  Меню рендерится через createPortal в document.body + блокировка скролла — иначе на iOS Safari
  видны зазоры и прокручивается страница под оверлеем.
*/

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/logo.svg'

/* Десктопная навигация включает "Главная", мобильная — нет (по макету) */
const desktopLinks = [
  { label: 'Главная', href: '/' },
  { label: 'О нас', href: '/about' },
  { label: 'Меню', href: '/menu' },
  { label: 'Новости и акции', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
]

const mobileLinks = [
  { label: 'О нас', href: '/about' },
  { label: 'Меню', href: '/menu' },
  { label: 'Новости и акции', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
]

interface HeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

function Header({ isMenuOpen, onToggleMenu }: HeaderProps) {
  useEffect(() => {
    if (!isMenuOpen) return

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyPosition = body.style.position
    const prevBodyTop = body.style.top
    const prevBodyLeft = body.style.left
    const prevBodyRight = body.style.right
    const prevBodyWidth = body.style.width
    const scrollY = window.scrollY

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.position = prevBodyPosition
      body.style.top = prevBodyTop
      body.style.left = prevBodyLeft
      body.style.right = prevBodyRight
      body.style.width = prevBodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [isMenuOpen])

  const mobileMenuOverlay = (
    <div
      className={`
        fixed inset-0 z-[100] bg-brown-dark lg:hidden
        flex flex-col transition-opacity duration-300
        min-h-ios-screen w-full max-w-[100vw]
        overscroll-none
        ${isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}
      `}
      aria-hidden={!isMenuOpen}
    >
      {/* Верхняя строка: логотип + крестик */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <a href="/">
          <img
            src={logo}
            alt="ДомКофе"
            className="h-[25px] w-auto"
          />
        </a>
        <button
          type="button"
          className="text-cream transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
          onClick={onToggleMenu}
          aria-label="Закрыть меню"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Пункты меню — по центру экрана */}
      <nav className="flex-1 flex flex-col items-center justify-center gap-8 min-h-0">
        {mobileLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.href}
            className={({ isActive }) =>
              [
                'font-normal text-[28px] leading-[34px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-button rounded-sm',
                isActive
                  ? 'text-brown-button'
                  : 'text-cream hover:text-brown-button',
                /* тач: при удержании не белый, тот же акцент что и hover */
                'active:text-brown-button',
              ].join(' ')
            }
            onClick={onToggleMenu}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Шапка — всегда поверх контента */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between px-4 lg:px-16 xl:px-28 py-4 lg:py-6">
          {/* Логотип — SVG, адаптивный размер: 106×25 мобилка, 127×29 десктоп */}
          <a href="/">
            <img
              src={logo}
              alt="ДомКофе"
              className="h-[25px] lg:h-[29px] w-auto"
            />
          </a>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex gap-4 lg:gap-8">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                end={link.href === '/'}
                className="font-medium text-sm lg:text-lg leading-[22px] text-cream transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Бургер-кнопка (только мобилки) */}
          <button
            type="button"
            className="lg:hidden text-cream transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {createPortal(mobileMenuOverlay, document.body)}
    </>
  )
}

export default Header
