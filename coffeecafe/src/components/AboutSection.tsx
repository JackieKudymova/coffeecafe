/*
  AboutSection — секция «О нас» на главной.
  Десктоп: фото слева (594×640), текст + кнопка справа.
  Мобилки: фото сверху, текст снизу.
  Кнопка «Подробнее»: 280×54px, Inter Medium 18px.
*/

import aboutImg from '../assets/images/about.png'

function AboutSection() {
  return (
    <section id="about" className="bg-brown-bg pt-12 lg:pt-24">
      <div className="px-6 lg:px-16 xl:px-28 flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-24 items-center lg:justify-center">

        {/* Фото — уменьшено на lg, полный размер на xl */}
        <div className="w-full lg:w-auto lg:shrink-0">
          <img
            src={aboutImg}
            alt="Бариста готовит кофе"
            className="w-full h-[300px] object-cover lg:h-auto lg:object-contain rounded-[10px] lg:w-[380px] xl:w-[594px]"
          />
        </div>

        {/* Текст */}
        <div className="w-full lg:max-w-[360px] xl:max-w-[488px]">
          <h2 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight">
            О нас
          </h2>

          <p className="text-cream-dark text-base lg:text-lg lg:leading-[22px] mt-4 lg:mt-20">
            Наша кофейня - это уютное пространство, где можно насладиться
            ароматным кофе и провести время в спокойной атмосфере, поработать
            за ноутбуком или встретиться с друзьями
          </p>

          <div className="mt-8 lg:mt-16">
            <a
              href="#about-more"
              className="
                inline-flex items-center justify-center
                bg-brown-button text-brown-dark font-medium
                rounded-[10px] uppercase tracking-wider
                transition-colors hover:bg-brown-button/90
                text-base py-[30px] w-full
                lg:text-lg lg:py-0 lg:w-[280px] lg:h-[54px]
              "
            >
              Подробнее
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
