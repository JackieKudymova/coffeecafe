/*
  Моковые данные для блока последней акции.
  Используются как заглушка, пока бэкенд не подключён
  или если API не отвечает.
*/

import type { Promo } from '../types/promo'
import coffeeNewsImage from '../assets/images/coffee_news.png'
import { PROMO_NEWS_ID } from './mockNews'

export const fallbackPromo: Promo = {
  id: 'default',
  title: 'Скидка на утренний кофе',
  description:
    'Начните день с чашки ароматного кофе. В утренние часы действует специальная цена на кофейные напитки',
  image: coffeeNewsImage,
  link: `/news/${PROMO_NEWS_ID}`,
}
