/*
  Типы для блока последней акции.
  Используются в PromoSection и в будущем API-запросе.
*/

export interface Promo {
  id: string
  title: string
  description: string
  image: string       // URL картинки (с бэкенда или из assets)
  link: string        // ссылка на полную страницу акции
}
