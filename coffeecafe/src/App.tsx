import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactsPage from './pages/ContactsPage'
import MenuPage from './pages/MenuPage'
import NewsPage from './pages/NewsPage'
import NewsArticlePage from './pages/NewsArticlePage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCategories from './pages/admin/AdminCategories'
import AdminItems from './pages/admin/AdminItems'
import AdminNews from './pages/admin/AdminNews'
import AdminMessages from './pages/admin/AdminMessages'
import AdminLayout from './components/admin/AdminLayout'
import { getAdminToken } from './services/adminService'

/*
  App — корневой компонент приложения.
  BrowserRouter обеспечивает навигацию между страницами без перезагрузки.
*/

function ProtectedAdmin() {
  if (!getAdminToken()) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsArticlePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="items" element={<AdminItems />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
