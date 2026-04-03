import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-brown-bg flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8 lg:px-12 lg:py-10 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
