import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage clients and meeting notes.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account yet?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
