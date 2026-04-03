/*
  MenuPage — страница «Меню».
  Полное меню кофейни с табами по разделам.
  Данные загружаются через menuService (сейчас моковые, потом из API).
  Количество разделов, позиций и вариантов размеров — динамическое.
*/

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { MenuCategory, MenuItem } from '../types/menu'
import { fetchMenu } from '../services/menuService'

function MenuPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    fetchMenu().then((data) => {
      setCategories(data)
    })
  }, [])

  const activeCategory = categories[activeTab]

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] lg:pt-[149px] pb-12 lg:pb-[97px]">
        {/* Заголовок */}
        <h1 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight">
          Меню
        </h1>

        {/* Табы разделов */}
        {categories.length > 0 && (
          <div className="mt-[30px] lg:mt-12 overflow-x-auto scrollbar-hide">
            {/* Одна сплошная линия на контейнере; gap только между подписями, не между сегментами border */}
            <div className="flex w-max min-w-full min-[520px]:w-full gap-x-4 min-[520px]:gap-0 border-b-2 border-[#4b372b]">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(i)}
                  className={`
                    shrink-0 min-w-[130px] min-[520px]:flex-1 min-[520px]:min-w-0 pb-[7px] text-center text-lg lg:text-2xl lg:pb-4 px-4 min-[520px]:px-0
                    border-b-2 -mb-[2px] transition-colors cursor-pointer whitespace-nowrap relative z-0
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg rounded-sm
                    ${i === activeTab
                      ? 'text-cream font-medium border-[#c49a6c] z-[1]'
                      : 'text-cream font-normal border-transparent hover:border-[#4b372b] hover:font-medium active:text-cream'
                    }
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Сетка карточек: 1 колонка мобилка, 3 десктоп */}
        {activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-[50px] mt-8 lg:mt-10">
            {activeCategory.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

/* Карточка позиции меню */
function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div>
      {/* Изображение — пропорция 3:2, скруглённые углы */}
      <div className="aspect-[3/2] overflow-hidden rounded-[10px]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Название позиции. 30px от фото */}
      <h3 className="text-cream font-normal text-lg lg:text-2xl mt-3 lg:mt-[20px]">
        {item.name}
      </h3>

      {/* Варианты: 2 строки (объём + цена). 25px от названия, 15px между строками */}
      <div
        className="mt-[10px] lg:mt-[7px] grid gap-y-[3px]"
        style={{ gridTemplateColumns: `repeat(${item.variants.length}, 104px)` }}
      >
        {/* Строка 1: объёмы/вес */}
        {item.variants.map((v) => (
          <span key={v.label} className="text-[#a8a5a1] text-sm lg:text-base whitespace-nowrap">
            {v.label}
          </span>
        ))}
        {/* Строка 2: цены */}
        {item.variants.map((v) => (
          <span key={v.label + v.price} className="text-cream font-medium text-base lg:text-xl whitespace-nowrap">
            {v.price} ₽
          </span>
        ))}
      </div>
    </div>
  )
}

export default MenuPage
