import heroBg from '../assets/images/hero-bg.jpg'
import heroBgMobile from '../assets/images/hero-bg-mobile.jpg'

/*
  HeroSection — первый экран (hero-блок).
*/

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Адаптивное фоновое изображение */}
      <picture>
        <source media="(max-width: 767px)" srcSet={heroBgMobile} />
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[60%_10%] lg:object-center"
        />
      </picture>

      {/* Контент */}
      <div className="relative z-10 px-4 lg:px-16 xl:px-28 w-full">
        <h1 className="font-heading font-semibold text-cream text-[34px] leading-[1.33] lg:text-[48px] lg:leading-[64px] tracking-[0.68px] lg:tracking-[0.96px] text-center min-[480px]:text-left max-w-[358px] lg:max-w-none mx-auto min-[480px]:mx-0">
          Больше, чем просто кофе
        </h1>

        <p className="text-cream-dark font-normal text-base lg:text-lg leading-[19px] lg:leading-[22px] mt-6 lg:mt-3 text-center min-[480px]:text-left max-w-[310px] lg:max-w-[475px] mx-auto min-[480px]:mx-0">
          Уютное пространство для отдыха, общения и работы
        </p>

        <div className="mt-14 lg:mt-12 flex justify-center min-[480px]:justify-start">
          <a
            href="#menu"
            className="
              bg-brown-button text-brown-dark font-medium rounded-[10px]
              text-center uppercase tracking-wider transition-colors
              hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              text-base py-[30px] w-[358px]
              lg:inline-flex lg:items-center lg:justify-center
              lg:text-lg lg:py-0 lg:w-[280px] lg:h-[54px]
            "
          >
            Смотреть меню
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
