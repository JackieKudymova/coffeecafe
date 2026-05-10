import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactsPage from './pages/ContactsPage'
import MenuPage from './pages/MenuPage'
import NewsPage from './pages/NewsPage'
import NewsArticlePage from './pages/NewsArticlePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage'
import LkPage from './pages/LkPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
// Раздел «Категории меню» отключён (см. AdminCategories.tsx). Чтобы включить: импорт AdminCategories + Route path="categories" + пункт в AdminSidebar.
import AdminItems from './pages/admin/AdminItems'
import AdminNews from './pages/admin/AdminNews'
import AdminMessages from './pages/admin/AdminMessages'
import AdminMessageDetail from './pages/admin/AdminMessageDetail'
import AdminLayout from './components/admin/AdminLayout'
import { getAdminToken } from './services/adminService'
import { getUserToken } from './services/authService'

/*
  App - корневой компонент приложения.
  BrowserRouter обеспечивает навигацию между страницами без перезагрузки.
*/

/** SPA не сбрасывает scroll при смене маршрута - без этого новая страница открывается с той же прокруткой, что была на прошлой. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ProtectedAdmin() {
  if (!getAdminToken()) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

function ProtectedUser() {
  if (!getUserToken()) return <Navigate to="/login" replace />
  return <Outlet />
}

/* Если пользователь уже залогинен - нечего показывать /login и /register, кидаем в /lk. */
function GuestOnly() {
  if (getUserToken()) return <Navigate to="/lk" replace />
  return <Outlet />
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsArticlePage />} />
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
        </Route>
        <Route path="/lk" element={<ProtectedUser />}>
          <Route index element={<LkPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="items" element={<AdminItems />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="messages/:id" element={<AdminMessageDetail />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
