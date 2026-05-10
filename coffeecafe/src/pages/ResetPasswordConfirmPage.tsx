/*
  ResetPasswordConfirmPage - страница «Установка нового пароля».
  Сюда пользователь попадает по ссылке из письма: /reset-password/confirm?token=...

  Поля: «Новый пароль» + «Повторите пароль» (вторая итерация добавит отправку на бэкенд).
  Если токен в URL отсутствует - формы нет, показываем сообщение об ошибке и ссылку на восстановление.

  Карточка/инпуты/кнопка - те же, что на LoginPage / ResetPasswordPage (визуальная преемственность).
*/

import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { userConfirmPasswordReset } from '../services/authService'

/** Минимальная длина пароля. Бэкенд проверяет это же. */
const MIN_PASSWORD_LENGTH = 6

function ResetPasswordConfirmPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  /** Токен из URL. Если его нет - пользователь пришёл сюда напрямую, без письма. */
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  /**
   * Ошибки полей.
   * password: 'empty' - пусто, 'short' - короче 6 символов.
   * confirm: 'empty' - пусто, 'mismatch' - не совпадает с первым.
   */
  const [errors, setErrors] = useState<{
    password: false | 'empty' | 'short'
    confirm: false | 'empty' | 'mismatch'
  }>({
    password: false,
    confirm: false,
  })
  /** Общая ошибка от API (например, «ссылка истекла»). */
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const passwordErr: false | 'empty' | 'short' = !password
      ? 'empty'
      : password.length < MIN_PASSWORD_LENGTH
        ? 'short'
        : false

    const confirmErr: false | 'empty' | 'mismatch' = !confirm
      ? 'empty'
      : confirm !== password
        ? 'mismatch'
        : false

    const next = { password: passwordErr, confirm: confirmErr }
    setErrors(next)

    if (next.password || next.confirm) return
    if (!token) return

    try {
      setIsSubmitting(true)
      await userConfirmPasswordReset(token, password)
      // По успеху бэк выдал JWT - пользователь уже залогинен, ведём в ЛК.
      navigate('/lk', { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось сохранить пароль')
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
        <div
          className="
            w-full max-w-[592px] md:max-w-[788px] lg:max-w-[592px]
            bg-[#4b372b] rounded-[10px]
            px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-10
          "
        >
          <h1 className="text-cream text-center font-normal text-xl md:text-[22px] lg:text-2xl leading-[1.2]">
            Новый пароль
          </h1>

          {!token ? (
            /* Нет токена - пользователь пришёл по «голому» URL без параметра. */
            <div className="mt-6 md:mt-8 lg:mt-8 text-center">
              <p className="text-cream-dark text-base md:text-[17px] lg:text-lg leading-[22px]">
                Ссылка для сброса пароля недействительна или устарела.
                Запросите новую ссылку.
              </p>

              <Link
                to="/reset-password"
                className="
                  inline-flex items-center justify-center mt-8 md:mt-10 lg:mt-8
                  w-full lg:w-[280px] h-[67px] md:h-[60px] lg:h-[54px] rounded-[10px]
                  bg-brown-button text-brown-dark font-medium
                  text-base lg:text-lg uppercase tracking-wider
                  transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
                "
              >
                Запросить ссылку
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="text-cream-dark text-[13px] md:text-base lg:text-base leading-[22px] mt-4 md:mt-6 lg:mt-6 text-center">
                Придумайте новый пароль для входа в личный кабинет.
              </p>

              {/* Новый пароль */}
              <label className="block mt-6 md:mt-8 lg:mt-8">
                <span
                  className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                    errors.password ? 'text-input-border-error' : 'text-cream-dark'
                  }`}
                >
                  {errors.password === 'empty'
                    ? 'Введите пароль'
                    : errors.password === 'short'
                      ? `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`
                      : 'Новый пароль'}
                </span>
                <input
                  type="password"
                  name="new-password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: false }))
                  }}
                  placeholder="Введите новый пароль"
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

              {/* Повтор пароля */}
              <label className="block mt-4 md:mt-6 lg:mt-4">
                <span
                  className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                    errors.confirm ? 'text-input-border-error' : 'text-cream-dark'
                  }`}
                >
                  {errors.confirm === 'empty'
                    ? 'Повторите пароль'
                    : errors.confirm === 'mismatch'
                      ? 'Пароли не совпадают'
                      : 'Повторите пароль'}
                </span>
                <input
                  type="password"
                  name="confirm-password"
                  value={confirm}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirm(e.target.value)
                    setErrors((prev) => ({ ...prev, confirm: false }))
                  }}
                  placeholder="Повторите новый пароль"
                  aria-invalid={Boolean(errors.confirm)}
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
                {isSubmitting ? 'Сохраняем...' : 'Сохранить пароль'}
              </button>

              <div className="mt-4 md:mt-6 text-center md:text-left">
                <Link
                  to="/login"
                  className="text-cream text-[13px] md:text-base lg:text-base leading-[22px] transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
                >
                  Вернуться ко входу
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ResetPasswordConfirmPage
