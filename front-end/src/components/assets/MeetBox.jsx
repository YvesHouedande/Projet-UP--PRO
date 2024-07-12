import React from 'react'
import {
  Button, Avatar
} from "flowbite-react";


export default function MeetBox() {
  return (
    <div className='border ' >
        <h2 className='text-center border'>Les Quelques Rendez-vous</h2> 
        <div className='flex space-x-20 px-2 pt-4  my-2'>
              <p className='underline cursor-pointer'># Conférence sur la vie en entreprise avecles...</p>
        </div>
        <div className='flex space-x-20 px-2  my-2'>
            <p className='underline cursor-pointer'># Stand des ESCAE</p>
        </div> 
    </div>
  )
}
