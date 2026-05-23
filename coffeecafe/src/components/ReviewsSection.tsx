/*
  ReviewsSection - блок «Отзывы».
  Десктоп (lg+): 3 карточки в ряд.
  До десктопа: карусель scroll-snap с точками + автопрокрутка.
*/

import { useState, useRef, useEffect } from 'react'
import avatarEkaterina from '../assets/images/avatar-ekaterina.png'
import avatarVladimir from '../assets/images/avatar-vladimir.png'
import avatarDmitry from '../assets/images/avatar-dmitry.png'

const reviews = [
  {
    name: 'Екатерина Макеева',
    avatar: avatarEkaterina,
    text: 'Очень уютная кофейня. Отличное место, чтобы спокойно поработать за ноутбуком',
  },
  {
    name: 'Владимир Денисов',
    avatar: avatarVladimir,
    text: 'Люблю это место за уют и ароматный кофе. Десерты тоже очень вкусные',
  },
  {
    name: 'Дмитрий Летучий',
    avatar: avatarDmitry,
    text: 'Хорошая атмосфера, удобные столики и отличный капучино. Часто прихожу сюда поработать',
  },
]

function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    const container = scrollRef.current
    if (!container) return
    const slideWidth = container.clientWidth
    const index = Math.round(container.scrollLeft / slideWidth)
    setActiveIndex(index % reviews.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const container = scrollRef.current
      if (!container) return
      const slideWidth = container.clientWidth
      const nextIndex = activeIndex + 1
      if (nextIndex >= reviews.length) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollTo({ left: slideWidth * nextIndex, behavior: 'smooth' })
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex])

  return (
    <section className="pt-6 pb-[45px] md:pb-[56px] lg:pt-12 lg:pb-24">
      <div className="px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-normal text-cream text-[24px] md:text-[32px] leading-tight text-center min-[480px]:text-left lg:text-[36px] lg:leading-[48px] uppercase">
          Отзывы
        </h2>
      </div>

      {/* Карусель: от мобилок до десктопа */}
      <div className="lg:hidden mt-8 px-4">
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex"
            onScroll={handleScroll}
          >
            {reviews.map((review) => (
              <div key={review.name} className="snap-center shrink-0 w-full flex flex-col items-center justify-center text-center bg-[#120C09] py-10 px-8 rounded-[5px]">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover"
                />
                <h3 className="text-cream font-normal text-xl md:text-[22px] mt-6">{review.name}</h3>
                <p className="text-cream-dark text-base md:text-[17px] leading-[19px] md:leading-[21px] mt-4 max-w-[280px] md:max-w-[303px]">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Точки-индикаторы */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((review, i) => (
              <button
                key={review.name}
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    left: scrollRef.current.clientWidth * i,
                    behavior: 'smooth',
                  })
                }}
                className={`w-[10px] h-[10px] rounded-full transition-colors ${
                  i === activeIndex ? 'bg-brown-button' : 'bg-cream'
                }`}
                aria-label={`Отзыв ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Десктоп: 3 в ряд — та же сетка что и в GallerySection */}
      <div className="hidden lg:grid grid-cols-3 gap-8 mt-[72px] px-16 xl:px-28">
        {reviews.map((review) => (
          <div key={review.name} className="flex flex-col items-center justify-center text-center bg-[#120C09] py-10 px-8 rounded-[5px]">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-cream font-normal text-2xl mt-6">{review.name}</h3>
            <p className="text-cream-dark text-lg leading-[22px] mt-4">{review.text}</p>
          </div>
        ))}
      </div>

      {/*
        Призыв оставить отзыв в Яндекс Картах + кнопка-ссылка.
        Внешняя ссылка - обычный <a> с target="_blank" и rel="noopener noreferrer".
        Размеры по фреймам Figma:
          мобилка  - HF_phone_main.Group 1722.reviews: текст 20/24, кнопка 358×67
          планшет  - фрейма нет, по аналогии: текст 17/21, кнопка 386×67 (как hero)
          десктоп  - HF_desktop_main.reviews: текст 24/29, кнопка 280×56
      */}
      <div className="px-4 lg:px-16 xl:px-28 mt-12 lg:mt-[62px] flex flex-col items-center text-center">
        {/*
          Планшет (Hf_ipad_main, узел 951:6759): Inter Regular 22/26.625, ширина 416px,
          совпадает со шрифтом имени в карточке отзыва (узел 679:4436). До правки
          было 17/21 — это расходилось с макетом.
        */}
        <p className="text-cream font-normal text-xl md:text-[22px] lg:text-2xl leading-[24px] md:leading-[27px] lg:leading-[29px] max-w-[358px] md:max-w-[420px] lg:max-w-[454px]">
          Оставьте свой отзыв в Яндекс Картах!
        </p>
        <a
          href="https://yandex.ru/maps/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center justify-center
            mt-8 md:mt-10 lg:mt-9
            bg-brown-button text-brown-dark font-medium
            uppercase tracking-wider transition-colors
            hover:bg-brown-button-hover active:bg-brown-button-active
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
            text-base lg:text-lg rounded-[10px]
            w-full h-[67px]
            md:w-[386px] md:h-[67px]
            lg:w-[280px] lg:h-[56px]
          "
        >
          Перейти
        </a>
      </div>
    </section>
  )
}

export default ReviewsSection
