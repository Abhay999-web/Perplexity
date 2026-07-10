import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../features/chat/hooks/useChat'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { setCurrentChatId } from '../../features/chat/chat.slice'
import { RiPerplexityLine, RiChatNewLine, RiSettings4Line, RiDeleteBin6Line, RiLogoutBoxRLine } from "@remixicon/react"

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const { handleGetChats, handleOpenChat, handleDeleteChat } = useChat();
  const { handleLogout } = useAuth()

  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  const [deletingId, setDeletingId] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    if (user?.id || user?._id) {
      handleGetChats?.()
    }
  }, [user?.id, user?._id])

  const openChat = async (chatId) => {
    try {
      if (handleOpenChat) await handleOpenChat(chatId, chats)
      else dispatch(setCurrentChatId(chatId))
      setSidebarOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const fireDelete = async (e, chatId) => {
    e.stopPropagation()
    if (handleDeleteChat) await handleDeleteChat(chatId)
    setDeletingId(null)
  }


  const executeLogout = async () => {
    try {
     
      setShowSettingsModal(false)
      
      if (handleLogout) {
        await handleLogout()
      }
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      navigate("/login", { replace: true })
    }
  }

  const getUserInitials = () => {
    const nameStr = user?.username || user?.name
    return nameStr ? nameStr.slice(0, 2).toUpperCase() : "AS"
  }

  const getUserDisplayName = () => {
    return user?.username || user?.name || user?.email || "Guest User"
  }

  return (
    <>
      {sidebarOpen && (
        <div className='fixed inset-0 bg-black/70 md:hidden z-40 transition-all' onClick={() => setSidebarOpen(false)}></div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] px-4 backdrop-blur-xs">
          <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#ffffff]">Delete conversation?</h3>
            <p className="text-sm text-[#8e8ea0] leading-relaxed">This drops the conversation from database storage instantly.</p>
            <div className="flex justify-end gap-2.5">
              <button onClick={() => setDeletingId(null)} className="px-3.5 py-2 text-xs font-medium rounded-xl text-[#ececf1] bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#2a2a2a] transition-all">Cancel</button>
              <button onClick={(e) => fireDelete(e, deletingId)} className="px-3.5 py-2 text-xs font-medium rounded-xl text-white bg-[#e75a5a] hover:bg-red-500 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] px-4 backdrop-blur-xs" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
              <h3 className="text-sm font-semibold text-[#ffffff]">Account Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-[#8e8ea0] hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#6e6e80] uppercase tracking-wider pl-1">Session</p>
              <button
                onClick={executeLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#e75a5a] hover:bg-[#e75a5a]/10 transition-all text-left text-[14px] font-medium group cursor-pointer"
              >
                <RiLogoutBoxRLine size={18} className="text-[#e75a5a]" />
                <span>Log out account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className={`fixed md:relative w-[260px] h-full bg-black border-r border-[#2a2a2a] flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='p-3 flex items-center justify-between'>
          <button
            onClick={() => { dispatch(setCurrentChatId(null)); setSidebarOpen(false); }}
            className='w-full px-3 py-2 rounded-[10px] text-[#8e8ea0] hover:bg-[#1e1e1e] hover:text-[#ffffff] text-sm flex items-center justify-between transition-all group'
          >
            <div className="flex items-center gap-2.5">
              <RiPerplexityLine size={30} className="text-[#ececf1]" />
              <span className="text-[14px]">New chat</span>
            </div>
            <RiChatNewLine size={20} />
          </button>
          <button onClick={() => setSidebarOpen(false)} className='md:hidden text-[#8e8ea0] hover:text-[#ffffff] ml-2 text-sm p-1'>✕</button>
        </div>

        <div className='flex-1 overflow-y-auto px-2.5 mt-2 space-y-0.5 scrollbar-chatgpt'>
          <p className='px-3 text-[11px] font-semibold text-[#6e6e80] uppercase tracking-wider mb-2 select-none'>History</p>
          {Object.values(chats).map((sidebarChat) => (
            <div
              key={sidebarChat.id}
              onClick={() => openChat(sidebarChat.id)}
              className={`w-full flex items-center justify-between rounded-[10px] transition-all group relative cursor-pointer ${sidebarChat.id === currentChatId ? 'bg-[#2a2a2a] text-[#ffffff]' : 'text-[#8e8ea0] hover:bg-[#1e1e1e] hover:text-[#ffffff]'}`}
            >
              <div className="flex-1 text-left px-3 py-2 text-[13px] truncate font-normal pr-8">
                {sidebarChat.title || "Untitled Chat"}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeletingId(sidebarChat.id); }}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 mr-1 rounded-md text-[#6e6e80] hover:text-[#ec3c3ced] absolute right-1 bg-[#171717] md:bg-transparent"
              >
                <RiDeleteBin6Line size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className='p-3 border-t border-[#2a2a2a] flex items-center justify-between group select-none relative z-50 bg-black'>
          <div className="flex items-center gap-2.5 overflow-hidden flex-1 pr-2">
            <div className="w-7 h-7 bg-[#2a2a2a] border border-[#3a3a4a] rounded-full text-[#8e8ea0] text-[9px] font-semibold flex items-center justify-center flex-shrink-0 uppercase">
              {getUserInitials()}
            </div>
            <span className="text-[13px] font-medium text-[#ececf1] truncate">
              {getUserDisplayName()}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowSettingsModal(true); }}
            className="p-1 rounded-md hover:bg-[#1e1e1e] transition-all relative z-50 cursor-pointer flex items-center justify-center"
          >
            <RiSettings4Line size={20} className="text-[#6e6e80] hover:text-[#ffffff] transition-colors" />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar