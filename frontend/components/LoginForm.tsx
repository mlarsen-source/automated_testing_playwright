import { useState } from 'react'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  error?: string
}

// Pure React - no Next.js imports so it works in component tests (Vite) too
export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
          placeholder="Password"
          required
        />
      </div>
      {error && <p data-testid="error-message">{error}</p>}
      <button type="submit" data-testid="submit-button">
        Login
      </button>
    </form>
  )
}
