import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux' 
import MessageBubble from './messageBubble.jsx'
import { RiPerplexityLine, RiCodeSSlashLine, RiCompass3Line, RiLightbulbLine, RiBookOpenLine } from "@remixicon/react"

const MessageList = () => {
  const messagesEndRef = useRef(null)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  
  const activeMessages = chats && currentChatId ? chats[currentChatId]?.messages || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages, isLoading])

  const handleSuggestionClick = (promptText) => {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      inputElement.value = promptText;
      inputElement.focus();
      // Input custom dynamic state integration support triggers
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }

  if (activeMessages.length === 0) {
    const suggestions = [
      { title: "Code a snippet", desc: "MERN stack configuration setup", icon: <RiCodeSSlashLine size={16} className="text-[#7dd3a8]" />, text: "Give me a clean boiler-plate setup structure for a MERN stack application backend controller." },
      { title: "Explore trends", desc: "Crypto market entry point targets", icon: <RiCompass3Line size={16} className="text-[#60a5fa]" />, text: "Analyze the current technical breakout support zones for Bitcoin and Ethereum trading." },
      { title: "SaaS Business Strategy", desc: "Vertical models for local startups", icon: <RiLightbulbLine size={16} className="text-yellow-400" />, text: "Give me 3 practical Vertical Micro-SaaS ideas utilizing WhatsApp automation for local restaurants." },
      { title: "Content generation", desc: "Automated storytelling structures", icon: <RiBookOpenLine size={16} className="text-purple-400" />, text: "Create a detailed structural outline for a YouTube cinematic storytelling channel script." }
    ]

    return (
      <div className='flex-1 flex flex-col items-center justify-center bg-black select-none px-2'>
        <div className='w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-200'>
          
          <div className="space-y-3">
            <RiPerplexityLine size={40} className='text-white mx-auto' />
            <h3 className='text-[22px] font-semibold text-white tracking-tight'>What's on the agenda today?</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left pt-4">
            {suggestions.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleSuggestionClick(item.text)}
                className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-[16px] p-4 transition-all duration-150 hover:border-[#4a4a5a] hover:bg-[#252525] cursor-pointer group flex flex-col justify-between space-y-2 h-[88px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-white tracking-wide group-hover:text-[#60a5fa] transition-colors">
                    {item.title}
                  </span>
                  {item.icon}
                </div>
                <p className="text-[12px] text-[#6e6e80] line-clamp-1 font-normal leading-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 overflow-y-auto space-y-4 scrollbar-chatgpt pb-4 pr-1 scrollbar-none'>
      {activeMessages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      
      {isLoading && (
        <div className="w-full flex justify-start py-2 message-wrapper">
          <div className="flex gap-4 items-start w-full max-w-[75%]">
            <div className="w-7 h-7 bg-white rounded-full text-black text-[9px] font-bold flex items-center justify-center flex-shrink-0">AI</div>
            <div className="flex space-x-1 items-center pt-2.5 pl-1">
              <div className="w-1.5 h-1.5 bg-[#6e6e80] rounded-full typing-dot"></div>
              <div className="w-1.5 h-1.5 bg-[#6e6e80] rounded-full typing-dot"></div>
              <div className="w-1.5 h-1.5 bg-[#6e6e80] rounded-full typing-dot"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  )
}

export default MessageList