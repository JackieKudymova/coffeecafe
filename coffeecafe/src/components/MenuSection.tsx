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
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="31" height="15" viewBox="0 0 31 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30.5873 8.22016C31.1376 7.82245 31.1376 7.17755 30.5873 6.77984L21.6198 0.298285C21.0696 -0.0994283 20.1775 -0.0994283 19.6271 0.298285C19.0769 0.6961 19.0769 1.34089 19.6271 1.73861L27.5982 7.5L19.6271 13.2614C19.0769 13.6591 19.0769 14.3039 19.6271 14.7017C20.1775 15.0994 21.0696 15.0994 21.6198 14.7017L30.5873 8.22016ZM8.82833e-07 7.5V8.51847L29.5909 8.51847V7.5V6.48153L8.82833e-07 6.48153V7.5Z" fill="currentColor" />
    </svg>
  )
}

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
        <h2 className="font-heading font-normal text-cream text-[24px] md:text-[32px] lg:text-[36px] leading-tight text-center md:text-left uppercase">
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
                <ArrowIcon className="w-[20px] h-[40px] md:w-[31px] md:h-[15px] text-[#EFE7DD] group-active:text-[#EDC091] lg:group-hover:text-[#FDD4A9]" />
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
              lg:text-lg lg:min-h-0 lg:w-[280px] lg:h-[54px] rounded-[10px]
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
