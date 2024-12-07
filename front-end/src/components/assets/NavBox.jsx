import React from 'react';
import { FaUser, FaHome, FaBell, FaUsers, FaCalendarAlt, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';

export default function NavBox() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    return (
        <div className={`
            lg:border-2 lg:border-gray-300 lg:rounded-2xl lg:bg-white
            lg:transform lg:hover:-translate-y-1 lg:transition-all lg:duration-300
            fixed bottom-0 left-0 right-0 lg:relative
            bg-white lg:bg-transparent
            border-t border-gray-200 lg:border-t-0
            shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
            z-50 lg:z-auto
            w-full
        `}>
            <div className='
                flex justify-between
                p-1
                
                lg:flex lg:flex-col 
                lg:gap-2 
                lg:p-2
            '>
                {/* Accueil */}
                <button
                    onClick={() => navigate('/')}
                    className={`
                        flex-1
                        flex flex-col items-center justify-center
                        mx-1
                        py-1.5 
                        text-[10px] lg:text-sm font-medium
                        lg:flex-row lg:justify-start
                        lg:p-3 lg:rounded-xl lg:w-full
                        transition-colors duration-300
                        ${location.pathname === '/'
                            ? 'text-green-600 lg:bg-green-100 lg:text-green-700 lg:border-2 lg:border-green-400'
                            : 'text-gray-600 hover:text-green-600 lg:bg-gray-100 lg:border-2 lg:border-gray-300 lg:hover:border-green-400'
                        }
                    `}
                >
                    <FaHome className="w-5 h-5 mb-0.5 lg:mb-0 lg:mr-2" />
                    <span className="lg:flex-1">Accueil</span>
                </button>

                {/* Profil */}
                <button
                    onClick={() => navigate(`/profile/${user?.public_id}`)}
                    className={`
                        flex-1
                        flex flex-col lg:flex-row items-center justify-center lg:justify-start
                        py-1.5 px-1 lg:p-3 lg:rounded-xl w-full
                        text-[10px] lg:text-sm font-medium
                        transition-colors duration-300
                        ${location.pathname.includes('/profile')
                            ? 'text-green-600 lg:bg-green-100 lg:text-green-700 lg:border-2 lg:border-green-400'
                            : 'text-gray-600 hover:text-green-600 lg:bg-gray-100 lg:border-2 lg:border-gray-300 lg:hover:border-green-400'
                        }
                    `}
                >
                    <FaUser className="w-5 h-5 mb-0.5 lg:mb-0 lg:mr-2" />
                    <span className="lg:flex-1">Profil</span>
                </button>

                {/* Communauté */}
                <button
                    onClick={() => navigate('/community')}
                    className={`
                        flex-1
                        flex flex-col lg:flex-row items-center justify-center lg:justify-start
                        py-1.5 px-1 lg:p-3 lg:rounded-xl w-full
                        text-[10px] lg:text-sm font-medium
                        transition-colors duration-300
                        ${location.pathname === '/community'
                            ? 'text-green-600 lg:bg-green-100 lg:text-green-700 lg:border-2 lg:border-green-400'
                            : 'text-gray-600 hover:text-green-600 lg:bg-gray-100 lg:border-2 lg:border-gray-300 lg:hover:border-green-400'
                        }
                    `}
                >
                    <FaUsers className="w-5 h-5 mb-0.5 lg:mb-0 lg:mr-2" />
                    <span className="lg:flex-1">Communauté</span>
                </button>

            </div>
        </div>
    );
}
