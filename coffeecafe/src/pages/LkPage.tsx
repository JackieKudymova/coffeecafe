/*
  LkPage - личный кабинет клиента.
  Показывает имя, скидку и 6-значный ID клиента (по нему дают скидку на кассе).
  Данные тянем из /api/auth/me. Маршрут защищён ProtectedUser в App.tsx -
  без токена сюда не зайти, поэтому 401 здесь - это уже истёкший токен,
  обрабатываем сбросом и редиректом на /login.
*/

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCode } from 'react-qr-code'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { clearUserToken, userLogout, userMe, type UserMe } from '../services/authService'

function LkPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const [user, setUser] = useState<UserMe | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    userMe()
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch((err) => {
        // Токен невалидный/истёк - чистим и на логин.
        clearUserToken()
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить профиль')
          navigate('/login', { replace: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleLogout() {
    await userLogout()
    navigate('/', { replace: true })
  }

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/*
        Карточки нет - текст и код просто по центру тёмного фона страницы (по макету).
        min-h = высота нашего header + body макета (730/755/797), pt очищает абсолютный header,
        flex justify-center центрирует контент вертикально между header и footer - так
        отступы сверху/снизу контента совпадают с макетом независимо от высоты блока.
      */}
      <main className="px-4 lg:px-16 xl:px-28 pt-[57px] md:pt-[67px] lg:pt-[77px] min-h-[calc(100vh-57px)] md:min-h-screen lg:min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-full flex flex-col items-center">
        <h1 className="font-heading font-normal text-cream text-[24px] md:text-[40px] lg:text-[36px] leading-tight uppercase">
          Личный кабинет
        </h1>

        {user ? (
          <>
            <p className="text-cream text-[20px] md:text-[24px] lg:text-2xl mt-10 md:mt-14 lg:mt-16">
              {user.name}, ваша скидка - {user.discount}%
            </p>

            <p className="text-cream text-base md:text-[17px] lg:text-lg mt-6 md:mt-6 lg:mt-8">
              Ваш QR-код для скидки
            </p>

            <div className="bg-white rounded-[10px] p-4 mt-3 md:mt-4 lg:mt-4">
              <QRCode
                value={user.client_code}
                size={180}
                bgColor="#ffffff"
                fgColor="#2a1c17"
              />
            </div>

            <p className="text-cream-dark text-sm md:text-base lg:text-base mt-6 md:mt-8 lg:mt-8">
              *Покажите QR-код на кассе для получения скидки
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full md:w-[386px] lg:w-[340px] h-[67px] md:h-[60px] lg:h-[54px]
                mt-10 md:mt-14 lg:mt-12 rounded-[10px]
                bg-brown-button text-brown-dark font-medium
                text-base lg:text-lg uppercase tracking-wider
                transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg
                cursor-pointer
              "
            >
              Выйти
            </button>
          </>
        ) : error ? (
          <p className="text-cream-dark mt-10">{error}</p>
        ) : (
          <p className="text-cream-dark mt-10">Загружаем профиль…</p>
        )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LkPage
