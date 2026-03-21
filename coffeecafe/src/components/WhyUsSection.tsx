/*
  WhyUsSection — секция «Почему мы».
  4 карточки с иконками в ряд (на мобилках — сетка 2x2).
  Иконки — SVG файлы из Figma.
  Заголовки карточек: Inter Regular 24px, описания: Inter Regular 18px.
*/

import coffeeBeans from '../assets/images/Coffee Beans.svg'
import armchair from '../assets/images/Armchair.svg'
import laptop from '../assets/images/Laptop.svg'
import address from '../assets/images/Address.svg'

const features = [
  {
    title: 'Качественный кофе',
    description: 'Мы готовим напитки из тщательно отобранных зерен',
    icon: coffeeBeans,
  },
  {
    title: 'Уютная атмосфера',
    description: 'У нас приятно встретиться с друзьями и просто отдохнуть',
    icon: armchair,
  },
  {
    title: 'Комфорт для работы',
    description: 'В кофейне быстрый Wi-Fi и удобные места с розетками',
    icon: laptop,
  },
  {
    title: 'Удобное расположение',
    description: 'Удобное расположение, чтобы зайти за кофе по пути',
    icon: address,
  },
]

function WhyUsSection() {
  return (
    <section className="bg-brown-bg py-16 md:py-24">
      <div className="px-4 md:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[36px] leading-tight">
          Почему мы
        </h2>

        {/* Сетка карточек: 2 колонки на мобилках, 4 на десктопе */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8 md:mt-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center mb-4">
                <img src={feature.icon} alt={feature.title} className="w-10 h-10" />
              </div>

              <h3 className="text-cream font-normal text-base md:text-2xl">
                {feature.title}
              </h3>

              <p className="text-cream-dark text-sm md:text-lg leading-relaxed mt-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUsSection
