import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../../features/chat/hooks/useChat'
import { RiArrowUpLine } from "@remixicon/react"

const ChatInput = () => {
  const { handleSendMessage } = useChat()
  const [inputValue, setInputValue] = useState('')
  const [credits, setCredits] = useState(0)

  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const user = useSelector((state) => state.auth.user)
  const hasText = inputValue.trim().length > 0
  const isOutOfCredits = credits <= 0

  useEffect(() => {
    setCredits(Number(user?.credits ?? 0))
  }, [user?.credits])

  const processSubmission = async () => {
    if (isOutOfCredits) {
      window.alert("You are out of limit! Don't worry, your credits will automatically refill in 24 hours.")
      return
    }

    if (!hasText) return

    const promptText = inputValue.trim()
    setInputValue('')

    try {
      if (handleSendMessage) {
        await handleSendMessage({
          message: promptText,
          chatId: currentChatId,
          userId: user?._id || user?.id || null
        })
      }
    } catch (err) {
      setInputValue(promptText)
      console.error("Failed to route token payload:", err)
      window.alert("🚨 You are out of limit!!!! Don't worry, your credits will automatically refill in 24 hours.")
    }
  }

  return (
    <div className='w-full mt-auto pt-2 '>
      <div className='relative flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl focus-within:border-[#4a4a5a] transition-all pl-4 pr-2 py-1.5 shadow-lg'>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), processSubmission())}
          placeholder={isOutOfCredits ? 'No credits available' : 'Ask anything'}
          rows={1}
          className='flex-1 text-[#ececf1] placeholder-[#4f4f56] outline-none resize-none max-h-28 py-2 text-[1rem] leading-1.6'
        />

        <button
          onClick={processSubmission}
          className={`flex items-center justify-center transition-all ${
            hasText ? 'send-btn-active bg-white rounded-full text-black' : 'send-btn-disabled bg-[#1e1e1e] text-[#3a3a4a]'
          }`}
        >
          <RiArrowUpLine size={30} className="stroke-[2.5] " />
        </button>
      </div>
      <p className='text-[15px] text-[#7f7f84] text-center mt-2 select-none'>Perplexity can make mistakes.</p>
    </div>
  )
}

export default ChatInput