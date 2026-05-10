/*
  Header - шапка сайта.
  На мобилках при нажатии бургера открывается полноэкранное меню (overlay).
  На десктопе - обычная горизонтальная навигация.
  Логотип - векторный SVG, масштабируется под разрешение.
  Меню рендерится через createPortal в document.body + блокировка скролла - иначе на iOS Safari
  видны зазоры и прокручивается страница под оверлеем.
*/

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import userIcon from '../assets/images/User Male.png'
import { getUserToken } from '../services/authService'

/* Десктопная навигация включает "Главная", мобильная - нет (по макету) */
const desktopLinks = [
  { label: 'Главная', href: '/' },
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
  /*
    Куда ведёт «Личный кабинет»: если уже есть токен - сразу в /lk,
    иначе - на страницу входа. useLocation триггерит ре-рендер при смене
    маршрута, чтобы после логина (navigate('/lk')) кнопка обновилась.
  */
  useLocation()
  const lkHref = getUserToken() ? '/lk' : '/login'

  /* На планшете/мобилке «Личный кабинет» - пункт меню (иконки в header нет, по макету). */
  const mobileLinks = [
    { label: 'О нас', href: '/about' },
    { label: 'Меню', href: '/menu' },
    { label: 'Новости и акции', href: '/news' },
    { label: 'Контакты', href: '/contacts' },
    { label: 'Личный кабинет', href: lkHref },
  ]

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
            className="h-[25px] md:h-[27px] w-auto"
          />
        </a>
        <button
          type="button"
          className="text-cream transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
          onClick={onToggleMenu}
          aria-label="Закрыть меню"
        >
          {/* 24×24 мобилка, 35×35 планшет (по Figma Menu/Close_LG) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="md:w-[35px] md:h-[35px]">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Пункты меню - по центру экрана. Планшет (md:) - больше размер и отступ по Figma. */}
      <nav className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-12 min-h-0">
        {mobileLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.href}
            className={({ isActive }) =>
              [
                'font-normal text-[24px] leading-[29px] md:text-[32px] md:leading-[39px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-button rounded-sm',
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
      {/* Шапка - всегда поверх контента */}
      <header className="absolute top-0 left-0 w-full z-50">
        {/*
          Везде flex c justify-between.
          Мобилки/планшет: логотип слева, бургер справа.
          Десктоп: логотип - меню - иконка ЛК; justify-between делит свободное место
          поровну между этими тремя элементами, поэтому меню стоит между логотипом и
          иконкой (как в макете HF_desktop_about us.header - по 258 px с каждой стороны),
          а не по геометрическому центру фрейма (логотип 127 px шире иконки 28 px,
          поэтому 1fr-auto-1fr давал бы видимое смещение).
        */}
        <div className="flex items-center justify-between px-4 lg:px-16 xl:px-28 py-4 lg:py-6">
          {/* Логотип - SVG, адаптивный размер: 106×25 мобилка, 120×27 планшет, 127×29 десктоп */}
          <a href="/">
            <img
              src={logo}
              alt="ДомКофе"
              className="h-[25px] md:h-[27px] lg:h-[29px] w-auto"
            />
          </a>

          {/* Десктопная навигация - между логотипом и иконкой */}
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

          {/*
            Иконка «Личный кабинет» → /login, правая колонка.
            Состояния - как у пунктов меню (text-cream → hover/active: text-brown-button).
            Используем CSS-маску, чтобы цвет PNG-иконки управлялся через bg-current.
          */}
          <NavLink
            to={lkHref}
            aria-label="Личный кабинет"
            className="hidden lg:inline-flex shrink-0 text-cream transition-colors hover:text-brown-button active:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:rounded-sm"
          >
            <span
              aria-hidden
              className="block h-7 w-7 bg-current"
              style={{
                WebkitMaskImage: `url(${userIcon})`,
                maskImage: `url(${userIcon})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            />
          </NavLink>

          {/* Бургер-кнопка (только мобилки/планшет) */}
          <button
            type="button"
            className="lg:hidden text-cream transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {/* 24×24 мобилка, 35×35 планшет (по Figma Menu/Close_LG) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="md:w-[35px] md:h-[35px]">
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
