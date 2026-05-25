/*
  GallerySection - блок «Ждем вас в гости».
  Десктоп: сетка 3×2.
  480-1024: сетка 2×3.
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
    <section className="pt-12 pb-6 lg:pt-24 lg:pb-12">
      <div className="px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-normal text-cream text-[24px] md:text-[32px] leading-tight text-center min-[480px]:text-left lg:text-[36px] lg:leading-[48px] uppercase tracking-[0.02em]">
          Ждем вас в гости
        </h2>
      </div>

      {/* Мобилка < 480px: scroll-snap карусель */}
      <div className="min-[480px]:hidden mt-8 px-4">
        <div className="relative overflow-hidden">
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
                className="snap-center shrink-0 w-full h-[240px] object-cover rounded-[5px]"
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

      {/* 480-1024px: 2 колонки с кастомными пропорциями */}
      <div className="hidden min-[480px]:grid lg:hidden grid-cols-2 gap-4 mt-8 px-4">
        {/* Колонка 1 */}
        <div className="flex flex-col gap-4">
          <img src={galleryEspresso} alt="Приготовление эспрессо" className="w-full aspect-[386/537] object-cover rounded-[5px]" />
          <img src={galleryCroissants} alt="Круассаны и кофе" className="w-full aspect-[386/362] object-cover rounded-[5px]" />
          <img src={galleryLatte} alt="Латте-арт" className="w-full aspect-[386/541] object-cover rounded-[5px]" />
        </div>
        {/* Колонка 2 */}
        <div className="flex flex-col gap-4">
          <img src={galleryInterior} alt="Интерьер кафе" className="w-full aspect-[386/256] object-cover rounded-[5px]" />
          <img src={galleryBarista} alt="Бариста" className="w-full aspect-[386/447] object-cover rounded-[5px]" />
          <img src={galleryCounter} alt="Барная стойка" className="w-full aspect-[386/737] object-cover rounded-[5px]" />
        </div>
      </div>

      {/* Десктоп: 3 колонки, у каждой фото свои пропорции */}
      <div className="hidden lg:grid grid-cols-3 gap-4 mt-[72px] px-16 xl:px-28">
        {/* Колонка 1 */}
        <div className="flex flex-col gap-4">
          <img src={galleryEspresso} alt="Приготовление эспрессо" className="w-full aspect-[384/320] object-cover rounded-[5px]" />
          <img src={galleryBarista} alt="Бариста" className="w-full aspect-[384/668] object-cover rounded-[5px]" />
        </div>
        {/* Колонка 2 */}
        <div className="flex flex-col gap-4">
          <img src={galleryInterior} alt="Интерьер кафе" className="w-full aspect-[384/582] object-cover rounded-[5px]" />
          <img src={galleryCroissants} alt="Круассаны и кофе" className="w-full aspect-[384/406] object-cover rounded-[5px]" />
        </div>
        {/* Колонка 3 */}
        <div className="flex flex-col gap-4">
          <img src={galleryLatte} alt="Латте-арт" className="w-full aspect-[384/494] object-cover rounded-[5px]" />
          <img src={galleryCounter} alt="Барная стойка" className="w-full aspect-[384/494] object-cover rounded-[5px]" />
        </div>
      </div>
    </section>
  )
}

export default GallerySection
