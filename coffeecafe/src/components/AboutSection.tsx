/*
  AboutSection — секция «О нас» на главной.
  Десктоп: 12-колоночная сетка — фото (кол. 1-6), текст + кнопка (кол. 8-12).
  Мобилки: фото сверху, текст снизу.
  Кнопка «Подробнее»: 280×54px, Inter Medium 18px.
*/

import { Link } from 'react-router-dom'
import aboutImg from '../assets/images/about.png'

function AboutSection() {
  return (
    <section id="about" className="bg-brown-bg pt-12 lg:pt-24">

      {/* Мобилка: обычный flex */}
      <div className="lg:hidden px-4">
        <img
          src={aboutImg}
          alt="Бариста готовит кофе"
          className="w-full h-[300px] object-cover rounded-[10px]"
        />

        <h2 className="font-heading font-semibold text-cream text-[28px] leading-tight mt-8">
          О нас
        </h2>

        <p className="text-cream-dark text-base mt-4">
          Наша кофейня - это уютное пространство, где можно насладиться
          ароматным кофе и провести время в спокойной атмосфере, поработать
          за ноутбуком или встретиться с друзьями
        </p>

        <div className="mt-8">
          <Link
            to="/about"
            className="
              inline-flex items-center justify-center
              bg-brown-button text-brown-dark font-medium
              rounded-[10px] uppercase tracking-wider
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              text-base py-[30px] w-full
            "
          >
            Подробнее
          </Link>
        </div>
      </div>

      {/*
        Десктоп: flex-раскладка по размерам из Figma.
        Фото 48.85% (594px из 1216), зазор 8.4% (102px), текст — остаток (488px).
        Текст начинается с правого края 7-й колонки сетки (696px от левого края контента).
      */}
      <div className="hidden lg:flex px-16 xl:px-28">
        {/* Фото — 594px при 1440, масштабируется пропорционально */}
        <div className="w-[48.85%] shrink-0">
          <img
            src={aboutImg}
            alt="Бариста готовит кофе"
            className="w-full h-auto object-contain rounded-[10px]"
          />
        </div>

        {/* Текст + кнопка — зазор 8.4% от ширины контента (102px при 1440) */}
        <div className="ml-[8.4%] flex-1 flex flex-col justify-center">
          <h2 className="font-heading font-semibold text-cream text-[36px] leading-tight">
            О нас
          </h2>

          <p className="text-cream-dark text-lg leading-[22px] mt-20">
            Наша кофейня - это уютное пространство, где можно насладиться
            ароматным кофе и провести время в спокойной атмосфере, поработать
            за ноутбуком или встретиться с друзьями
          </p>

          <div className="mt-16">
            <Link
              to="/about"
              className="
                inline-flex items-center justify-center
                bg-brown-button text-brown-dark font-medium
                rounded-[10px] uppercase tracking-wider
                transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                text-lg w-[280px] h-[54px]
              "
            >
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
