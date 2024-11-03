import React from 'react'
import {
  Button, Avatar
} from "flowbite-react";


export default function MeetBox() {
  return (
    <div className='border rounded-lg bg-white'>
      <h2 className='text-center border-b p-2 font-medium text-sm'>Les Quelques Rendez-vous</h2> 
      <div className='p-3 space-y-3'>
        <div className='hover:bg-gray-50 rounded-md p-2'>
          <p className='text-sm text-green-600 hover:underline cursor-pointer'>
            # Conférence sur la vie en entreprise avecles...
          </p>
        </div>
        <div className='hover:bg-gray-50 rounded-md p-2'>
          <p className='text-sm text-green-600 hover:underline cursor-pointer'>
            # Stand des ESCAE
          </p>
        </div> 
      </div>
    </div>
  )
}
