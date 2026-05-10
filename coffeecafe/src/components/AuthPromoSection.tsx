/*
  AuthPromoSection - промо-блок «Личный кабинет» сразу после Hero на главной.

  Тёмно-коричневый фон #4b372b, контент по центру. Блок сужен до ширины из макета:
    мобилка  - HF_phone_main.news (390×393, блок 358, pad 16/56)
    планшет  - macets_ipad.Hf_ipad_main.Group 1773 (820×311, блок 597, pad 112/40)
    десктоп  - HF_desktop_main.LK (1440×346, блок 825, pad 308/64)

  Подзаголовок шире, чем раньше (max-w 672 на десктопе) - на десктопе текст
  занимает две строки, а не три.
  Кнопка: mobile 358×67, tablet 386×67, desktop 280×54.
*/

import { Link } from 'react-router-dom'

function AuthPromoSection() {
  return (
    <section className="bg-[#4b372b]">
      <div className="px-4 md:px-6 lg:px-16 py-14 md:py-10 lg:py-16">
        <div className="mx-auto max-w-[358px] md:max-w-[760px] lg:max-w-[860px] flex flex-col items-center text-center">
          {/* Капс на всех брейкпоинтах (по правке от дизайнера). */}
          <h2 className="font-heading font-normal text-cream uppercase text-[24px] leading-[31px] md:text-[32px] md:leading-[42px] lg:text-[36px] lg:leading-[47px]">
            Личный кабинет с постоянной скидкой
          </h2>

          <p className="text-cream-dark text-base md:text-[17px] lg:text-lg leading-[19px] md:leading-[21px] lg:leading-[22px] mt-6 md:mt-5 lg:mt-8 max-w-[358px] md:max-w-[483px] lg:max-w-[672px]">
            Зарегистрируйтесь и получите личный кабинет с постоянной скидкой.
            Ваш индивидуальный номер - всегда с вами и работает при каждом заказе
          </p>

          <Link
            to="/register"
            className="
              inline-flex items-center justify-center
              mt-10 md:mt-10 lg:mt-10
              bg-brown-button text-brown-dark font-medium rounded-[10px]
              uppercase tracking-wider transition-colors
              hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
              text-base lg:text-lg
              w-full h-[67px]
              md:w-[386px] md:h-[67px]
              lg:w-[280px] lg:h-[54px]
            "
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AuthPromoSection
