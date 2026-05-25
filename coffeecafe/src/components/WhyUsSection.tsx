/*
  WhyUsSection - секция «Почему мы».
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
    description: 'Мы готовим кофе из самых тщательно отобранных зерен',
    icon: coffeeBeans,
  },
  {
    title: 'Уютная атмосфера',
    description: 'У нас можно отдохнуть, встретиться с друзьями',
    icon: armchair,
  },
  {
    title: 'Комфорт для работы',
    description: 'В кофейне быстрый Wi-Fi, удобные места с розетками',
    icon: laptop,
  },
  {
    title: 'Удобное расположение',
    description: 'Удобное расположение,\nчтобы зайти за кофе по пути',
    icon: address,
  },
]

function WhyUsSection() {
  return (
    <section className="bg-brown-bg pt-12 lg:pt-24">
      <div className="px-6 md:px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-normal text-cream text-[24px] md:text-[32px] lg:text-[36px] leading-tight text-center md:text-left uppercase tracking-[0.02em]">
          Почему мы
        </h2>

        {/* Одна колонка на мобилках, 2×2 на планшете, 4 в ряд на десктопе.
            На планшете плитки суженные (~280px, как в Figma), по центру своей ячейки. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-y-10 mt-8 md:mt-14 lg:mt-16">
          {features.map((feature) => (
            <div key={feature.title} className="text-center md:max-w-[280px] md:mx-auto lg:max-w-none">
              {/* Иконка: 48px мобилки, 56px планшет, 64px десктоп */}
              <div className="flex justify-center mb-6 lg:mb-8">
                <img src={feature.icon} alt={feature.title} className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
              </div>

              <h3 className="text-cream font-normal text-xl md:text-[22px] lg:text-lg xl:text-2xl whitespace-nowrap">
                {feature.title}
              </h3>

              <p className="text-cream-dark text-base md:text-[17px] md:leading-[21px] lg:text-sm xl:text-lg lg:leading-[20px] xl:leading-[22px] mt-4 max-w-[240px] md:max-w-[280px] lg:max-w-none mx-auto whitespace-pre-line">
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
