import React from 'react'
import {
  Button, Avatar
} from "flowbite-react";
import AvatarImg from "../../assets/avatar-1.jpg";

export default function SuggestionBox() {
  return (
    <div className='border mb-3 '>
        <h2 className='text-center border'>Suggestions</h2> 
        <div className='flex justify-between flex-wrap flex-col lg:justify-between md:w-full lg:flex-row   px-2  my-1'>
            <div className='flex space-x-2'>
                <Avatar img={AvatarImg} rounded bordered className='block shrink-0' />
                <div className=''>
                    <p>Codjeau</p>
                    <p>Neloum</p>
                </div>
            </div>
            <Button  className="h-9  w-full lg:w-min" size="xs">Suivre</Button>
        </div>
          <hr className="my-2" />
        <div className='flex justify-between flex-wrap flex-col md:justify-between md:w-full md:flex-row   px-2  my-1'>
            <div className='flex space-x-2'>
                <Avatar className='block shrink-0' img={AvatarImg} rounded bordered />
                <div className=''>
                    <p>Codjeau</p>
                    <p>Neloum</p>
                </div>
              </div>
            <Button className="h-9  w-full lg:w-min" size="xs">suivre</Button>
        </div>  
    </div>
  )
}
