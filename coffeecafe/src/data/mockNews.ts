/*
  Моковые новости — четыре заглушки для вёрстки и демо.
  Когда бэкенд будет готов — данные придут из API, структура NewsArticle та же.
*/

import type { NewsArticle } from '../types/news'
import coffeeNews from '../assets/images/coffee_news.png'
import menuCoffee from '../assets/images/menu-coffee.png'
import menuTea from '../assets/images/menu-tea.png'
import menuDesserts from '../assets/images/menu-desserts.png'

const imgs = [coffeeNews, menuCoffee, menuTea, menuDesserts]

const longBody = [
  'Мы рады сообщить, что в «ДомКофе» действует специальное предложение для гостей.',
  'Подробности акции и сроки действия уточняйте у бариста или в наших соцсетях.',
  'Следите за обновлениями — скоро будет ещё больше интересных событий.',
]

function makeArticle(
  index: number,
  id: string,
  title: string,
  excerpt: string,
  date: string,
): NewsArticle {
  return {
    id,
    title,
    excerpt,
    image: imgs[index % imgs.length],
    publishedAt: date,
    content: [
      ...longBody,
      `Это новость № ${index + 1}. Текст приходит с сервера и может быть любой длины.`,
    ],
  }
}

/* Совпадает с промо-блоком на главной (ссылка в mockPromo). */
export const PROMO_NEWS_ID = '550e8400-e29b-41d4-a716-446655440001'

export const mockNews: NewsArticle[] = [
  makeArticle(
    0,
    PROMO_NEWS_ID,
    'Скидка на утренний кофе',
    'Каждое утро с 8:00 до 11:00 в нашей кофейне действует скидка 10% на все кофейные напитки. Это отличная возможность начать день с любимого напитка.',
    '2026-03-03',
  ),
  makeArticle(
    1,
    '550e8400-e29b-41d4-a716-446655440002',
    'Новая сезонная выпечка',
    'К ближайшим выходным мы добавили в меню круассаны с миндалём и вишнёвый пирог. Заходите пробовать — количество ограничено.',
    '2026-03-01',
  ),
  makeArticle(
    2,
    '550e8400-e29b-41d4-a716-446655440003',
    'Вечер джаза в кофейне',
    'По пятницам с 19:00 играет живая музыка. Вход свободный, столик лучше забронировать заранее.',
    '2026-02-28',
  ),
  makeArticle(
    3,
    '550e8400-e29b-41d4-a716-446655440004',
    'Обновление зернового меню',
    'Появились новые сорта арабики из Эфиопии и Колумбии. Спросите бариста о вкусовых нотах.',
    '2026-02-25',
  ),
]
