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

      {/* Мобилка / планшет: обычный flex. md: — размеры из iPad-макета */}
      <div className="lg:hidden px-4">
        <img
          src={aboutImg}
          alt="Бариста готовит кофе"
          className="w-full h-[300px] md:h-[338px] object-cover rounded-[10px]"
        />

        <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[32px] leading-tight mt-8">
          О нас
        </h2>

        <p className="text-cream-dark text-base md:text-[17px] md:leading-[21px] mt-4">
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
              text-base min-h-[67px] w-full
              md:min-h-[67px] md:w-[386px] md:h-[67px]
            "
          >
            Подробнее
          </Link>
        </div>
      </div>

      {/*
        Десктоп: 12-колоночная сетка 1fr с gap-8 (по фрейму HF_desktop_main.about us).
        Фото — col 1-6 (592px при 1440), текст с кнопкой — col 7-12 (тоже 592px),
        зазор между ними 32px. Текст по вертикальному центру картинки.
      */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 px-16 xl:px-28">
        {/* Фото — 6 колонок из 12 */}
        <div className="col-span-6">
          <img
            src={aboutImg}
            alt="Бариста готовит кофе"
            className="w-full h-auto object-contain rounded-[10px]"
          />
        </div>

        {/* Текст + кнопка — оставшиеся 6 колонок, по вертикальному центру картинки */}
        <div className="col-span-6 self-center">
          <h2 className="font-heading font-semibold text-cream text-[36px] leading-tight">
            О нас
          </h2>

          {/*
            По фрейму: gap h1→p ~29px, p→button ~56px.
            max-w-[592px] + tracking-[-0.005em] — зафиксированная ширина параграфа
            из Figma, чтобы перенос строк не зависел от ширины окна (на широких
            экранах колонка тянется, и без max-width текст переносится иначе).
            Лёгкий минусовой трекинг компенсирует разницу шейпинга Inter
            между Figma и браузерами.
          */}
          <p className="text-cream-dark text-lg leading-[22px] tracking-[-0.005em] mt-7 max-w-[588px]">
            Наша кофейня - это уютное пространство, где можно насладиться
            ароматным кофе и провести время в спокойной атмосфере, поработать
            за ноутбуком или встретиться с друзьями
          </p>

          <div className="mt-14">
            <Link
              to="/about"
              className="
                inline-flex items-center justify-center
                bg-brown-button text-brown-dark font-medium
                rounded-[10px] uppercase tracking-wider
                transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                text-lg w-[339px] h-[54px]
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
