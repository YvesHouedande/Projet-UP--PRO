import React from 'react'
import Feed from './Feed'
import SearchInput from './SearchInput'

export default function ProfilFeed() {
  return (
    <div className='flex flex-col md:w-1/3 ' >
        <div className=' py-4 flex flex-col w-full md:w-1/2 sm:flex-row  space-x-5  justify-between'>
            <ul className='flex space-x-2 items-end pl-4 pb-4 md:pb-0 md:pl-0 '>
                <li className='px-4 py-1 cursor-pointer text-xl bg-green-700 font-bold text-white h-min rounded-full '>Post</li>
                <li className='px-4 py-1 cursor-pointer text-xl bg-green-700 font-bold text-white h-min rounded-full '>Image</li>
            </ul>
              <Feed />
          </div>
          <hr className="my-2 w-2/3 bg-orange-500 h-1" />
        <SearchInput/> 
    </div>
  )
}
