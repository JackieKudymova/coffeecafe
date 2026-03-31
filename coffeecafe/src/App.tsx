import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactsPage from './pages/ContactsPage'
import MenuPage from './pages/MenuPage'

/*
  App — корневой компонент приложения.
  BrowserRouter обеспечивает навигацию между страницами без перезагрузки.
  Routes определяет какой компонент показывать для каждого URL.
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
