import React from 'react';
import { Avatar, Badge } from 'flowbite-react';
import AvatarImg from "../../assets/avatar-1.jpg";

export default function Comment({ comment }) {
  return (
    <div>
      <hr className="my-3 border-zinc-950" />
      <div className="head flex justify-between">
        <div className="header_right flex">
          <Avatar img={AvatarImg} rounded bordered />
          <div className="text_info mx-2 mt-2">
            <p>{comment.author.name}</p>
            <p>{comment.author.title}</p>
          </div>
        </div>
        <div className="header_left text-right">
          <Badge color="success" size="sm">
            {comment.author.role}
          </Badge>
          <p>{comment.date}</p>
          <p>{comment.time}</p>
        </div>
      </div>
      <hr className="my-1" />
      <div className="content">
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          {comment.description}
        </p>
      </div>
    </div>
  );
}
