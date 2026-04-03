import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../services/adminService'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await adminLogin(username.trim(), password)
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
        className="w-full max-w-md rounded-[10px] bg-[#4b372b] px-8 py-10 shadow-lg border border-cream/10"
      >
        <h1 className="font-heading text-2xl text-cream text-center mb-8">Вход в админку</h1>
        <label className="block">
          <span className="text-cream-dark text-sm">Логин</span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full h-[51px] px-4 rounded-[10px] bg-input-bg text-cream border-2 border-transparent outline-none focus-visible:border-input-border-focus"
          />
        </label>
        <label className="block mt-4">
          <span className="text-cream-dark text-sm">Пароль</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full h-[51px] px-4 rounded-[10px] bg-input-bg text-cream border-2 border-transparent outline-none focus-visible:border-input-border-focus"
          />
        </label>
        {error ? (
          <p className="mt-4 text-sm text-input-border-error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 h-[54px] rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase tracking-wider hover:bg-brown-button-hover disabled:opacity-60"
        >
          {loading ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
