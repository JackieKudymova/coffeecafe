/*
  NotFoundPage — страница 404.
  Макет: Figma HF_404 (1440×840) и HF_404 mobile (390×767).
  Фон страницы #1f1714; блок контента по центру, max 384px; футер как на остальных страницах.
*/

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function NotFoundPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div
      className={
        isMenuOpen
          ? 'bg-brown-button flex min-h-screen min-w-[320px] flex-col'
          : 'bg-brown-bg flex min-h-screen min-w-[320px] flex-col'
      }
    >
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/*
        Десктоп: колонка по центру по горизонтали (items-center); сверху отступ ~170px по HF_404 — не убирать.
        Мобилка: кнопка в капсе; 100px под кнопкой; под кнопкой на lg +20px (lg:pb-5 у колонки).
      */}
      <main
        className="
          flex flex-1 flex-col px-4 pt-[139px] pb-0
          lg:items-center lg:px-16 lg:pt-[170px] lg:pb-24
          xl:px-28
        "
      >
        <div className="mx-auto w-full max-w-[384px] pb-[100px] text-center lg:pb-5">
          <h1 className="font-heading text-[28px] font-semibold leading-[37px] text-cream lg:text-[36px] lg:leading-[48px]">
            Ошибка 404
          </h1>
          <p className="mt-4 text-base font-normal leading-[19px] text-cream-dark lg:mt-8 lg:text-lg lg:leading-[22px]">
            Адрес страницы устарел
          </p>

          <div className="mt-12 lg:mt-16">
            <Link
              to="/"
              className="
                mx-auto flex h-20 w-full max-w-[358px] items-center justify-center rounded-[10px]
                bg-brown-button text-center text-base font-medium leading-[19px] text-brown-dark
                transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50
                focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg
                lg:h-[54px] lg:max-w-none lg:text-lg lg:uppercase lg:tracking-wider
              "
            >
              <span className="uppercase lg:hidden">подробнее</span>
              <span className="hidden lg:inline">Перейти на актуальный адрес</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFoundPage
