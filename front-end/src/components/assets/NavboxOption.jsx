import React from 'react'

export default function NavboxOption({Icon, title, counter}) {
  return (
    <div className="flex w-full sm:w-full sm:justify-between p-2 space-x-2 my-2 bg-white rounded-md cursor-pointer transition duration-300 ease-in-out transform hover:bg-orange-400 hover:text-white">
      <div className='flex  items-center '>      
        <Icon className="h-6 w-6 shrink-0" />
        <p className="hidden font-medium ml-3 sm:block ">{title}</p>
      </div>
      {counter && <p className='rounded-full border border-green-500 py-1 px-1'>{counter}</p>}
    </div>
  )
}
