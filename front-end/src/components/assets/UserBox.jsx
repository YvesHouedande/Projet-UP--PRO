import React from "react";
import InpBan from "../../assets/Logo-INP-HB.png";
import AvatarImg from "../../assets/avatar-1.jpg";


import { Avatar } from "flowbite-react";


export default function UserBox({name, lastPub, role, school}) {
  return (
    <div className=" mb-5 bg-gray-100 hidden lg:block">
      <img src={InpBan} alt="inpBan" />
      <div className="flex px-4 space-x-5">
        <Avatar img= {AvatarImg} rounded status="away" statusPosition="bottom-right" />
        <div className="">
            <p>{role}|{school}</p>
            <p>{name}</p>
        </div>
      </div>
      <p className="text-center underline hover:cursor-pointer text-green-500">Dernière Publication{lastPub}</p>
    </div>
  );
}
