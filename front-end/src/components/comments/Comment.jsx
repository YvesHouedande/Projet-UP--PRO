import React from 'react'
import { Avatar, Badge } from 'flowbite-react'
import AvatarImg from "../../assets/avatar-1.jpg";

export default function Comment() {
  return (
    <div>
        {/* Comment1 */}
        <div className="head flex justify-between">
            <div className="header_rigth flex ">
                  <Avatar img={AvatarImg} rounded bordered/>
                  <div className="text_info mx-2 mt-2">
                      <p>Md. Sita Coulibaly</p>
                      <p>Inspectrice de filiére</p>
                  </div>
            </div>
            <div className="header_left">
                <Badge color="success" size="sm">
                    Personnel 
                </Badge>
                <p>8 janvier 2023</p>
                <p>8H30min</p>
            </div>
          </div>
          <hr className="my-1" />
          <div className="content">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
              to ensure a common set of data rights in the European Union. It requires organizations to notify users as
              soon as possible of high-risk data breaches that could personally affect them.
            </p>
          </div>
          {/* Comment2 */}
          <hr className="my-3 border-zinc-950" />
            <div className="head flex justify-between">
            <div className="header_rigth flex ">
                  <Avatar img={AvatarImg} rounded bordered/>
                  <div className="text_info mx-2 mt-2">
                      <p>M. Yao alle Emmanuel</p>
                      <p>Ts Stic Info</p>
                  </div>
            </div>
            <div className="header_left">
                <Badge color="success" size="sm">
                    Etudiant
                </Badge>
                <p>8 janvier 2023</p>
                <p>8H30min</p>
            </div>
          </div>
          <hr className="my-1" />
          <div className="content">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
              to ensure a common set of data rights in the European Union. It requires organizations to notify users as
              soon as possible of high-risk data breaches that could personally affect them.
            </p>
          </div>
    </div>
  )
}
