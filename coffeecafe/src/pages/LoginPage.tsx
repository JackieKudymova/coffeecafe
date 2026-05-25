/*
  LoginPage - страница «Вход в личный кабинет».
  Карточка по центру: Email, Пароль, кнопка «Войти», ссылки на регистрацию и восстановление пароля.
  По успеху - JWT в localStorage и переход в /lk.
*/

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { userLogin } from '../services/authService'

function LoginPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  /** Ошибки полей (UI-KIT Error). У email два варианта: пусто и некорректный формат. */
  const [errors, setErrors] = useState<{
    email: false | 'empty' | 'invalid'
    password: boolean
  }>({
    email: false,
    password: false,
  })
  /** Общая ошибка от API (например, «неверный email или пароль»). */
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

    const next = {
      email: emailErr,
      password: !password,
    }
    setErrors(next)

    if (next.email || next.password) return

    try {
      setIsSubmitting(true)
      await userLogin(email.trim(), password)
      navigate('/lk', { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось войти')
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

      {/*
        Высота main = высота header + body из макета (1101/1213/1182 - footer 330/415/332).
        pt очищает абсолютный header (57/67/77), а flex items-center центрирует карточку
        вертикально в свободном пространстве - так отступы сверху/снизу карточки совпадают
        с макетом независимо от её высоты.
      */}
      <main className="px-4 lg:px-16 xl:px-28 pt-[57px] md:pt-[67px] lg:pt-[77px] min-h-[calc(100vh-57px)] md:min-h-[calc(100vh-67px)] lg:min-h-[calc(100vh-77px)] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="
            w-full max-w-[592px] md:max-w-[788px] lg:max-w-[592px]
            bg-[#382a22] rounded-[5px]
            px-4 py-8 md:px-6 md:py-10 lg:px-14 lg:py-12
          "
        >
          <h1 className="text-cream text-center font-normal text-xl md:text-[22px] lg:text-2xl leading-[1.2]">
            Вход в личный кабинет
          </h1>

          {/* Email */}
          <label className="block mt-8">
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
                w-full mt-2 h-8 md:h-[49px] lg:h-[51px] px-4 rounded-[5px]
                bg-input-bg text-cream placeholder:text-placeholder placeholder:text-[13px] md:placeholder:text-base
                border-2 border-transparent text-[13px] md:text-base outline-none transition-colors
                hover:bg-input-bg-hover
                focus-visible:border-input-border-focus focus-visible:outline-none
                aria-invalid:border-input-border-error
              "
            />
          </label>

          {/* Пароль */}
          <label className="block mt-4">
            <span
              className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                errors.password ? 'text-input-border-error' : 'text-cream-dark'
              }`}
            >
              {errors.password ? 'Введите пароль' : 'Пароль'}
            </span>
            <input
              type="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: false }))
              }}
              placeholder="Введите свой пароль"
              aria-invalid={errors.password}
              className="
                w-full mt-2 h-8 md:h-[49px] lg:h-[51px] px-4 rounded-[5px]
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex items-center justify-center
              w-full h-[67px] lg:h-[54px]
              mt-8
              bg-brown-button text-brown-dark font-medium
              text-base lg:text-lg uppercase tracking-wider
              transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#382a22]
              rounded-[5px] cursor-pointer disabled:opacity-60 disabled:cursor-wait
            "
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>

          {/*
            Нижние ссылки.
            Мобилка - стопкой и левее, планшет/десктоп - двумя краями (по макету).
          */}
          <div className="mt-6 md:mt-8 flex flex-col gap-4 md:flex-row md:justify-between">
            <Link
              to="/register"
              className="text-cream text-[13px] md:text-base lg:text-base leading-[22px] transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
            >
              Зарегистрироваться
            </Link>
            <Link
              to="/reset-password"
              className="text-cream text-[13px] md:text-base lg:text-base leading-[22px] transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
            >
              Восстановить пароль
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

export default LoginPage
