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
          className="absolute inset-0 w-full h-full object-cover object-[60%_10%] md:object-center"
        />
      </picture>

      {/* Градиент сверху — плавный переход от тёмного (safe-area) к изображению */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brown-bg to-transparent z-[1]" />

      {/* Контент */}
      <div className="relative z-10 px-4 md:px-28 w-full">
        <h1 className="font-heading font-semibold text-cream text-[34px] leading-[1.33] md:text-[48px] md:leading-[64px] tracking-[0.68px] md:tracking-[0.96px] text-center min-[480px]:text-left max-w-[358px] md:max-w-[616px] mx-auto min-[480px]:mx-0">
          Больше, чем просто кофе
        </h1>

        <p className="text-cream-dark font-normal text-base md:text-lg leading-[19px] md:leading-[22px] mt-6 md:mt-3 text-center min-[480px]:text-left max-w-[310px] md:max-w-[475px] mx-auto min-[480px]:mx-0">
          Уютное пространство для отдыха, общения и работы
        </p>

        <div className="mt-14 md:mt-12 flex justify-center min-[480px]:justify-start">
          <a
            href="#menu"
            className="
              bg-brown-button text-brown-dark font-medium rounded-[10px]
              text-center uppercase tracking-wider transition-colors
              hover:bg-brown-button/90
              text-base py-[30px] w-[358px]
              md:text-lg md:py-4 md:w-[271px]
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
