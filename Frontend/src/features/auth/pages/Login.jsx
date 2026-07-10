import React, { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../auth.slice' 

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)
  
  const { handleLogin } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()

 
  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      if (error) dispatch(setError(null));
    };
  }, [dispatch, error]);


  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      dispatch(setError(null))
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) {
      dispatch(setError(null))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { email, password }
      await handleLogin(payload)
      // only navigate when login succeeded (useAuth will throw on error)
      navigate("/")
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err?.message || "Login failed";
      dispatch(setError(backendMessage));
    }
  }

  if (!loading && user) {
    return <Navigate to="/" replace />
  }


  const shouldShowError = error && error.toLowerCase() !== "unauthorized" && error.toLowerCase() !== "no token provided"

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 sm:p-6 antialiased font-sans select-none">
      <div className="w-full max-w-[400px] animate-in fade-in duration-300">
        
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-1 pt-2">
            <h2 className="text-[24px] font-semibold text-white tracking-tight">Welcome back</h2>
            <p className="text-[13px] text-[#6e6e80]">Sign in to your account to continue</p>
          </div>

          {shouldShowError && (
            <div className="bg-[#f87171]/10 border border-[#f87171]/20 rounded-xl p-3 text-[13px] text-[#f87171] text-center font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className="block text-[#ececf1] text-[13px] font-medium mb-1.5 pl-0.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl text-white text-[14px] placeholder-[#4f4f56] outline-none transition-all focus:border-[#4a4a5a]"
                />
                {error && (
                  <p className="text-[#f87171] text-sm mt-1">{error}</p>
                )}
              </div>

              <div>
                <label className="block text-[#ececf1] text-[13px] font-medium mb-1.5 pl-0.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
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
                'Continue'
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#2a2a2a]/40">
            <p className="text-[#8e8ea0] text-[13px]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#60a5fa] hover:underline ml-1 font-medium transition-all">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login