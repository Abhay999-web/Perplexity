import React, { useState } from 'react'
import Sidebar from '../../../components/Dashboard/sidebar.jsx'
import ChatArea from '../../../components/Dashboard/chatArea.jsx'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className='h-screen w-full bg-[#171717] flex overflow-hidden font-sans text-gray-200 antialiased selection:bg-[#2f2f2f]'>
      
     {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Chat Area */}
      <ChatArea sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

    </main>
  )
}

export default Dashboard