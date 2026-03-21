/*
  WhyUsSection — секция «Почему мы».
  Десктоп: 4 карточки в ряд, иконки 64×64, карточки 280px.
  Мобилки: 2 колонки, иконки 48×48, увеличенные отступы от краёв.
  Заголовки: Inter Regular 24px, описания: Inter Regular 18px.
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
    <section className="bg-brown-bg pt-12 md:pt-24">
      <div className="px-6 md:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[36px] leading-tight text-center md:text-left">
          Почему мы
        </h2>

        {/* Одна колонка на мобилках, 4 на десктопе */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8 md:mt-16">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              {/* Иконка: 48px мобилки, 64px десктоп */}
              <div className="flex justify-center mb-6 md:mb-8">
                <img src={feature.icon} alt={feature.title} className="w-12 h-12 md:w-16 md:h-16" />
              </div>

              <h3 className="text-cream font-normal text-xl md:text-2xl">
                {feature.title}
              </h3>

              <p className="text-cream-dark text-base md:text-lg md:leading-[22px] mt-4 max-w-[240px] md:max-w-none mx-auto">
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
