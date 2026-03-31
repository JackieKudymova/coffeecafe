/*
  Моковые данные меню.
  Когда будет бэкенд — эти данные будут приходить из API.
  Картинки: по одной на раздел (из assets).
*/

import type { MenuCategory } from '../types/menu'
import coffeeImg from '../assets/images/menu-coffee.png'
import teaImg from '../assets/images/menu-tea.png'
import dessertsImg from '../assets/images/menu-desserts.png'
import bakeryImg from '../assets/images/menu-bakery.png'

export const mockMenu: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'Кофе',
    items: [
      {
        id: 'espresso',
        name: 'Эспрессо',
        image: coffeeImg,
        variants: [{ label: '30 мл', price: 120 }],
      },
      {
        id: 'americano',
        name: 'Американо',
        image: coffeeImg,
        variants: [
          { label: '200 мл', price: 150 },
          { label: '300 мл', price: 170 },
          { label: '400 мл', price: 190 },
        ],
      },
      {
        id: 'cappuccino',
        name: 'Капучино',
        image: coffeeImg,
        variants: [
          { label: '200 мл', price: 170 },
          { label: '300 мл', price: 190 },
          { label: '400 мл', price: 210 },
        ],
      },
      {
        id: 'latte',
        name: 'Латте',
        image: coffeeImg,
        variants: [
          { label: '250 мл', price: 180 },
          { label: '350 мл', price: 200 },
          { label: '450 мл', price: 220 },
        ],
      },
      {
        id: 'flat-white',
        name: 'Флэт Уайт',
        image: coffeeImg,
        variants: [
          { label: '200 мл', price: 190 },
          { label: '300 мл', price: 210 },
          { label: '400 мл', price: 230 },
        ],
      },
      {
        id: 'raf',
        name: 'Раф',
        image: coffeeImg,
        variants: [
          { label: '250 мл', price: 210 },
          { label: '350 мл', price: 230 },
          { label: '450 мл', price: 250 },
        ],
      },
    ],
  },
  {
    id: 'tea',
    name: 'Чай',
    items: [
      {
        id: 'black-tea',
        name: 'Черный чай',
        image: teaImg,
        variants: [
          { label: '300 мл', price: 150 },
          { label: '400 мл', price: 170 },
          { label: '500 мл', price: 190 },
        ],
      },
      {
        id: 'green-tea',
        name: 'Зеленый чай',
        image: teaImg,
        variants: [
          { label: '300 мл', price: 150 },
          { label: '400 мл', price: 170 },
          { label: '500 мл', price: 190 },
        ],
      },
      {
        id: 'herbal-tea',
        name: 'Травяной чай',
        image: teaImg,
        variants: [
          { label: '300 мл', price: 160 },
          { label: '400 мл', price: 180 },
          { label: '500 мл', price: 200 },
        ],
      },
      {
        id: 'fruit-tea',
        name: 'Фруктовый чай',
        image: teaImg,
        variants: [
          { label: '300 мл', price: 170 },
          { label: '400 мл', price: 190 },
          { label: '500 мл', price: 210 },
        ],
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Десерты',
    items: [
      {
        id: 'cheesecake',
        name: 'Чизкейк',
        image: dessertsImg,
        variants: [{ label: '150 г', price: 240 }],
      },
      {
        id: 'brownie',
        name: 'Брауни',
        image: dessertsImg,
        variants: [{ label: '100 г', price: 200 }],
      },
      {
        id: 'tiramisu',
        name: 'Тирамису',
        image: dessertsImg,
        variants: [{ label: '150 г', price: 250 }],
      },
      {
        id: 'chocolate-truffle',
        name: 'Шоколадный трюфель',
        image: dessertsImg,
        variants: [{ label: '80 г', price: 210 }],
      },
    ],
  },
  {
    id: 'bakery',
    name: 'Выпечка',
    items: [
      {
        id: 'croissant',
        name: 'Круассан',
        image: bakeryImg,
        variants: [{ label: '80 г', price: 170 }],
      },
      {
        id: 'chocolate-pastry',
        name: 'Слойка с шоколадом',
        image: bakeryImg,
        variants: [{ label: '90 г', price: 180 }],
      },
      {
        id: 'muffin',
        name: 'Маффин',
        image: bakeryImg,
        variants: [{ label: '100 г', price: 190 }],
      },
      {
        id: 'cinnamon-bun',
        name: 'Булочка с корицей',
        image: bakeryImg,
        variants: [{ label: '100 г', price: 180 }],
      },
    ],
  },
]
