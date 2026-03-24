/*
  Footer — подвал сайта.
  Десктоп: 4 колонки (лого+соцсети, контакты, навигация×2) + копирайт + кнопка наверх.
  Мобилка: одна колонка по центру (лого, соцсети, контакты, копирайт). Без навигации.
*/

const navCol1 = [
  { label: 'Главная', href: '#' },
  { label: 'О нас', href: '#about' },
  { label: 'Меню', href: '#menu' },
]

const navCol2 = [
  { label: 'Политика конфиденциальности', href: '#' },
  { label: 'Новости и акции', href: '#news' },
  { label: 'Контакты', href: '#contacts' },
]

function VkIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#faf6f0" />
      <path d="M25.54 34c-8.56 0-13.44-5.86-13.66-15.6h4.3c.14 7.18 3.3 10.22 5.82 10.84V18.4h4.04v6.2c2.48-.26 5.08-3.1 5.96-6.2h4.04c-.68 3.82-3.52 6.66-5.54 7.82 2.02 .94 5.26 3.42 6.5 7.78h-4.46c-.96-3-3.36-5.32-6.5-5.64V34h-.5z" fill="#140f0c" />
    </svg>
  )
}

function TelegramIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#faf6f0" />
      <path d="M33.6 15.24l-3.96 18.66c-.3 1.32-.96 1.62-1.98 1.02l-5.46-4.02-2.64 2.52c-.3.3-.54.54-1.08.54l.42-5.7 10.26-9.3c.48-.42-.12-.66-.72-.24L16.74 27l-5.4-1.68c-1.14-.36-1.2-.96.24-1.56l21.12-8.16c.96-.36 1.8.24 1.5 1.56l-.6 -1.92z" fill="#140f0c" />
    </svg>
  )
}

function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-12 h-12 rounded-full bg-brown-button flex items-center justify-center hover:bg-brown-button/90 transition-colors"
      aria-label="Наверх"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="#2a1c17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function Footer() {
  return (
    <footer className="bg-brown-footer">

      {/* Мобилка: одна колонка по центру */}
      <div className="lg:hidden px-4 py-4 flex flex-col items-center text-center">
        <span className="text-cream font-bold text-lg">ДомКофе</span>

        <div className="flex gap-5 mt-3">
          <a href="#" aria-label="VK"><VkIcon size={32} /></a>
          <a href="#" aria-label="Telegram"><TelegramIcon size={32} /></a>
        </div>

        <div className="mt-4 flex flex-col gap-1 text-cream text-base">
          <span className="font-normal">Адрес:</span>
          <span>г. Санкт-Петербург, ул. Лесная, 12</span>
          <span className="font-normal mt-2">Телефон:</span>
          <span>8 952 288 90 99</span>
          <span className="font-normal mt-2">Почта:</span>
          <span>domcoffee@gmail.ru</span>
        </div>

        <p className="text-cream text-[13px] mt-6">
          © 2026 ДомКофе. Все права защищены
        </p>
      </div>

      {/* Десктоп: 4 колонки */}
      <div className="hidden lg:block px-16 xl:px-28 pt-6 pb-4">
        <div className="flex justify-between">

          {/* Колонка 1: Лого + соцсети */}
          <div className="flex flex-col">
            <span className="text-cream font-bold text-2xl">ДомКофе</span>
            <div className="flex gap-6 mt-8">
              <a href="#" aria-label="VK"><VkIcon size={36} /></a>
              <a href="#" aria-label="Telegram"><TelegramIcon size={36} /></a>
            </div>
          </div>

          {/* Колонка 2: Контакты */}
          <div className="flex flex-col gap-2 text-cream font-medium text-lg">
            <span>Адрес:</span>
            <span>г. Санкт-Петербург, ул. Лесная, 12</span>
            <span className="mt-4">Телефон:</span>
            <span>8 952 288 90 99</span>
            <span className="mt-4">Почта:</span>
            <span>domcoffee@gmail.ru</span>
          </div>

          {/* Колонка 3: Навигация 1 */}
          <nav className="flex flex-col gap-[22px] text-cream font-medium text-lg">
            {navCol1.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-brown-button transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Колонка 4: Навигация 2 */}
          <nav className="flex flex-col gap-[22px] text-cream font-medium text-lg">
            {navCol2.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-brown-button transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Нижняя строка: копирайт + кнопка наверх */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-cream text-base">
            © 2026 ДомКофе. Все права защищены
          </p>
          <ScrollToTopButton />
        </div>
      </div>
    </footer>
  )
}

export default Footer
