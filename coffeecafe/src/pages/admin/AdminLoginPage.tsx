import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../services/adminService'
import AdminTextField from '../../components/admin/AdminTextField'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emptyUsername, setEmptyUsername] = useState(false)
  const [emptyPassword, setEmptyPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const u = username.trim()
    const missingUser = !u
    const missingPass = !password
    setEmptyUsername(missingUser)
    setEmptyPassword(missingPass)
    if (missingUser || missingPass) {
      return
    }

    setLoading(true)
    try {
      await adminLogin(u, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brown-bg flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-[10px] bg-[#4b372b] px-8 py-10 shadow-lg border border-cream/10"
      >
        <h1 className="font-heading text-2xl text-cream text-center mb-8">Вход в админку</h1>
        <AdminTextField
          label={emptyUsername ? 'Введите логин' : 'Логин'}
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setEmptyUsername(false)
          }}
          error={emptyUsername}
        />
        <AdminTextField
          label={emptyPassword ? 'Введите пароль' : 'Пароль'}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setEmptyPassword(false)
          }}
          error={emptyPassword}
          containerClassName="mt-4"
        />
        {error ? (
          <p className="mt-4 text-sm text-input-border-error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full mt-8 h-[54px] rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase tracking-wider
            transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b372b]
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
