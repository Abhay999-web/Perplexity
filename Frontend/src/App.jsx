import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import { ChatProvider } from "./context/ChatContext";

export default function AppShell(){
  const [open, setOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="min-h-screen bg-black text-white flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="md:hidden fixed top-4 left-4 z-30">
          <button onClick={()=>setOpen(true)} className="p-2 bg-neutral-900 rounded">
            ☰
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={()=>setOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72">
              <Sidebar onClose={()=>setOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </ChatProvider>
  );
}
