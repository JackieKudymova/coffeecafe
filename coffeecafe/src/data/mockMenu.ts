/*
  Моковые данные меню.
  Когда будет бэкенд - эти данные будут приходить из API.
  Картинки: по одной на раздел (из assets).
  ingredients - текст для плашки «Состав» (показывается на карточке при наведении/тапе).
  allergen_milk / allergen_gluten / allergen_egg - флаги для фильтра аллергенов
  и для иконок-аллергенов в правом нижнем углу карточки.
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
        ingredients: 'Молотый кофе\nГорячая вода',
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
        ingredients: 'Молотый кофе\nГорячая вода',
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
        ingredients: 'Эспрессо\nМолоко\nМолочная пена',
        allergen_milk: true,
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
        ingredients: 'Эспрессо\nМолоко',
        allergen_milk: true,
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
        ingredients: 'Двойной эспрессо\nМолоко',
        allergen_milk: true,
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
        ingredients: 'Эспрессо\nСливки\nВанильный сахар',
        allergen_milk: true,
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
        ingredients: 'Сливочный сыр\nПеченье\nСахар\nЯйцо',
        allergen_milk: true,
        allergen_gluten: true,
        allergen_egg: true,
      },
      {
        id: 'brownie',
        name: 'Брауни',
        image: dessertsImg,
        variants: [{ label: '100 г', price: 200 }],
        ingredients: 'Шоколад\nМука\nСахар\nЯйцо\nСливочное масло',
        allergen_milk: true,
        allergen_gluten: true,
        allergen_egg: true,
      },
      {
        id: 'tiramisu',
        name: 'Тирамису',
        image: dessertsImg,
        variants: [{ label: '150 г', price: 250 }],
        ingredients: 'Маскарпоне\nСавоярди\nКофе\nЯйцо\nКакао',
        allergen_milk: true,
        allergen_gluten: true,
        allergen_egg: true,
      },
      {
        id: 'chocolate-truffle',
        name: 'Шоколадный трюфель',
        image: dessertsImg,
        variants: [{ label: '80 г', price: 210 }],
        ingredients: 'Тёмный шоколад\nСливки\nКакао',
        allergen_milk: true,
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
        ingredients: 'Мука\nСливочное масло\nДрожжи\nЯйцо',
        allergen_milk: true,
        allergen_gluten: true,
        allergen_egg: true,
      },
      {
        id: 'chocolate-pastry',
        name: 'Слойка с шоколадом',
        image: bakeryImg,
        variants: [{ label: '90 г', price: 180 }],
        ingredients: 'Слоёное тесто\nШоколад\nСливочное масло',
        allergen_milk: true,
        allergen_gluten: true,
      },
      {
        id: 'muffin',
        name: 'Маффин',
        image: bakeryImg,
        variants: [{ label: '100 г', price: 190 }],
        ingredients: 'Мука\nСахар\nЯйцо\nЯгоды',
        allergen_gluten: true,
        allergen_egg: true,
      },
      {
        id: 'cinnamon-bun',
        name: 'Булочка с корицей',
        image: bakeryImg,
        variants: [{ label: '100 г', price: 180 }],
        ingredients: 'Мука\nСахар\nКорица\nСливочное масло',
        allergen_milk: true,
        allergen_gluten: true,
      },
    ],
  },
]
