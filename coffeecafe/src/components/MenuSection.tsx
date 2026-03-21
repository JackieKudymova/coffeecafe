/*
  MenuSection — секция «Наше меню».
  4 карточки с фото категорий + кнопка «Смотреть меню».
  Подписи категорий: Inter Regular 24px.
  На мобилках — сетка 2x2.
*/

import coffeeImg from '../assets/images/menu-coffee.png'
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
    <section id="menu" className="bg-brown-bg py-16 md:py-24">
      <div className="px-4 md:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[36px] leading-tight">
          Наше меню
        </h2>

        {/* Сетка категорий: 2 колонки на мобилках, 4 на десктопе */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12">
          {menuCategories.map((category) => (
            <div key={category.title} className="text-center">
              <img
                src={category.image}
                alt={category.title}
                className="w-full rounded-[10px]"
              />
              <p className="text-cream font-normal text-base md:text-2xl mt-3">
                {category.title}
              </p>
            </div>
          ))}
        </div>

        {/* Кнопка — с обводкой, как в макете */}
        <div className="mt-10 md:mt-12 flex justify-center">
          <a
            href="#menu-full"
            className="
              inline-block bg-transparent border border-brown-button
              text-brown-button font-medium rounded-[10px]
              text-center uppercase tracking-wider
              transition-colors hover:bg-brown-button hover:text-brown-dark
              text-base md:text-lg py-4 px-16
            "
          >
            Смотреть меню
          </a>
        </div>
      </div>
    </section>
  )
}

export default MenuSection
