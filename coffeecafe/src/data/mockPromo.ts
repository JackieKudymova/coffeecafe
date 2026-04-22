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
    'Каждое утро с 8:00 до 11:00 в нашей кофейне действует скидка 10% на все кофейные напитки. Это отличная возможность начать день с чашки ароматного кофе по приятной цене',
  image: coffeeNewsImage,
  link: `/news/${PROMO_NEWS_ID}`,
}
