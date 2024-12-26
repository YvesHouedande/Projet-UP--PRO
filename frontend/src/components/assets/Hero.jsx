import React from 'react'
import { Avatar } from 'flowbite-react'


export default function Hero({img, name}) {
    return (
        <>
            <div className='bg-green-500 relative flex justify-center items-center '>
                <div className="absolute top-0 left-0">
                    <Avatar rounded status="away" size="lg" statusPosition="bottom-right" />
                </div>
                <div className="userDes p-2  space-y-4 md:flex space-x-3 justify-center">
                    <p className='text-orange-500 bg-white rounded-full text-center px-5 py-3 text-4xl'>Niepa Toulou</p>
                    <p className='text-orange-500 bg-white rounded-full text-center px-5 py-3 text-4xl'>Info 2</p>
                    <p className='text-orange-500 bg-white rounded-full text-center px-5 py-3 text-4xl'>Stic 22</p>
                </div>
            </div>

        </>
  )
}
