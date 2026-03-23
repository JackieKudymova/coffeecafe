/*
  MenuSection — секция «Наше меню».
  Десктоп (lg+): 4 квадратных карточки, кнопка 271×54.
  Мобилки: 2 колонки, увеличенные отступы от краёв.
  Подписи: Inter Regular 24px.
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
    <section id="menu" className="bg-brown-bg pt-12 lg:pt-[88px] pb-12 lg:pb-24">
      <div className="px-6 lg:px-16 xl:px-28">
        <h2 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight text-center lg:text-left">
          Наше меню
        </h2>

        {/* Сетка: 2 колонки на мобилках, 4 на десктопе */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-8 lg:mt-16">
          {menuCategories.map((category) => (
            <div key={category.title} className="text-center">
              {/* Квадратное фото */}
              <div className="aspect-square overflow-hidden rounded-[10px]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-cream font-normal text-xl lg:text-2xl mt-3 lg:mt-6">
                {category.title}
              </p>
            </div>
          ))}
        </div>

        {/* Кнопка 271×54 по центру */}
        <div className="mt-10 lg:mt-16 flex justify-center">
          <a
            href="#menu-full"
            className="
              inline-flex items-center justify-center
              bg-brown-button text-brown-dark font-medium
              rounded-[10px] uppercase tracking-wider
              transition-colors hover:bg-brown-button/90
              text-base py-[30px] w-full
              lg:text-lg lg:py-0 lg:w-[271px] lg:h-[54px]
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
