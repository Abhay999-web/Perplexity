import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import EmailVerificationSent from './EmailVerificationSent'
import { useSelector } from 'react-redux'


const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)

  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Register submitted:', { username, email, password })
      if (handleRegister) {
        await handleRegister({ username, email, password })
        setIsRegister(true)
      }
    } catch (err) {
      console.error("Registration UI Error:", err)
    }
  }

  if (isRegister) {
    return <EmailVerificationSent email={email} />
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 sm:p-6 antialiased font-sans select-none">
      <div className="w-full max-w-[400px] animate-in fade-in duration-300">
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1 pt-2">
            <h2 className="text-[24px] font-semibold text-white tracking-tight">
              Create an account
            </h2>
            <p className="text-[13px] text-[#6e6e80]">
              Get started with your custom profile access
            </p>
          </div>

          {error && (
            <div className="bg-[#f87171]/10 border border-[#f87171]/20 rounded-xl p-3 text-[13px] text-[#f87171] text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-3.5">
              <div>
                <label className="block text-[#ececf1] text-[13px] font-medium mb-1.5 pl-0.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                  required
                  className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl text-white text-[14px] placeholder-[#4f4f56] outline-none transition-all focus:border-[#4a4a5a]"
                />
              </div>

              <div>
                <label className="block text-[#ececf1] text-[13px] font-medium mb-1.5 pl-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl text-white text-[14px] placeholder-[#4f4f56] outline-none transition-all focus:border-[#4a4a5a]"
                />
              </div>

              <div>
                <label className="block text-[#ececf1] text-[13px] font-medium mb-1.5 pl-0.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl text-white text-[14px] placeholder-[#4f4f56] outline-none transition-all focus:border-[#4a4a5a]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-[#e5e5e5] disabled:bg-[#1e1e1e] disabled:text-[#3a3a4a] text-black font-medium text-[14px] py-3 px-4 rounded-xl transition-all duration-150 cursor-pointer shadow-md mt-2 flex items-center justify-center h-11"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#2a2a2a]/40">
            <p className="text-[#8e8ea0] text-[13px]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#60a5fa] hover:underline ml-1 font-medium transition-all">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register