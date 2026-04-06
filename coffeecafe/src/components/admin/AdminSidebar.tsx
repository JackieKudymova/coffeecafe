import { NavLink, useNavigate } from 'react-router-dom'
import { clearAdminToken } from '../../services/adminService'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-[10px] px-4 py-3 text-base transition-colors ${
    isActive
      ? 'bg-brown-button text-brown-dark font-medium'
      : 'text-cream-dark hover:bg-[#5d483c] hover:text-cream'
  }`

type Props = {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: Props) {
  const navigate = useNavigate()

  function logout() {
    clearAdminToken()
    onMobileClose()
    navigate('/admin/login', { replace: true })
  }

  function navClassName(args: { isActive: boolean }) {
    return linkClass(args)
  }

  return (
    <aside
      className={`
        fixed left-0 top-14 z-[110] flex h-[calc(100dvh-3.5rem)] w-[min(280px,90vw)] flex-col
        border-r border-cream/10 bg-[#3d2d24] px-4 py-6 shadow-[8px_0_32px_rgba(0,0,0,0.35)]
        transition-transform duration-300 ease-out
        lg:static lg:z-auto lg:h-auto lg:min-h-screen lg:w-full lg:max-w-[260px] lg:shrink-0 lg:translate-x-0 lg:py-8 lg:shadow-none
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <p className="mb-6 hidden px-4 font-heading text-xl text-cream lg:block">Админка</p>
      <nav className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        <NavLink to="/admin" end className={navClassName} onClick={onMobileClose}>
          Дашборд
        </NavLink>
        {/* «Категории меню» отключены — см. App.tsx и AdminCategories.tsx */}
        <NavLink to="/admin/items" className={navClassName} onClick={onMobileClose}>
          Позиции меню
        </NavLink>
        <NavLink to="/admin/news" className={navClassName} onClick={onMobileClose}>
          Новости и акции
        </NavLink>
        <NavLink to="/admin/messages" className={navClassName} onClick={onMobileClose}>
          Обращения
        </NavLink>
      </nav>
      <button
        type="button"
        onClick={logout}
        className="mt-6 mx-4 shrink-0 rounded-[10px] border border-cream/25 px-4 py-3 text-sm text-cream-dark transition-colors hover:bg-[#5d483c] hover:text-cream lg:mt-10 w-[calc(100%-2rem)]"
      >
        Выйти
      </button>
    </aside>
  )
}
