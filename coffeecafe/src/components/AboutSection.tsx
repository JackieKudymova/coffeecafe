/*
  AboutSection — секция «О нас» на главной.
  Десктоп: фото слева (594×640), текст + кнопка справа.
  Мобилки: фото сверху, текст снизу.
  Кнопка «Подробнее»: 280×54px, Inter Medium 18px.
*/

import aboutImg from '../assets/images/about.png'

function AboutSection() {
  return (
    <section id="about" className="bg-brown-bg pt-12 md:pt-24">
      <div className="px-6 md:px-28 flex flex-col md:flex-row gap-8 md:gap-24 items-center">

        {/* Фото — 594×640 в макете */}
        <div className="w-full md:w-auto md:shrink-0">
          <img
            src={aboutImg}
            alt="Бариста готовит кофе"
            className="w-full h-[300px] object-cover md:h-auto md:object-contain rounded-[10px] md:w-[594px]"
          />
        </div>

        {/* Текст */}
        <div className="w-full md:max-w-[488px]">
          <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[36px] leading-tight">
            О нас
          </h2>

          <p className="text-cream-dark text-base md:text-lg md:leading-[22px] mt-4 md:mt-20">
            Наша кофейня - это уютное пространство, где можно насладиться
            ароматным кофе и провести время в спокойной атмосфере, поработать
            за ноутбуком или встретиться с друзьями
          </p>

          <div className="mt-8 md:mt-16">
            <a
              href="#about-more"
              className="
                inline-flex items-center justify-center
                bg-brown-button text-brown-dark font-medium
                rounded-[10px] uppercase tracking-wider
                transition-colors hover:bg-brown-button/90
                text-base py-[30px] w-full
                md:text-lg md:py-0 md:w-[280px] md:h-[54px]
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
