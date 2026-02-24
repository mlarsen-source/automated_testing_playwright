'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LoginForm from '../../components/LoginForm'

export default function LoginPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(email: string, password: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.error || 'Login failed')
    }
  }

  return (
    <main className="page-shell">
      <div className="panel">
        <h1>Login</h1>
        <p className="muted">Access your notes with your credentials.</p>
        <LoginForm onSubmit={handleLogin} error={error} />
        <p className="muted">
          No account? <Link className="link" href="/register">Register</Link>
        </p>
      </div>
    </main>
  )
}
