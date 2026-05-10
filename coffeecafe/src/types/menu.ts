/*
  Типы для страницы меню.
  Используются в MenuPage и в будущем API-запросе.
  Все поля динамические - количество разделов, позиций и вариантов не ограничено.
*/

/* Вариант размера/веса позиции (напр. "200 мл" → 150₽) */
export interface MenuVariant {
  label: string    // "200 мл", "80 г", "1 шт" - любая единица измерения
  price: number    // цена в рублях
}

/* Позиция меню (напр. "Американо") */
export interface MenuItem {
  id: string
  name: string
  image: string           // URL картинки
  variants: MenuVariant[] // от 1 до N вариантов размера/веса
  /** Состав - показывается на сайте поверх фото при наведении/тапе. */
  ingredients?: string | null
  /** Аллергены: по одному флагу на каждый. От 0 до 3 иконок. */
  allergen_milk?: boolean
  allergen_gluten?: boolean
  allergen_egg?: boolean
}

/**
 * Ключи аллергенов для фильтра «Без молока / Без глютена / Без яиц».
 * Совпадают по имени с суффиксами полей allergen_milk / allergen_gluten / allergen_egg
 * в MenuItem - удобно строить ключ доступа динамически.
 */
export type Allergen = 'milk' | 'gluten' | 'egg'

/* Раздел меню (напр. "Кофе") */
export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]       // позиции в разделе
}

/** Deep-link на /menu: ?category=<id раздела>, напр. кофе */
export const MENU_CATEGORY_QUERY_KEY = 'category'
export const MENU_COFFEE_CATEGORY_ID = 'coffee'
