import React, { useState } from 'react'
import '../styles/form.css'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth.jsx'
import BorderGlow from '../components/BorderGlow.jsx'


const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { handleLogin, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <h1></h1>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()

    handleLogin(username, password)
      .then(res => {
        navigate('/')
      })

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
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              onInput={(e) => { setUsername(e.target.value) }}
              type="text"
              name="username"
              placeholder='Enter Username' />

            <input
              onInput={(e) => { setPassword(e.target.value) }}
              type="password"
              name="password"
              placeholder='Enter Password' />

            <button className='submit'>Login</button>
          </form>

          <p>Don't have an account?<Link className='toggleAuthForm' to='/register'>Register</Link></p>
        </div>
      </BorderGlow>
    </main>
  )
}

export default Login
