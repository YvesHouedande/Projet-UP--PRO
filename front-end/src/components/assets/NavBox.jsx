import React from 'react'
import NavboxOption from './NavboxOption'
import { FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { GiThreeFriends } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import { FcTimeline } from "react-icons/fc";


export default function NavBox() {
  return (
    <div className='bg-gray-100 p-1'>
        <NavboxOption
        title="Profil"
        Icon={FaUser}
        counter={105}
        >
        </NavboxOption>

        {/* <NavboxOption
        title="Amis"
        Icon={FaUserFriends}
        counter={105}
        >
        </NavboxOption> */}

        {/* <NavboxOption
        title="Messages"
        Icon={FaMessage }
        counter={105}
        >
        </NavboxOption> */}

        <NavboxOption
        title="Promos"
        Icon={GiThreeFriends}
        >
        </NavboxOption>

        <NavboxOption
        title="Filière"
        Icon={HiAcademicCap}
        counter={105}
        >
        </NavboxOption>

        <NavboxOption
        title="Notififications"
        Icon={IoIosNotifications }
        counter={105}
        >
        </NavboxOption>

        <NavboxOption
        title="Evenements"
        Icon={FcTimeline }
        counter={105}
        >
        </NavboxOption>
    </div>
  )
}
