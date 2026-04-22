/*
  PromoSection — блок последней акции.

  Получает данные через promoService (сейчас моковые, потом с бэкенда).
  Если картинка есть — показывает её фоном с затемнением.
  Если нет — просто тёмный фон.
*/

import { useEffect, useState } from 'react'
import type { Promo } from '../types/promo'
import { fetchLatestPromo } from '../services/promoService'

function PromoSection() {
  const [promo, setPromo] = useState<Promo | null>(null)

  useEffect(() => {
    fetchLatestPromo().then(setPromo)
  }, [])

  // Пока данные не загрузились — ничего не показываем
  if (!promo) return null

  return (
    <section className="relative w-full min-h-[400px] md:h-[411px] lg:h-[480px] flex items-center overflow-hidden py-12 md:py-0">

      {/* Фоновое изображение (если есть) */}
      {promo.image && (
        <img
          src={promo.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[70%_30%] md:object-center"
        />
      )}

      {/* Затемняющий overlay — 60% чёрного поверх фото */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Контент */}
      <div className="relative z-10 px-4 lg:px-16 xl:px-28 w-full">
        <h2 className="font-heading font-semibold text-cream text-[28px] leading-tight md:text-[32px] md:leading-tight lg:text-[36px] lg:leading-[48px]">
          {promo.title}
        </h2>

        <p className="text-cream-dark text-base md:text-[17px] md:leading-[21px] lg:text-lg lg:leading-[22px] mt-6 md:mt-8 max-w-[526px] md:max-w-[483px] lg:max-w-[526px]">
          {promo.description}
        </p>

        <div className="mt-10 md:mt-10 lg:mt-14">
          <a
            href={promo.link}
            className="inline-block bg-brown-button text-brown-dark font-medium rounded-[10px] text-center uppercase tracking-wider transition-colors hover:bg-brown-button-hover active:bg-brown-button-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              text-base py-[30px] w-full
              min-[480px]:text-lg min-[480px]:py-0 min-[480px]:w-[280px] min-[480px]:h-[54px] min-[480px]:inline-flex min-[480px]:items-center min-[480px]:justify-center
              md:text-base md:w-[386px] md:h-[67px] lg:text-lg lg:w-[280px] lg:h-[54px]"
          >
            Подробнее
          </a>
        </div>
      </div>
    </section>
  )
}

export default PromoSection
