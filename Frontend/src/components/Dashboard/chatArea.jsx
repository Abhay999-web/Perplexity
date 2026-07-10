import React from 'react'
import MessageList from './message.list.jsx'
import ChatInput from './chatInput.jsx'
import CreditBadge from './CreditBadge.jsx'

const ChatArea = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <section className='flex-1 flex flex-col bg-black h-full overflow-hidden w-full'>
      
      <header className='shrink-0 h-14 border-b border-[#2f2f2f]/30 flex items-center px-4 bg-black/90 z-30 md:bg-transparent md:border-transparent'>
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
          <CreditBadge />
        </div>
      </header>

      <div className='flex-1 flex flex-col min-h-0 w-full max-w-3xl mx-auto px-4 pb-4 pt-4'>
        <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
          <MessageList />
        </div>
        <div className="shrink-0 pt-2">
          <ChatInput />
        </div>
      </div>
      
    </section>
  )
}

export default ChatArea