import React, { useState } from 'react'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register submitted:', { username, email, password })
    // Add your registration logic here
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#31b8c6] h-32 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">Register</h2>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Username field */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#31b8c6] transition duration-200"
              />
            </div>

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
              Register
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-700 px-8 py-4 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-[#31b8c6] hover:text-[#289ba8] font-semibold">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
