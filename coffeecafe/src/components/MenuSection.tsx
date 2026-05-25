/*
  MenuSection - секция «Наше меню».
  Десктоп (lg+): 4 квадратных карточки, кнопка 271×54.
  Мобилки: 2 колонки, увеличенные отступы от краёв.
  Подписи: Inter Regular 24px.
*/

import { Link } from 'react-router-dom'
import coffeeImg from '../assets/images/menu-coffee.png'
import { MENU_CATEGORY_QUERY_KEY, MENU_COFFEE_CATEGORY_ID } from '../types/menu'
import teaImg from '../assets/images/menu-tea.png'
import dessertsImg from '../assets/images/menu-desserts.png'
import bakeryImg from '../assets/images/menu-bakery.png'
import arrowIcon from '../assets/images/menu-strelka.svg'

const menuCategories = [
  { title: 'Кофе', image: coffeeImg, id: 'coffee' },
  { title: 'Чай', image: teaImg, id: 'tea' },
  { title: 'Десерты', image: dessertsImg, id: 'desserts' },
  { title: 'Выпечка', image: bakeryImg, id: 'bakery' },
]

function MenuSection() {
  return (
    <section id="menu" className="bg-brown-bg pt-12 lg:pt-[88px] pb-12 lg:pb-24">
      <div className="px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-normal text-cream text-[24px] md:text-[32px] lg:text-[36px] leading-tight text-center md:text-left uppercase tracking-[0.02em]">
          Наше меню
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-8 md:mt-10 lg:mt-16">
          {menuCategories.map((category) => (
            <Link
              key={category.title}
              to={`/menu?${MENU_CATEGORY_QUERY_KEY}=${category.id}`}
              className="group block bg-[#120C09] border border-transparent transition-colors active:border-[#EDC091] lg:hover:border-[#FDD4A9] rounded-[5px]"
            >
              <div className="aspect-square md:aspect-[386/311] overflow-hidden py-[40px] md:py-[56px] lg:py-[40px] flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between px-[13px] pb-4 md:pb-6 md:px-10 lg:px-5">
                <span className="text-cream font-normal text-[20px] md:text-[22px] lg:text-2xl">
                  {category.title}
                </span>
                <img
                  src={arrowIcon}
                  alt=""
                  aria-hidden
                  className="w-[20px] md:w-[31px] group-hover:[filter:brightness(0)_saturate(100%)_invert(87%)_sepia(19%)_saturate(611%)_hue-rotate(330deg)_brightness(107%)] group-active:[filter:brightness(0)_saturate(100%)_invert(87%)_sepia(19%)_saturate(611%)_hue-rotate(330deg)_brightness(107%)]"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Кнопка 271×54 по центру; планшет - 386×67 */}
        <div className="mt-10 md:mt-12 lg:mt-16 flex justify-center">
          <Link
            to={`/menu?${MENU_CATEGORY_QUERY_KEY}=${MENU_COFFEE_CATEGORY_ID}`}
            className="
              inline-flex items-center justify-center
              bg-brown-button text-brown-dark font-medium
              uppercase tracking-wider
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              text-base min-h-[67px] w-full
              md:min-h-[67px] md:w-[386px] md:h-[67px]
              lg:text-lg lg:min-h-0 lg:w-[280px] lg:h-[54px] rounded-[5px]
            "
          >
            Смотреть меню
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MenuSection
