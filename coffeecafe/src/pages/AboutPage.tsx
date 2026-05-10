/*
  AboutPage - страница «О нас» (новая версия по макетам Figma).
  Макеты:
    - HF_desktop_about us (1440x1782): 2 колонки + полноширинный баннер
        ЛЕВАЯ:  «О нас» (Nunito 36/49) → подзаголовок «ДомКофе - твоя пауза»
                (Inter 24/29) → параграф (Inter 18/22) → большое фото 592×456
        ПРАВАЯ: фото 592×287 → подзаголовок «Кофе и выпечка...» → параграф
                → подзаголовок «Внимание к деталям» → параграф
    - Hf_ipad_about us (820x1795): однопотоково - h1, 3 раздела с фото 788×280
      между ними, баннер; шрифты Nunito 32 / Inter 22 / Inter 17.
    - HF_phone_about_us (390x1666): однопотоково - h1, 3 раздела с фото 358×240,
      баннер; шрифты Nunito 24 / Inter 20 / Inter 16.

  Внизу всех макетов - баннер с фото-фоном (opacity 0.5) и надписью
  «ДомКофе - пауза в ритме города» (Nunito) по центру. Баннер примыкает
  к подвалу без отступа.

  Изображения:
    coffeeImg  = unsplash:ZwzB7C8lPDI (латте-арт)  - десктоп правая колонка / моб./план. раздел 1
    baristaImg = unsplash:UBoH66BA48c (бариста)    - десктоп левая колонка / моб./план. раздел 2
    lavkaImg   = unsplash:Kwdp-0pok-I (интерьер)   - баннер
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

      {/* pb-0 - баннер примыкает к футеру по макету */}
      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] md:pt-[98px] lg:pt-[149px] pb-0">

        {/* === Мобилка / планшет: однопотоково === */}
        <div className="lg:hidden">
          <h1 className="font-heading font-normal text-cream text-[24px] md:text-[32px] leading-[33px] md:leading-[44px] uppercase">
            О нас
          </h1>

          {/* Раздел 1: ДомКофе - твоя пауза + параграф + фото латте-арт */}
          <h2 className="text-cream font-normal text-xl md:text-[22px] leading-[24px] md:leading-[27px] mt-[35px] md:mt-[30px]">
            ДомКофе - твоя пауза в ритме города
          </h2>
          <p className="text-cream-dark text-base md:text-[17px] leading-[19px] md:leading-[21px] mt-4">
            Здесь берут кофе на ходу или остаются поработать, встретиться с
            друзьями, побыть в моменте.
          </p>
          <img
            src={coffeeImg}
            alt="Латте-арт в чашке кофе"
            className="w-full h-[240px] md:h-[280px] object-cover rounded-[10px] mt-4"
          />

          {/* Раздел 2: Кофе и выпечка + параграф + фото барист */}
          <h2 className="text-cream font-normal text-xl md:text-[22px] leading-[24px] md:leading-[27px] mt-6 md:mt-8">
            Кофе и выпечка, к которым возвращаются
          </h2>
          <p className="text-cream-dark text-base md:text-[17px] leading-[19px] md:leading-[21px] mt-4">
            У нас меню с кофе, чаем, десертами и свежей выпечкой из
            качественных ингредиентов для вкусных и комфортных визитов.
          </p>
          <img
            src={baristaImg}
            alt="Бариста за приготовлением кофе"
            className="w-full h-[240px] md:h-[280px] object-cover rounded-[10px] mt-4"
          />

          {/* Раздел 3: Внимание к деталям (без отдельного фото - дальше баннер).
              ВАЖНО: в Figma на мобилке и планшете текст параграфа отличается. */}
          <h2 className="text-cream font-normal text-xl md:text-[22px] leading-[24px] md:leading-[27px] mt-6 md:mt-8">
            Внимание к деталям
          </h2>
          {/* Мобилка (HF_phone_about_us): сокращённая версия */}
          <p className="md:hidden text-cream-dark text-base leading-[19px] mt-4">
            Мы внимательно ведём каждый этап приготовления и делаем кофе с
            заботой - о вкусе и вашем комфорте у нас.
          </p>
          {/* Планшет (Hf_ipad_about us): полная версия */}
          <p className="hidden md:block text-cream-dark md:text-[17px] md:leading-[21px] mt-4">
            Мы внимательно относимся к каждому этапу приготовления и стараемся
            создавать атмосферу, в которой приятно проводить время.
          </p>

          {/* Баннер: 358×240 (моб) / 788×280 (план), фото 50% opacity + надпись по центру */}
          <div className="relative mt-6 md:mt-4">
            <img
              src={lavkaImg}
              alt="Интерьер кофейни"
              className="w-full h-[240px] md:h-[280px] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <p className="font-heading font-normal text-cream text-[24px] md:text-[32px] leading-[33px] md:leading-[44px] text-center uppercase max-w-[289px] md:max-w-[597px]">
                ДомКофе - пауза в ритме города
              </p>
            </div>
          </div>
        </div>

        {/* === Десктоп (lg+): 2 колонки + полноширинный баннер === */}
        <div className="hidden lg:block">
          <div className="flex gap-8">

            {/* Левая колонка: h1 «О нас» + раздел 1 + большое фото бариста */}
            <div className="flex-1">
              <h1 className="font-heading font-normal text-cream text-[36px] leading-[49px] uppercase">
                О нас
              </h1>
              <h2 className="text-cream font-normal text-2xl leading-[29px] mt-[46px]">
                ДомКофе - твоя пауза в ритме города
              </h2>
              <p className="text-cream-dark text-lg leading-[22px] mt-6">
                Здесь берут кофе на ходу или остаются поработать, встретиться
                с друзьями, побыть в моменте.
              </p>
              {/* Большой gap 143px - чтобы фото визуально опустилось ниже текста (по макету) */}
              <img
                src={baristaImg}
                alt="Бариста за приготовлением кофе"
                className="w-full h-[456px] object-cover rounded-[10px] mt-[143px]"
              />
            </div>

            {/* Правая колонка: фото латте-арт + 2 подраздела */}
            <div className="flex-1">
              <img
                src={coffeeImg}
                alt="Латте-арт в чашке кофе"
                className="w-full h-[287px] object-cover rounded-[10px]"
              />
              {/* Большой gap 151px - чтобы текст опустился ниже фото и выровнялся с левым (по макету) */}
              <h2 className="text-cream font-normal text-2xl leading-[29px] mt-[151px]">
                Кофе и выпечка, к которым возвращаются
              </h2>
              <p className="text-cream-dark text-lg leading-[22px] mt-6">
                У нас меню с кофе, чаем, десертами и свежей выпечкой из
                качественных ингредиентов для вкусных и комфортных визитов.
              </p>
              <h2 className="text-cream font-normal text-2xl leading-[29px] mt-8">
                Внимание к деталям
              </h2>
              <p className="text-cream-dark text-lg leading-[22px] mt-6">
                Мы внимательно относимся к каждому этапу приготовления и
                стараемся создавать атмосферу, в которой приятно проводить
                время.
              </p>
            </div>
          </div>

          {/* Баннер во всю ширину контента (1216×462), 48px от низа левой колонки */}
          <div className="relative mt-12">
            <img
              src={lavkaImg}
              alt="Интерьер кофейни"
              className="w-full h-[462px] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-heading font-normal text-cream text-[36px] leading-[49px] text-center uppercase max-w-[672px]">
                ДомКофе - пауза в ритме города
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
