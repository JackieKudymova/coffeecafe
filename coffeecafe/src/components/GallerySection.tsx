/*
  GallerySection — блок «Ждем вас в гости».
  Десктоп: сетка 3×2.
  480–1024: сетка 2×3.
  Мобилка < 480: карусель scroll-snap с точками поверх фото + автопрокрутка.
*/

import { useState, useEffect, useRef } from 'react'
import galleryEspresso from '../assets/images/gallery-espresso.png'
import galleryInterior from '../assets/images/gallery-interior.png'
import galleryCroissants from '../assets/images/gallery-croissants.png'
import galleryBarista from '../assets/images/gallery-barista.png'
import galleryLatte from '../assets/images/gallery-latte.png'
import galleryCounter from '../assets/images/gallery-counter.png'

const photos = [
  { src: galleryEspresso, alt: 'Приготовление эспрессо' },
  { src: galleryInterior, alt: 'Интерьер кафе' },
  { src: galleryCroissants, alt: 'Круассаны и кофе' },
  { src: galleryBarista, alt: 'Бариста' },
  { src: galleryLatte, alt: 'Латте-арт' },
  { src: galleryCounter, alt: 'Барная стойка' },
]

function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* Определяем какое фото видно при скролле */
  function handleScroll() {
    const container = scrollRef.current
    if (!container) return
    const slideWidth = container.clientWidth
    const index = Math.round(container.scrollLeft / slideWidth)
    setActiveIndex(index % photos.length)
  }

  /* Автопрокрутка каждые 4 секунды (бесконечная) */
  useEffect(() => {
    const timer = setInterval(() => {
      const container = scrollRef.current
      if (!container) return
      const slideWidth = container.clientWidth
      const nextIndex = activeIndex + 1

      if (nextIndex >= photos.length) {
        /* Возвращаемся к первому слайду */
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollTo({ left: slideWidth * nextIndex, behavior: 'smooth' })
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex])

  return (
    <section className="py-12 lg:pt-24 lg:pb-12">
      <div className="px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] leading-tight text-center min-[480px]:text-left lg:text-[36px] lg:leading-[48px]">
          Ждем вас в гости
        </h2>
      </div>

      {/* Мобилка < 480px: scroll-snap карусель */}
      <div className="min-[480px]:hidden mt-8 px-4">
        <div className="relative rounded-[10px] overflow-hidden">
          <div
            ref={scrollRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex"
            onScroll={handleScroll}
          >
            {photos.map((photo) => (
              <img
                key={photo.alt}
                src={photo.src}
                alt={photo.alt}
                className="snap-center shrink-0 w-full h-[240px] object-cover"
              />
            ))}
          </div>

          {/* Точки поверх фото */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {photos.map((photo, i) => (
              <button
                key={photo.alt}
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    left: scrollRef.current.clientWidth * i,
                    behavior: 'smooth',
                  })
                }}
                className={`w-[10px] h-[10px] rounded-full transition-colors ${
                  i === activeIndex ? 'bg-brown-button' : 'bg-cream'
                }`}
                aria-label={`Фото ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 480–1024px: сетка 2×3 */}
      <div className="hidden min-[480px]:grid lg:hidden grid-cols-2 gap-4 mt-8 px-4">
        {photos.map((photo) => (
          <img
            key={photo.alt}
            src={photo.src}
            alt={photo.alt}
            className="w-full aspect-[1/1] object-cover rounded-[10px]"
          />
        ))}
      </div>

      {/* Десктоп: сетка 3×2 */}
      <div className="hidden lg:grid grid-cols-3 gap-8 mt-[72px] px-16 xl:px-28">
        {photos.map((photo) => (
          <img
            key={photo.alt}
            src={photo.src}
            alt={photo.alt}
            className="w-full aspect-[384/480] object-cover rounded-[10px]"
          />
        ))}
      </div>
    </section>
  )
}

export default GallerySection
