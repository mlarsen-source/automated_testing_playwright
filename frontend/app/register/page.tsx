'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error || 'Registration failed')
    }
  }

  return (
    <main className="page-shell">
      <div className="panel">
        <h1>Register</h1>
        <p className="muted">Create an account to start saving notes.</p>
        <form onSubmit={handleSubmit} data-testid="register-form" className="note-form">
          <div className="row">
            <input
              className="input"
              type="text"
              placeholder="First name"
              data-testid="first-name-input"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required
            />
          </div>
          <div className="row">
            <input
              className="input"
              type="text"
              placeholder="Last name"
              data-testid="last-name-input"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
            />
          </div>
          <div className="row">
            <input
              className="input"
              type="email"
              placeholder="Email"
              data-testid="email-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="row">
            <input
              className="input"
              type="password"
              placeholder="Password"
              data-testid="password-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && (
            <p className="muted" data-testid="error-message">
              {error}
            </p>
          )}
          <div>
            <button className="btn" type="submit" data-testid="submit-button">
              Register
            </button>
          </div>
        </form>
        <p className="muted">
          Already have an account? <Link className="link" href="/login">Login</Link>
        </p>
      </div>
    </main>
  )
}
