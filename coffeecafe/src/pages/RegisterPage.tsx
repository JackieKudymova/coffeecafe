/*
  RegisterPage — страница «Регистрация».
  Карточка по центру: Имя, Email, Пароль, кнопка «Создать аккаунт».
  По успеху — JWT в localStorage и переход в /lk.
  Состояния полей и кнопки — как в форме контактов (см. ContactsPage).
*/

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { userRegister } from '../services/authService'

/** Минимальная длина пароля. Бэкенд проверяет это же. */
const MIN_PASSWORD_LENGTH = 6

function RegisterPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  /** Ошибки полей. У email два варианта (пусто/невалид), у пароля — пусто/слишком короткий. */
  const [errors, setErrors] = useState<{
    name: boolean
    email: false | 'empty' | 'invalid'
    password: false | 'empty' | 'short'
  }>({
    name: false,
    email: false,
    password: false,
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
    }
    setErrors(next)

    if (next.name || next.email || next.password) return

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

      <main className="px-4 lg:px-16 xl:px-28 pt-[140px] md:pt-[160px] lg:pt-[180px] pb-[60px] md:pb-[80px] lg:pb-[120px] flex justify-center">
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
            <p className="text-input-border-error text-[13px] md:text-base lg:text-base leading-[22px] mt-4 text-center">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex items-center justify-center
              w-full h-[67px] md:h-[60px] lg:h-[54px]
              mt-6 md:mt-8 lg:mt-6 rounded-[10px]
              bg-brown-button text-brown-dark font-medium
              text-base lg:text-lg uppercase tracking-wider
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
              cursor-pointer disabled:opacity-60 disabled:cursor-wait
            "
          >
            {isSubmitting ? 'Создаём...' : 'Создать аккаунт'}
          </button>

          {/*
            Нижняя ссылка «Войти» — слева, по аналогии с LoginPage (там «Зарегистрироваться»).
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
