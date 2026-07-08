import React from 'react';
import { Link } from 'react-router';
import { RiMailSendLine, RiCheckDoubleLine } from "@remixicon/react";

const EmailVerificationSent = ({ email }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 antialiased select-none">
      <div className="bg-[#171717] border border-[#2a2a2a] rounded-[24px] p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
        
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-[#60a5fa]/20 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-[#1e1e1e] border border-[#3a3a4a] w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <RiMailSendLine size={32} className="text-[#60a5fa] animate-bounce [animation-delay:-0.3s]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-[24px] font-semibold text-white tracking-tight">Check your email</h2>
          <p className="text-[14px] text-[#8e8ea0] leading-relaxed">
            We've sent a verification link to <br/>
            <span className="text-[#ececf1] font-medium">{email || "your email address"}</span>.
          </p>
        </div>

        <div className="bg-[#1e1e1e] rounded-xl p-4 flex items-start gap-3 border border-[#2a2a2a] text-left">
          <RiCheckDoubleLine className="text-[#7dd3a8] shrink-0 mt-0.5" size={18} />
          <p className="text-[12px] text-[#8e8ea0]">
            Click the link in the email to verify your account. After verifying, you can log in to access your workspace.
          </p>
        </div>

        <Link to="/login" className="block w-full bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#252525] text-white font-medium text-[14px] py-3 px-4 rounded-xl transition-all duration-150 cursor-pointer shadow-sm mt-4">
          Back to Login
        </Link>

      </div>
    </div>
  );
};

export default EmailVerificationSent;