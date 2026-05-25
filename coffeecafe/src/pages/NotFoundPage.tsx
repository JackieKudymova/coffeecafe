/*
  NotFoundPage - страница 404.
  Макет: Figma HF_404 (1440×840) и HF_404 mobile (390×767).
  Фон страницы #1f1714; блок контента по центру, max 384px; футер как на остальных страницах.
*/

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function NotFoundPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  /*
    Внешний wrapper тянется на всю высоту вьюпорта (min-h-screen) и красится в цвет футера -
    это убирает видимую полосу под футером на экранах выше 767 px (макет HF_404 mobile).
    Внутренний content-wrapper держит цвет контентной части (brown-bg или brown-button при меню).
  */
  return (
    <div className="bg-brown-footer flex min-h-screen min-w-[320px] flex-col">
      <div className={isMenuOpen ? 'bg-brown-button' : 'bg-brown-bg'}>
        <Header
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/*
          Десктоп: колонка по центру по горизонтали (items-center); сверху отступ ~170px по HF_404 - не убирать.
          Мобилка: обычный поток; от подзаголовка до кнопки 48px (mt-12), от кнопки до футера 111px (pb).
        */}
        <main
          className="
            px-4 pt-[139px] pb-[111px]
            lg:flex lg:flex-col lg:items-center lg:px-16 lg:pt-[170px] lg:pb-24
            xl:px-28
          "
        >
        <div className="mx-auto w-full max-w-[384px] text-center lg:pb-5">
          <h1 className="font-heading text-[24px] font-normal leading-[31px] text-cream lg:text-[36px] lg:leading-[48px] uppercase tracking-[0.02em]">
            Ошибка 404
          </h1>
          <p className="mt-4 text-base font-normal leading-[19px] text-cream-dark lg:mt-8 lg:text-lg lg:leading-[22px]">
            Адрес страницы устарел
          </p>

          <Link
            to="/"
            className="
              mt-12 lg:mt-16
              mx-auto flex h-[67px] w-full max-w-[358px] items-center justify-center
              bg-brown-button text-center text-base font-medium uppercase tracking-wider text-brown-dark
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50
              focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg
              lg:h-[54px] lg:max-w-none lg:text-lg
            "
          >
            Перейти на актуальный адрес
          </Link>
        </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default NotFoundPage
