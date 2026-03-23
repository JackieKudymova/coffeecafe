import { useState } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import WhyUsSection from '../components/WhyUsSection'
import MenuSection from '../components/MenuSection'
import PromoSection from '../components/PromoSection'

/*
  HomePage — главная страница.
  Состояние меню (isMenuOpen) хранится здесь и передаётся в Header и HeroSection.
  Это паттерн React "подъём состояния" (lifting state up) —
  когда нескольким компонентам нужен доступ к одному состоянию,
  оно хранится в их общем родителе.
*/

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="bg-brown-bg min-w-[320px]">
      <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
      <HeroSection />
      <AboutSection />
      <WhyUsSection />
      <MenuSection />
      <PromoSection />
    </div>
  )
}

export default HomePage
