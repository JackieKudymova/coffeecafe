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
    <section className="relative w-full h-[480px] flex items-center overflow-hidden">

      {/* Фоновое изображение (если есть) */}
      {promo.image && (
        <img
          src={promo.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Затемняющий overlay — 60% чёрного поверх фото */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Контент */}
      <div className="relative z-10 px-6 lg:px-16 xl:px-28 w-full">
        <h2 className="font-heading font-semibold text-cream text-[24px] min-[405px]:text-[28px] leading-tight md:text-[36px] md:leading-[48px]">
          {promo.title}
        </h2>

        <p className="text-cream-dark text-base md:text-lg md:leading-[22px] mt-4 md:mt-8 max-w-[358px] md:max-w-[526px]">
          {promo.description}
        </p>

        <div className="mt-8 md:mt-14">
          <a
            href={promo.link}
            className="inline-block bg-brown-button text-brown-dark font-medium rounded-[10px] text-center uppercase tracking-wider transition-colors hover:bg-brown-button/90
              text-base py-[30px] w-full max-w-[358px]
              md:text-lg md:py-4 md:w-[271px]"
          >
            Подробнее
          </a>
        </div>
      </div>
    </section>
  )
}

export default PromoSection
