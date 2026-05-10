/*
  ResetPasswordPage - страница «Восстановление пароля».
  Простой однополевый flow: пользователь вводит email - мы (когда подключим backend) отправляем
  на эту почту ссылку для сброса. Показываем успех в той же карточке, без редиректа,
  чтобы человек видел подтверждение действия.

  Сообщение «Если такой email зарегистрирован…» намеренно нейтральное - не палит,
  есть аккаунт с таким email или нет (стандартная практика безопасности).
*/

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { userRequestPasswordReset } from '../services/authService'

function ResetPasswordPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<false | 'empty' | 'invalid'>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  /** В dev-режиме (без SMTP) бэк возвращает прямую ссылку - показываем для удобства тестов. */
  const [devLink, setDevLink] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const err: false | 'empty' | 'invalid' = !email.trim()
      ? 'empty'
      : !isValidEmail(email)
        ? 'invalid'
        : false
    setEmailError(err)
    if (err) return

    try {
      setIsSubmitting(true)
      const result = await userRequestPasswordReset(email.trim())
      setDevLink(result.dev_reset_link ?? null)
      setSubmitted(true)
    } catch (err2) {
      setSubmitError(err2 instanceof Error ? err2.message : 'Не удалось отправить запрос')
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
            Восстановление пароля
          </h1>

          {submitted ? (
            /* Успех - оставляем карточку, заменяем содержимое подтверждением. */
            <div className="mt-6 md:mt-8 lg:mt-8 text-center">
              <p className="text-cream-dark text-base md:text-[17px] lg:text-lg leading-[22px]">
                Если такой email зарегистрирован, мы отправили на него инструкцию
                для сброса пароля
              </p>

              {devLink && (
                /* Только в dev: SMTP не настроен - показываем ссылку прямо в UI, чтоб можно было протестировать flow. */
                <p className="text-cream-dark/70 text-[13px] md:text-base leading-[22px] mt-4 break-all">
                  <span className="block text-cream-dark mb-1">DEV-ссылка (SMTP не настроен):</span>
                  <a href={devLink} className="text-brown-button underline">{devLink}</a>
                </p>
              )}

              <Link
                to="/login"
                className="
                  inline-flex items-center justify-center mt-8 md:mt-10 lg:mt-8
                  w-full lg:w-[280px] h-[67px] md:h-[60px] lg:h-[54px] rounded-[10px]
                  bg-brown-button text-brown-dark font-medium
                  text-base lg:text-lg uppercase tracking-wider
                  transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
                "
              >
                Вернуться ко входу
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="text-cream-dark text-base md:text-[17px] lg:text-lg leading-[22px] mt-4 md:mt-6 lg:mt-6 text-center">
                Введите email, на который вы регистрировались - мы отправим ссылку для сброса пароля
              </p>

              <label className="block mt-6 md:mt-8 lg:mt-8">
                <span
                  className={`block text-base md:text-[17px] lg:text-lg leading-[22px] ${
                    emailError ? 'text-input-border-error' : 'text-cream-dark'
                  }`}
                >
                  {emailError === 'empty'
                    ? 'Введите email'
                    : emailError === 'invalid'
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
                    setEmailError(false)
                  }}
                  placeholder="example@email.com"
                  aria-invalid={Boolean(emailError)}
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
                {isSubmitting ? 'Отправляем...' : 'Отправить'}
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

/** Простая RFC-проверка email: что-то@что-то.что-то */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default ResetPasswordPage
