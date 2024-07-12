
import { IoIosContacts } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaServicestack } from "react-icons/fa6";
import { BsFillFilePostFill } from "react-icons/bs";
import React, { useState } from 'react';
import { MdManageAccounts } from "react-icons/md";

export default function ProfileNavBox() {
  const [showIcons, setShowIcons] = useState(false);

  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };

  return (
    <div>
      <div className='hidden md:bg-green-800 md:w-full md:space-x-3 p-2 mt-2 md:flex rounded-full'>
        <p className='text-orange-600 cursor-pointer font-bold text-xl text-center'>Notifications</p>
        <p className='text-orange-600 cursor-pointer font-bold text-xl text-center'>Contacts</p>
        <p className='text-orange-600 cursor-pointer font-bold text-xl text-center'>Post</p>
        <p className='text-orange-600 cursor-pointer font-bold text-xl text-center'>Services</p>
        <p className='text-orange-600 cursor-pointer font-bold text-xl text-center'>Biographie</p>
      </div>
      <div className="flex flex-center">
        <FaPlus className='md:hidden' size={50} onClick={toggleIcons} />
        <div className={`transition-all duration-500 ease-in-out md:hidden ${showIcons ? 'opacity-100' : 'opacity-0 pointer-events-none'} flex space-x-5 mt-2`}>
          <div className=" cursor-pointer">
            <IoIosContacts size={50} />
            <p className=" text-orange-500 font-bold">Contacts</p>
          </div>
          <div className=" cursor-pointer">
            <IoIosNotifications size={50} />
            <p className=" text-orange-500 font-bold">Notifs</p>
          </div>
          <div className=" cursor-pointer">
            <FaServicestack size={50} />
            <p className=" text-orange-500 font-bold">Services</p>
          </div>
          <div className=" cursor-pointer">
            <BsFillFilePostFill size={50} />
            <p className=" text-orange-500 font-bold">Post</p>
          </div>
          <div className=" cursor-pointer">
            <MdManageAccounts size={50} />
            <p className=" text-orange-500 font-bold">compte</p>
          </div>
        </div>
      </div>
    </div>
  );
}
