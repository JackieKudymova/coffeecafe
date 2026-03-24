/*
  AboutPage — страница «О нас».
  Десктоп (xl 1280+): фото и текст по колонкам, размеры по макету Figma.
  Промежуточный (lg 1024–1280): уменьшенные шрифты, процентные пропорции.
  Мобилки (<1024): одна колонка, всё по порядку.
*/

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

import baristaImg from '../assets/images/about_us_barista.png'
import coffeeImg from '../assets/images/abous_us_coffee.png'
import lavkaImg from '../assets/images/about_us_lavka.png'

function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Отступ от шапки: мобилка 64px, десктоп ~96px */}
      <main className="px-4 lg:px-16 xl:px-28 pt-16 lg:pt-32 pb-12 lg:pb-24">

        {/* === Строка 1: Заголовок + вводный текст | Фото бариста === */}
        <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-24">

          {/* Левая колонка: заголовок + текст */}
          <div className="lg:w-[38%] lg:shrink-0">
            <h1 className="font-heading font-semibold text-cream text-[28px] lg:text-[32px] xl:text-[36px] leading-tight">
              О нас
            </h1>

            <p className="text-cream-dark text-base lg:text-base xl:text-lg xl:leading-[22px] mt-8 lg:mt-12">
              ДомКофе - небольшая городская кофейня, куда можно зайти за чашкой
              хорошего кофе и сделать паузу в течение дня. Мы стараемся создать
              приятную атмосферу, в которой гости могут встретиться с друзьями,
              поработать за ноутбуком или просто провести немного времени за
              любимым напитком. В нашем меню - классические кофейные напитки,
              чай, десерты и свежая выпечка.
            </p>
          </div>

          {/* Правая колонка: фото бариста (на одной линии с заголовком) */}
          <div className="mt-6 lg:mt-0 lg:w-[48%] lg:ml-auto">
            <img
              src={baristaImg}
              alt="Бариста за работой"
              className="w-full h-[240px] lg:h-[312px] object-cover rounded-[10px]"
            />
          </div>
        </div>

        {/* === Строка 2: Фото кофе (десктоп) | Два текстовых блока (текст по центру) === */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-12 mt-6 lg:mt-20 xl:mt-24">

          {/* Фото кофе — ТОЛЬКО на десктопе */}
          <div className="lg:w-[48%] lg:shrink-0 hidden lg:block">
            <img
              src={coffeeImg}
              alt="Приготовление кофе"
              className="w-full h-[400px] object-cover rounded-[10px]"
            />
          </div>

          {/* Два текстовых блока */}
          <div className="lg:flex-1">
            <p className="text-cream-dark text-base lg:text-base xl:text-lg xl:leading-[22px]">
              Наши бариста постоянно совершенствуют свои навыки, пробуют новые
              способы приготовления кофе и внимательно следят за качеством
              каждого напитка. Благодаря их опыту и вниманию к деталям гости
              могут наслаждаться насыщенным вкусом и ароматом свежесваренного
              кофе.
            </p>

            <p className="text-cream-dark text-base lg:text-base xl:text-lg xl:leading-[22px] mt-4 lg:mt-6 xl:mt-8">
              ДомКофе - это команда людей, которые искренне любят своё дело.
              Мы стараемся создавать атмосферу, в которой приятно проводить
              время, и уделяем внимание качеству напитков и ингредиентов. Для
              нас важно, чтобы каждый гость чувствовал себя комфортно, а визит
              в кофейню оставлял только приятные впечатления. Мы всегда рады
              помочь вам выбрать напиток по вкусу.
            </p>
          </div>
        </div>

        {/* === Фото кофе — ТОЛЬКО на мобилке (перед философией) === */}
        <div className="mt-8 lg:hidden">
          <img
            src={coffeeImg}
            alt="Приготовление кофе"
            className="w-full h-[240px] object-cover rounded-[10px]"
          />
        </div>

        {/* === Наша философия === */}
        <div className="mt-8 lg:mt-16 xl:mt-20">
          <h2 className="text-cream font-normal text-xl lg:text-[22px] xl:text-2xl">
            Наша философия:
          </h2>

          <p className="text-cream-dark text-base lg:text-base xl:text-lg xl:leading-[22px] mt-4 lg:mt-6 lg:max-w-[592px]">
            Мы верим, что кофейня - это больше, чем просто место, где готовят
            кофе. Это пространство для встреч, отдыха и небольших пауз в
            течение дня. Поэтому мы уделяем внимание качеству ингредиентов,
            атмосфере и сервису, чтобы каждое посещение оставляло приятное
            впечатление.
          </p>
        </div>

        {/* === Широкое фото лавки === */}
        <div className="mt-10 lg:mt-16 xl:mt-20">
          <img
            src={lavkaImg}
            alt="Интерьер кофейни"
            className="w-full h-[240px] lg:h-[464px] object-cover rounded-[10px]"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
