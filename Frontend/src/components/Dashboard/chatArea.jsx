import React from 'react'
import MessageList from './message.List'
import ChatInput from './chatInput'
import CreditBadge from './CreditBadge'

const ChatArea = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <section className='flex-1 flex flex-col bg-black h-full relative overflow-hidden w-full '>
      
   
      <header className='h-14 border-b border-[#2f2f2f]/30 flex items-center px-4 bg-black/90 absolute top-0 left-0 right-0 z-30 md:bg-transparent md:border-transparent'>
        <div className='flex items-center gap-3 w-full'>
         <button 
  onClick={() => setSidebarOpen(!sidebarOpen)} 
  className='md:hidden text-gray-400 hover:text-white text-xl p-1.5 rounded-lg hover:bg-[#1e1e1e] transition-all cursor-pointer'
>
  ☰
</button>
          <div className="text-[20px] font-bold text-gray-300 select-none tracking-tight">
            Perplexity 
          </div>
          <CreditBadge/>   {/* credit badge component to show user credits */}
        </div>
      </header>

      {/* Main Viewport Workspace Wrapper */}
      <div className='flex-1 flex flex-col pt-20 pb-4 overflow-hidden w-full max-w-3xl mx-auto px-4 justify-between h-full'>
        
        {/* Dynamic Messages Thread Logger */}
        <MessageList />

        {/* Floating Bottom Input Capsule Container */}
        <ChatInput />

      </div>
    </section>
  )
}

export default ChatArea