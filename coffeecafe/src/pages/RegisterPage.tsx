/*
  RegisterPage - страница «Регистрация».
  Карточка по центру: Имя, Email, Пароль, кнопка «Создать аккаунт».
  По успеху - JWT в localStorage и переход в /lk.
  Состояния полей и кнопки - как в форме контактов (см. ContactsPage).
*/

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { userRegister } from '../services/authService'
import defaultCheckboxIcon from '../assets/images/default-chckbox-vector.svg'
import selectedCheckboxIcon from '../assets/images/selected-vector.svg'

/** Минимальная длина пароля. Бэкенд проверяет это же. */
const MIN_PASSWORD_LENGTH = 6

function RegisterPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  /** Согласие на обработку персональных данных. Без него регистрация не идёт. */
  const [consent, setConsent] = useState(false)
  /** Ошибки полей. У email два варианта (пусто/невалид), у пароля - пусто/слишком короткий. */
  const [errors, setErrors] = useState<{
    name: boolean
    email: false | 'empty' | 'invalid'
    password: false | 'empty' | 'short'
    consent: boolean
  }>({
    name: false,
    email: false,
    password: false,
    consent: false,
  })
  /** Общая ошибка от API (например, «email уже занят»). */
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const emailErr: false | 'empty' | 'invalid' = !email.trim()
      ? 'empty'
      : !isValidEmail(email)
        ? 'invalid'
        : false

    const passwordErr: false | 'empty' | 'short' = !password
      ? 'empty'
      : password.length < MIN_PASSWORD_LENGTH
        ? 'short'
        : false

    const next = {
      name: !name.trim(),
      email: emailErr,
      password: passwordErr,
      consent: !consent,
    }
    setErrors(next)

    if (next.name || next.email || next.password || next.consent) return

    try {
      setIsSubmitting(true)
      await userRegister(name.trim(), email.trim(), password)
      navigate('/lk', { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось создать аккаунт')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <main className="px-4 lg:px-16 xl:px-28 pt-[57px] md:pt-[67px] lg:pt-[77px] min-h-[787px] md:min-h-[822px] lg:min-h-[874px] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="
            w-full max-w-[592px] md:max-w-[788px] lg:max-w-[592px]
            bg-[#4b372b] rounded-[10px]
            px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-10
          "
        >
          <h1 className="text-cream text-center font-normal text-xl md:text-[22px] lg:text-2xl leading-[1.2]">
            Регистрация
          </h1>

          {/* Имя */}
          <label className="block mt-6 md:mt-8 lg:mt-8">
            <span
              className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                errors.name ? 'text-input-border-error' : 'text-cream-dark'
              }`}
            >
              {errors.name ? 'Укажите имя' : 'Имя'}
            </span>
            <input
              type="text"
              name="name"
              value={name}
              autoComplete="name"
              onChange={(e) => {
                setName(e.target.value)
                setErrors((prev) => ({ ...prev, name: false }))
              }}
              placeholder="Введите свое имя"
              aria-invalid={errors.name}
              className="
                w-full mt-2 h-8 md:h-[49px] lg:h-[51px] px-4 rounded-[10px]
                bg-input-bg text-cream placeholder:text-placeholder placeholder:text-[13px] md:placeholder:text-base
                border-2 border-transparent text-[13px] md:text-base outline-none transition-colors
                hover:bg-input-bg-hover
                focus-visible:border-input-border-focus focus-visible:outline-none
                aria-invalid:border-input-border-error
              "
            />
          </label>

          {/* Email */}
          <label className="block mt-4 md:mt-6 lg:mt-4">
            <span
              className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                errors.email ? 'text-input-border-error' : 'text-cream-dark'
              }`}
            >
              {errors.email === 'empty'
                ? 'Введите email'
                : errors.email === 'invalid'
                  ? 'Введите корректный email'
                  : 'Email'}
            </span>
            <input
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: false }))
              }}
              placeholder="example@email.com"
              aria-invalid={Boolean(errors.email)}
              className="
                w-full mt-2 h-8 md:h-[49px] lg:h-[51px] px-4 rounded-[10px]
                bg-input-bg text-cream placeholder:text-placeholder placeholder:text-[13px] md:placeholder:text-base
                border-2 border-transparent text-[13px] md:text-base outline-none transition-colors
                hover:bg-input-bg-hover
                focus-visible:border-input-border-focus focus-visible:outline-none
                aria-invalid:border-input-border-error
              "
            />
          </label>

          {/* Пароль */}
          <label className="block mt-4 md:mt-6 lg:mt-4">
            <span
              className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                errors.password ? 'text-input-border-error' : 'text-cream-dark'
              }`}
            >
              {errors.password === 'empty'
                ? 'Введите пароль'
                : errors.password === 'short'
                  ? `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`
                  : 'Пароль'}
            </span>
            <input
              type="password"
              name="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: false }))
              }}
              placeholder="Введите свой пароль"
              aria-invalid={Boolean(errors.password)}
              className="
                w-full mt-2 h-8 md:h-[49px] lg:h-[51px] px-4 rounded-[10px]
                bg-input-bg text-cream placeholder:text-placeholder placeholder:text-[13px] md:placeholder:text-base
                border-2 border-transparent text-[13px] md:text-base outline-none transition-colors
                hover:bg-input-bg-hover
                focus-visible:border-input-border-focus focus-visible:outline-none
                aria-invalid:border-input-border-error
              "
            />
          </label>

          {submitError && (
            <p className="text-input-border-error text-[13px] md:text-base lg:text-base leading-[22px] mt-4">
              {submitError}
            </p>
          )}

          {/*
            Чекбокс согласия на обработку персональных данных.
            Стандартный input скрыт визуально (sr-only), а квадратик отрисован соседним span -
            через peer-checked: подсвечиваем рамку и фон, и показываем галочку.
            Так контрол доступен с клавиатуры и для скринридеров, но выглядит по макету.
            По макету чекбокс выровнен по левому краю формы на всех брейкпоинтах.
          */}
          <label className="mt-4 flex items-start md:items-center gap-4 cursor-pointer">
            {/* Чекбокс - SVG из ассетов (как в форме обратной связи), размеры по макету: 16/20/24px. */}
            <span className="relative inline-flex h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 shrink-0 rounded-sm transition-opacity hover:opacity-90 mt-[2px] md:mt-0">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                aria-invalid={errors.consent}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  setErrors((prev) => ({ ...prev, consent: false }))
                }}
                className="peer sr-only outline-none focus:outline-none focus-visible:outline-none"
              />
              {consent ? (
                <img
                  src={selectedCheckboxIcon}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                  aria-hidden
                />
              ) : errors.consent ? (
                <span
                  className="absolute inset-0 rounded-sm border-2 border-input-border-error bg-transparent pointer-events-none"
                  aria-hidden
                />
              ) : (
                <img
                  src={defaultCheckboxIcon}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                  aria-hidden
                />
              )}
            </span>
            <span
              className={`text-[13px] md:text-sm lg:text-base leading-[15.73px] md:leading-[17px] lg:leading-[19px] ${
                errors.consent ? 'text-input-border-error' : 'text-[#cfc6bb]'
              }`}
            >
              Даю согласие на обработку персональных данных
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex items-center justify-center
              w-full h-[67px] md:h-[60px] lg:h-[54px]
              mt-8 rounded-[10px]
              bg-brown-button text-brown-dark font-medium
              text-base lg:text-lg uppercase tracking-wider
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
              cursor-pointer disabled:opacity-60 disabled:cursor-wait
            "
          >
            {isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>

          {/*
            Нижняя ссылка «Войти» - слева, по аналогии с LoginPage (там «Зарегистрироваться»).
          */}
          <div className="mt-4 md:mt-6">
            <Link
              to="/login"
              className="text-cream text-[13px] md:text-base lg:text-base leading-[22px] transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
            >
              Войти
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

/** Простая RFC-проверка email: что-то@что-то.что-то */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default RegisterPage
