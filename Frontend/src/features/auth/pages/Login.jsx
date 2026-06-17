import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  const { handleLogin } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
       email, 
       password
       }
    
       await handleLogin(payload)
       navigate("/")

    
  }

  if(!loading && user){
    return <Navigate to = "/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#31b8c6] h-32 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">Login</h2>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Email field */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#31b8c6] transition duration-200"
              />
            </div>

            {/* Password field */}
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#31b8c6] transition duration-200"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#31b8c6] hover:bg-[#289ba8] text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-700 px-8 py-4 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-[#31b8c6] hover:text-[#289ba8] font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
