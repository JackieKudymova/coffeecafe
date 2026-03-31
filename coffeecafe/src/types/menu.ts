/*
  Типы для страницы меню.
  Используются в MenuPage и в будущем API-запросе.
  Все поля динамические — количество разделов, позиций и вариантов не ограничено.
*/

/* Вариант размера/веса позиции (напр. "200 мл" → 150₽) */
export interface MenuVariant {
  label: string    // "200 мл", "80 г", "1 шт" — любая единица измерения
  price: number    // цена в рублях
}

/* Позиция меню (напр. "Американо") */
export interface MenuItem {
  id: string
  name: string
  image: string           // URL картинки
  variants: MenuVariant[] // от 1 до N вариантов размера/веса
}

/* Раздел меню (напр. "Кофе") */
export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]       // позиции в разделе
}
