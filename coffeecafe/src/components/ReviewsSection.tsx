/*
  ReviewsSection — блок «Отзывы».
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
    <section className="py-6 lg:pt-12 lg:pb-24">
      <div className="px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] leading-tight text-center min-[480px]:text-left lg:text-[36px] lg:leading-[48px]">
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
              <div key={review.name} className="snap-center shrink-0 w-full flex flex-col items-center text-center">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <h3 className="text-cream font-normal text-xl mt-6">{review.name}</h3>
                <p className="text-cream-dark text-base leading-[19px] mt-4 max-w-[280px]">{review.text}</p>
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

      {/* Десктоп: 3 в ряд */}
      <div className="hidden lg:flex gap-[72px] mt-[72px] px-16 xl:px-28 justify-center">
        {reviews.map((review) => (
          <div key={review.name} className="flex flex-col items-center text-center w-[308px]">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-cream font-normal text-2xl mt-8">{review.name}</h3>
            <p className="text-cream-dark text-lg leading-[22px] mt-4 max-w-[308px]">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewsSection
