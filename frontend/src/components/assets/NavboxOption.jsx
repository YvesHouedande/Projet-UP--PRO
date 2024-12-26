import React from 'react'

export default function NavboxOption({ title, Icon, onClick, active }) {
  return (
    <div 
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-all
        ${active 
          ? 'bg-green-800 text-white' 
          : 'text-green-800 hover:bg-gray-100'
        }`}
      onClick={onClick}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-green-800'}`} />
      <span className="ml-3 hidden md:block">{title}</span>
    </div>
  );
}
