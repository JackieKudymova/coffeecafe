import { useState } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import WhyUsSection from '../components/WhyUsSection'
import MenuSection from '../components/MenuSection'
import AuthPromoSection from '../components/AuthPromoSection'
import PromoSection from '../components/PromoSection'
import GallerySection from '../components/GallerySection'
import ReviewsSection from '../components/ReviewsSection'
import Footer from '../components/Footer'

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="bg-brown-bg min-w-[320px]">
      <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
      <HeroSection />
      <AuthPromoSection />
      <AboutSection />
      <WhyUsSection />
      <MenuSection />
      <PromoSection />
      <GallerySection />
      <ReviewsSection />
      <Footer />
    </div>
  )
}

export default HomePage
