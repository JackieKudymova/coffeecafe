import { Link } from 'react-router-dom'
import heroBg from '../assets/images/hero-bg.jpg'
import heroBgMobile from '../assets/images/hero-bg-mobile.jpg'
import { MENU_CATEGORY_QUERY_KEY, MENU_COFFEE_CATEGORY_ID } from '../types/menu'

/*
  HeroSection - первый экран (hero-блок).
*/

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Адаптивное фоновое изображение */}
      <picture>
        <source media="(max-width: 767px)" srcSet={heroBgMobile} />
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[60%_10%] lg:object-center"
        />
      </picture>

      {/* Пустышка высотой шапки — отодвигает область контента вниз */}
      <div className="h-[57px] md:h-[67px] lg:h-[77px] shrink-0" />

      {/* Контент — центрируется в пространстве под шапкой */}
      <div className="relative z-10 px-4 lg:px-16 xl:px-28 w-full flex-1 flex flex-col justify-center">
        <h1 className="font-heading font-normal text-cream text-[34px] leading-[1.33] md:text-[40px] md:leading-[53px] lg:text-[48px] lg:leading-[64px] tracking-[0.68px] md:tracking-[0.8px] lg:tracking-[0.96px] uppercase text-center min-[480px]:text-left max-w-[358px] md:max-w-none mx-auto min-[480px]:mx-0">
          Больше, чем просто кофе
        </h1>

        <p className="text-cream-dark font-normal text-base md:text-[17px] lg:text-lg leading-[19px] md:leading-[21px] lg:leading-[22px] mt-6 lg:mt-6 text-center min-[480px]:text-left max-w-[310px] md:max-w-[475px] mx-auto min-[480px]:mx-0">
          Уютное пространство для отдыха, общения и работы
        </p>

        <div className="mt-14 lg:mt-16 flex justify-center min-[480px]:justify-start">
          <Link
            to={`/menu?${MENU_CATEGORY_QUERY_KEY}=${MENU_COFFEE_CATEGORY_ID}`}
            className="
              bg-brown-button text-brown-dark font-medium rounded-[10px]
              text-center uppercase tracking-wider transition-colors
              hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              text-base leading-[19px] py-6 w-full max-w-[358px]
              md:inline-flex md:items-center md:justify-center md:py-0 md:leading-normal md:w-[386px] md:max-w-none md:h-[67px]
              lg:inline-flex lg:items-center lg:justify-center
              lg:text-lg lg:py-0 lg:w-[280px] lg:h-[54px]
            "
          >
            Смотреть меню
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
