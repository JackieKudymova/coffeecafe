/*
  AboutSection — секция «О нас» на главной.
  Десктоп: фото слева, текст + кнопка справа.
  Мобилки: фото сверху, текст снизу.
*/

import aboutImg from '../assets/images/about.png'

function AboutSection() {
  return (
    <section id="about" className="bg-brown-bg py-16 md:py-24">
      <div className="px-4 md:px-28 flex flex-col md:flex-row gap-8 md:gap-16 items-center">

        {/* Фото */}
        <div className="w-full md:w-1/2">
          <img
            src={aboutImg}
            alt="Бариста готовит кофе"
            className="w-full h-[300px] object-cover md:h-auto md:object-contain rounded-[10px] md:max-w-[640px]"
          />
        </div>

        {/* Текст */}
        <div className="w-full md:w-1/2">
          <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[36px] leading-tight">
            О нас
          </h2>

          <p className="text-cream-dark text-base md:text-lg leading-relaxed mt-4 md:mt-6 max-w-[488px]">
            Наша кофейня - это уютное пространство, где можно насладиться
            ароматным кофе и провести время в спокойной атмосфере, поработать
            за ноутбуком или встретиться с друзьями
          </p>

          <div className="mt-8">
            <a
              href="#about-more"
              className="
                inline-block bg-brown-button text-brown-dark font-medium
                rounded-[10px] text-center uppercase tracking-wider
                transition-colors hover:bg-brown-button/90
                text-base md:text-lg py-4 px-16
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
