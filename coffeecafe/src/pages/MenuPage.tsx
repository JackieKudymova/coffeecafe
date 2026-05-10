/*
  MenuPage - страница «Меню».
  Полное меню кофейни с табами по разделам и фильтром по аллергенам.
  Данные загружаются через menuService (сейчас моковые, потом из API).
  Количество разделов, позиций и вариантов размеров - динамическое.

  Фильтр по аллергенам (AllergenFilter):
    Если пользователь выбирает «Без молока», скрываем все товары, у которых
    флаг allergen_milk = true. Логика «И» - товар проходит фильтр, только
    если ни одного из выбранных аллергенов в нём нет.
*/

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AllergenFilter from '../components/AllergenFilter'
import {
  type MenuCategory,
  type MenuItem,
  type Allergen,
  MENU_CATEGORY_QUERY_KEY,
} from '../types/menu'
import { fetchMenu } from '../services/menuService'
import milkIcon from '../assets/images/Milk Bottle.png'
import glutenIcon from '../assets/images/Gluten.png'
import eggIcon from '../assets/images/Egg.png'

function MenuPage() {
  const [searchParams] = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeTab, setActiveTab] = useState(0)
  /** Выбранные аллергены для фильтра «Без молока / без глютена / без яиц». */
  const [allergens, setAllergens] = useState<Allergen[]>([])

  useEffect(() => {
    const categoryId = searchParams.get(MENU_CATEGORY_QUERY_KEY)
    fetchMenu().then((data) => {
      setCategories(data)
      if (categoryId) {
        const idx = data.findIndex((c) => c.id === categoryId)
        if (idx >= 0) setActiveTab(idx)
      }
    })
  }, [searchParams])

  const activeCategory = categories[activeTab]

  /** Тоггл выбора чекбокса фильтра. */
  function toggleAllergen(key: Allergen) {
    setAllergens((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key],
    )
  }

  /**
   * Видимые позиции активной категории с учётом фильтра.
   * Если allergens пуст - показываем всё. Иначе скрываем позиции, у которых
   * хоть один из выбранных allergen_* = true.
   */
  const visibleItems = useMemo<MenuItem[]>(() => {
    if (!activeCategory) return []
    if (allergens.length === 0) return activeCategory.items
    return activeCategory.items.filter((item) => {
      if (allergens.includes('milk') && item.allergen_milk) return false
      if (allergens.includes('gluten') && item.allergen_gluten) return false
      if (allergens.includes('egg') && item.allergen_egg) return false
      return true
    })
  }, [activeCategory, allergens])

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] md:pt-[97px] lg:pt-[149px] pb-12 lg:pb-[97px]">
        {/* Заголовок */}
        <h1 className="font-heading font-normal text-cream text-[24px] md:text-[32px] lg:text-[36px] leading-tight uppercase">
          Меню
        </h1>

        {/* Табы разделов */}
        {categories.length > 0 && (
          <div className="mt-[30px] md:mt-8 lg:mt-12 overflow-x-auto scrollbar-hide">
            {/* Базовая линия - border контейнера; золотая полоска активного таба - span, на узком экране удлинена в половину gap-x-4 */}
            <div className="flex w-max min-w-full min-[520px]:w-full gap-x-4 min-[520px]:gap-0 border-b-2 border-[#4b372b]">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(i)}
                  className={`
                    shrink-0 min-w-[130px] min-[520px]:flex-1 min-[520px]:min-w-0 pb-[7px] text-center text-lg md:text-[22px] lg:text-2xl md:pb-3 lg:pb-4 px-4 min-[520px]:px-0
                    border-b-2 -mb-[2px] transition-colors cursor-pointer whitespace-nowrap relative z-0 rounded-none
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg
                    ${i === activeTab
                      ? 'text-cream font-medium border-transparent z-[1]'
                      : 'text-cream font-normal border-transparent hover:border-[#4b372b] hover:font-medium active:text-cream'
                    }
                  `}
                >
                  {cat.name}
                  {i === activeTab && (
                    <span
                      aria-hidden
                      className={[
                        'pointer-events-none absolute -bottom-0.5 z-[1] h-0.5 bg-[#c49a6c]',
                        'min-[520px]:left-0 min-[520px]:right-0',
                        i > 0 ? 'max-[519px]:-left-2' : 'max-[519px]:left-0',
                        i < categories.length - 1 ? 'max-[519px]:-right-2' : 'max-[519px]:right-0',
                      ].join(' ')}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Фильтр по аллергенам — между табами и сеткой карточек.
            Отступ от табов: мобилка 24px / планшет 32px / десктоп 33px (по макету Figma). */}
        {categories.length > 0 && (
          <div className="mt-6 md:mt-8 lg:mt-[33px]">
            <AllergenFilter selected={allergens} onToggle={toggleAllergen} />
          </div>
        )}

        {/* Сетка карточек: 1 колонка мобилка, 2 планшет, 3 десктоп.
            Отступ от фильтра: мобилка 32px / планшет 40px / десктоп 39px (по макету).
            Планшет (md): по Figma Hf_ipad_menu - gap 16px по горизонтали, 32px по вертикали. */}
        {activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-x-4 md:gap-y-8 lg:gap-x-8 lg:gap-y-[50px] mt-8 md:mt-10 lg:mt-[39px]">
            {visibleItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

/*
  Карточка позиции меню.
  Десктоп: при наведении на фото показывается состав (если он есть).
  Планшет/мобилка: переключение по тапу на фото - touch-устройства не умеют
  hover, поэтому используем onClick.
  Иконки-аллергены - отдельная колонка в правом нижнем углу карточки
  (по макету Figma: ниже фото, справа от блока с ценами/названием).
  Заполняются СНИЗУ ВВЕРХ: при одной иконке она внизу, добавление следующей
  ставит её ВЫШЕ предыдущей; порядок при всех трёх - milk → gluten → egg.
*/
function MenuItemCard({ item }: { item: MenuItem }) {
  /** Открыт ли поп-ап «состав» по тапу (мобилка/планшет). На десктопе используется hover через CSS. */
  const [tapOpen, setTapOpen] = useState(false)

  // Порядок сверху вниз: молоко → глютен → яйца (по макету Figma).
  // «Заполнение снизу вверх» получается за счёт абсолютного позиционирования
  // колонки у нижнего края карточки: при одной иконке она в самом низу,
  // при двух - добавленная встаёт ниже, и т.д.
  const allergens: { src: string; alt: string }[] = []
  if (item.allergen_milk) allergens.push({ src: milkIcon, alt: 'Молоко' })
  if (item.allergen_gluten) allergens.push({ src: glutenIcon, alt: 'Глютен' })
  if (item.allergen_egg) allergens.push({ src: eggIcon, alt: 'Яйца' })

  const hasIngredients = Boolean(item.ingredients && item.ingredients.trim())

  return (
    <div className="relative">
      {/*
        Изображение - пропорция 3:2, скруглённые углы.
        group/photo нужен, чтобы на десктопе менять видимость состава по hover.
        На тач-устройствах состав показывается через состояние tapOpen.
      */}
      <div
        className="group/photo relative aspect-[3/2] overflow-hidden rounded-[10px]"
        onClick={() => {
          if (hasIngredients) setTapOpen((v) => !v)
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/*
          Поп-ап «Состав». По макету Figma (Hf_ipad_menu → Slot → Inside):
          - фон #cfc6bb (кремовый), текст brown-dark (#2a1c17);
          - сверху заголовок «Состав:» (22px), под ним список ингредиентов (17px)
            по левому краю, переносы строк сохраняются (whitespace-pre-line);
          - внутренний отступ 16px (p-4).
          Виден на десктопе по hover, на мобилке/планшете - по tapOpen.
        */}
        {hasIngredients && (
          <div
            className={`
              absolute inset-0 bg-[#cfc6bb] flex flex-col gap-2 p-4
              overflow-y-auto transition-opacity duration-200
              ${tapOpen ? 'opacity-100' : 'opacity-0'}
              lg:opacity-0 lg:group-hover/photo:opacity-100
            `}
            aria-hidden={!tapOpen}
          >
            <span className="text-brown-dark text-lg md:text-[22px] leading-[1.2]">
              Состав:
            </span>
            <p className="text-brown-dark text-sm md:text-[17px] leading-[1.25] whitespace-pre-line">
              {item.ingredients}
            </p>
          </div>
        )}
      </div>

      {/* Название позиции. 30px от фото */}
      <h3 className="text-cream font-normal text-lg md:text-[22px] lg:text-2xl mt-3 md:mt-4 lg:mt-[20px]">
        {item.name}
      </h3>

      {/* Варианты: 2 строки (объём + цена). 25px от названия, 15px между строками */}
      {/* На мобилке колонки 55px + gap 8px (как в Figma), на md+ - 104px без gap-x */}
      <div
        className="mt-[10px] md:mt-2 lg:mt-[7px] grid gap-y-[3px] gap-x-2 md:gap-x-0 [grid-template-columns:repeat(var(--cols),55px)] md:[grid-template-columns:repeat(var(--cols),104px)]"
        style={{ ['--cols' as string]: item.variants.length } as React.CSSProperties}
      >
        {/* Строка 1: объёмы/вес */}
        {item.variants.map((v) => (
          <span key={v.label} className="text-[#a8a5a1] text-[13px] md:text-[14px] lg:text-base whitespace-nowrap">
            {v.label}
          </span>
        ))}
        {/* Строка 2: цены */}
        {item.variants.map((v) => (
          <span key={v.label + v.price} className="text-cream font-medium text-[20px] md:text-[22px] lg:text-xl whitespace-nowrap">
            {v.price} ₽
          </span>
        ))}
      </div>

      {/*
        Иконки-аллергены: столбик в правом нижнем углу карточки (по макету).
        Размер 24×24 (десктоп/планшет), 20×20 (мобилка); расстояние между иконками 11px.
        absolute + bottom-0/right-0 даёт «прилипание» к нижнему правому углу карточки -
        одна иконка оказывается в самом низу, при добавлении следующая встаёт сверху.
      */}
      {allergens.length > 0 && (
        <div className="absolute bottom-0 right-0 flex flex-col gap-[11px] pointer-events-none">
          {allergens.map((a) => (
            <img
              key={a.alt}
              src={a.src}
              alt={a.alt}
              title={a.alt}
              className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 object-contain"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuPage
