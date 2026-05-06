/*
  AuthPromoSection — промо-блок «Личный кабинет» перед PromoSection на главной.

  Тёмно-коричневый фон #4b372b (brown-footer), весь контент по центру.
  Размеры заголовка/подзаголовка/отступов — по фреймам Figma:
    мобилка  — HF_phone_main.Group 1722.news
    планшет  — macets_ipad.Hf_ipad_main.Group 1773 (но выравнивание центрируем,
               как на десктопе — по требованию заказчика)
    десктоп  — HF_desktop_main.news

  Кнопка ведёт на /login и подписана «ВОЙТИ».
  Ширина кнопки на каждом разрешении совпадает с hero-кнопкой того же экрана:
    mobile 358×67, tablet 386×67, desktop 280×54.
*/

import { Link } from 'react-router-dom'

function AuthPromoSection() {
  return (
    <section className="bg-[#4b372b]">
      <div
        className="
          px-4 lg:px-16 xl:px-28
          py-[84px] md:py-20 lg:py-[95px]
          flex flex-col items-center text-center
        "
      >
        <h2 className="font-heading font-semibold text-cream text-[28px] md:text-[32px] lg:text-[36px] leading-tight">
          Личный кабинет с постоянной скидкой
        </h2>

        <p className="text-cream-dark text-base md:text-[17px] lg:text-lg leading-[19px] md:leading-[21px] lg:leading-[22px] mt-6 lg:mt-8 max-w-[358px] md:max-w-[483px] lg:max-w-[526px]">
          Зарегистрируйтесь и получите личный кабинет с постоянной скидкой.
          Ваш индивидуальный номер — всегда с вами и работает при каждом заказе
        </p>

        {/* Ширина кнопки = hero-кнопка соответствующего разрешения */}
        <Link
          to="/login"
          className="
            inline-flex items-center justify-center
            mt-10 md:mt-14 lg:mt-9
            bg-brown-button text-brown-dark font-medium rounded-[10px]
            uppercase tracking-wider transition-colors
            hover:bg-brown-button-hover active:bg-brown-button-active
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
            text-base lg:text-lg
            w-[358px] h-[67px]
            md:w-[386px] md:h-[67px]
            lg:w-[280px] lg:h-[54px]
          "
        >
          Войти
        </Link>
      </div>
    </section>
  )
}

export default AuthPromoSection
