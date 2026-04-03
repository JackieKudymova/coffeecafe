import { NavLink, useNavigate } from 'react-router-dom'
import { clearAdminToken } from '../../services/adminService'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-[10px] px-4 py-3 text-base transition-colors ${
    isActive
      ? 'bg-brown-button text-brown-dark font-medium'
      : 'text-cream-dark hover:bg-[#5d483c] hover:text-cream'
  }`

export default function AdminSidebar() {
  const navigate = useNavigate()

  function logout() {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="w-full max-w-[260px] shrink-0 border-r border-cream/10 bg-[#3d2d24] px-4 py-8">
      <p className="font-heading text-xl text-cream px-4 mb-8">Админка</p>
      <nav className="flex flex-col gap-1">
        <NavLink to="/admin" end className={linkClass}>
          Дашборд
        </NavLink>
        <NavLink to="/admin/categories" className={linkClass}>
          Категории меню
        </NavLink>
        <NavLink to="/admin/items" className={linkClass}>
          Позиции меню
        </NavLink>
        <NavLink to="/admin/news" className={linkClass}>
          Новости
        </NavLink>
        <NavLink to="/admin/messages" className={linkClass}>
          Обращения
        </NavLink>
      </nav>
      <button
        type="button"
        onClick={logout}
        className="mt-10 mx-4 px-4 py-3 rounded-[10px] border border-cream/25 text-cream-dark text-sm hover:bg-[#5d483c] hover:text-cream w-[calc(100%-2rem)]"
      >
        Выйти
      </button>
    </aside>
  )
}
