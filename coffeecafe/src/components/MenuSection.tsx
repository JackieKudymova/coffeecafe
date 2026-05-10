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

const menuCategories = [
  { title: 'Кофе', image: coffeeImg },
  { title: 'Чай', image: teaImg },
  { title: 'Десерты', image: dessertsImg },
  { title: 'Выпечка', image: bakeryImg },
]

function MenuSection() {
  return (
    <section id="menu" className="bg-brown-bg pt-12 lg:pt-[88px] pb-12 lg:pb-24">
      <div className="px-4 lg:px-16 xl:px-28">
        <h2 className="font-heading font-normal text-cream text-[24px] md:text-[32px] lg:text-[36px] leading-tight text-center md:text-left uppercase">
          Наше меню
        </h2>

        {/* Сетка: 2 колонки на мобилках, 2 на планшете, 4 на десктопе.
            Планшет (md): по Figma Hf_ipad_main - gap 16px по горизонтали, 24px по вертикали. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-4 md:gap-y-6 lg:gap-8 mt-8 md:mt-10 lg:mt-16">
          {menuCategories.map((category) => (
            <div key={category.title} className="text-center">
              {/* Квадратное фото; на планшете 316px высота под макет */}
              <div className="aspect-square md:aspect-auto md:h-[316px] overflow-hidden rounded-[10px]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-cream font-normal text-xl md:text-[22px] lg:text-2xl mt-3 md:mt-4 lg:mt-6">
                {category.title}
              </p>
            </div>
          ))}
        </div>

        {/* Кнопка 271×54 по центру; планшет - 386×67 */}
        <div className="mt-10 md:mt-12 lg:mt-16 flex justify-center">
          <Link
            to={`/menu?${MENU_CATEGORY_QUERY_KEY}=${MENU_COFFEE_CATEGORY_ID}`}
            className="
              inline-flex items-center justify-center
              bg-brown-button text-brown-dark font-medium
              rounded-[10px] uppercase tracking-wider
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              text-base min-h-[67px] w-full
              md:min-h-[67px] md:w-[386px] md:h-[67px]
              lg:text-lg lg:min-h-0 lg:w-[280px] lg:h-[54px]
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
