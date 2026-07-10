import React from 'react';
import { useSelector } from 'react-redux'; 


const CreditBadge = () => {
 
  const { user } = useSelector((state) => state.auth); 
  
  if (!user) return null;

  const credits = user.credits || 0;
  
 
  const getBadgeColor = () => {
    if (credits === 0) return 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20';
    if (credits <= 3) return 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20';
    return 'bg-[#7dd3a8]/10 text-[#7dd3a8] border-[#7dd3a8]/20';
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${getBadgeColor()}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" height="14" 
        viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
      <span>{credits} Credits</span>
    </div>
  );
};

export default CreditBadge;