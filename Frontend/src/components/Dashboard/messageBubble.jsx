import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="w-full flex justify-end py-1.5 message-wrapper">
        <div className="max-w-[80%] md:max-w-[75%] bg-[#2a2a2a] border border-[#3a3a4a] rounded-t-[18px] rounded-bl-[18px] rounded-br-[4px] px-4 py-2.5 text-[#ffffff] text-[16px] break-words font-normal leading-relaxed shadow-xs tracking-normal antialiased">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-start py-4 message-wrapper">
      <div className="w-full flex gap-4 items-start max-w-[95%] md:max-w-[90%] px-1 md:px-2">
        
        
        <div className="flex-1 prose prose-invert max-w-none overflow-x-auto pt-0.5 
          prose-headings:text-white prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4
          prose-p:text-[#ececf1] prose-p:leading-relaxed prose-p:mb-3
          prose-strong:text-white prose-strong:font-bold
          prose-ol:list-decimal prose-ol:pl-5 prose-ul:list-disc prose-ul:pl-5
          prose-li:mb-1.5 text-[16px] font-sans selection:bg-emerald-500/30">

         {message.isThinking ? (
            <div className="flex items-center gap-1.5 py-2">
              <div className="h-2 w-2 bg-[#ececf1] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-[#ececf1] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-[#ececf1] rounded-full animate-bounce"></div>
            </div>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-lg border border-[#3a3a4a]">
                    <table className="min-w-full divide-y divide-[#3a3a4a] bg-[#212121] text-sm text-left margin-0" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-[#2a2a2a]" {...props} />,
                th: ({ node, ...props }) => <th className="px-4 py-2.5 font-semibold text-white border-b border-[#3a3a4a]" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-2 text-[#d1d1d6] border-b border-[#2a2a2a] last:border-b-0" {...props} />,
                tr: ({ node, ...props }) => <tr className="hover:bg-[#252525] transition-colors" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default MessageBubble