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

      <main className="px-4 lg:px-16 xl:px-28 pt-[112px] lg:pt-[149px] pb-12 lg:pb-24">
        {/* Заголовок */}
        <h1 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight">
          Меню
        </h1>

        {/* Табы разделов */}
        {categories.length > 0 && (
          <div className="mt-6 lg:mt-12 flex overflow-x-auto scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(i)}
                className={`
                  flex-1 min-w-[100px] pb-4 text-center text-base lg:text-2xl
                  border-b-2 transition-colors cursor-pointer whitespace-nowrap
                  ${i === activeTab
                    ? 'text-cream font-medium border-[#c49a6c]'
                    : 'text-cream font-normal border-[#4b372b] hover:text-cream/80'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Сетка карточек: 1 колонка мобилка, 3 десктоп */}
        {activeCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-x-8 lg:gap-y-10 mt-8 lg:mt-10">
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

      {/* Название позиции */}
      <h3 className="text-cream font-normal text-lg lg:text-2xl mt-3 lg:mt-4">
        {item.name}
      </h3>

      {/* Варианты: 2 строки (объём + цена). Колонки 104px = шаг сетки страницы */}
      <div
        className="mt-1 lg:mt-2 grid"
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
