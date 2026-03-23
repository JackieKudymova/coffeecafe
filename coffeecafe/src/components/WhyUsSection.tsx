/*
  WhyUsSection — секция «Почему мы».
  Десктоп (lg+): 4 карточки в ряд, иконки 64×64.
  Мобилки: 1 колонка, иконки 48×48.
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
    <section className="bg-brown-bg pt-12 lg:pt-24">
      <div className="px-6 lg:px-16 xl:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight text-center lg:text-left">
          Почему мы
        </h2>

        {/* Одна колонка на мобилках, 4 на десктопе */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8 lg:mt-16">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              {/* Иконка: 48px мобилки, 64px десктоп */}
              <div className="flex justify-center mb-6 lg:mb-8">
                <img src={feature.icon} alt={feature.title} className="w-12 h-12 lg:w-16 lg:h-16" />
              </div>

              <h3 className="text-cream font-normal text-xl lg:text-base xl:text-2xl">
                {feature.title}
              </h3>

              <p className="text-cream-dark text-base lg:text-sm xl:text-lg lg:leading-[20px] xl:leading-[22px] mt-4 max-w-[240px] lg:max-w-none mx-auto">
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
