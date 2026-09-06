import React, { useState } from 'react'
import '../styles/form.css'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import BorderGlow from '../components/BorderGlow'

const Register = () => {

  const { loading, handleRegister } = useAuth()

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await handleRegister(username, email, password)
    }
    catch (err) {
      setError(err?.response?.data?.message || "Couldn't create your account. Try Again.")
    }
    finally {
      setSubmitting(false)
    }

    navigate('/')
  }

  return (
    <main>
      <BorderGlow edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={['#c084fc', '#f472b6', '#38bdf8']}>
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input onInput={(e) => { setUsername(e.target.value) }}
              type="text"
              name="username"
              placeholder='Enter Username' />

            <input onInput={(e) => { setEmail(e.target.value) }}
              type="email"
              name="email"
              placeholder='Enter Email' />

            <input onInput={(e) => { setPassword(e.target.value) }}
              type="password"
              name="password"
              placeholder='Enter Password' />

            {error && <p className="form-error">{error}</p>}

            <button type='submit' disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p>Already have an account? <Link className='toggleAuthForm' to='/login'>Login</Link></p>
        </div>
      </BorderGlow>
    </main>
  )
}

export default Register
