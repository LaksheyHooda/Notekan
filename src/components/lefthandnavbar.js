'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { useState } from 'react';
import {Link} from "@nextui-org/react";
import {Button} from "@nextui-org/react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button className="p-4" onClick={toggleSidebar}>
                {isOpen ? 'Close' : <span className="text-xl">
                    <FontAwesomeIcon icon={faBars} />
                </span>} 
            </button>
            <div className={`${isOpen ? 'block' : 'hidden'} fixed top-0 left-0 h-full bg-gray-800 text-white w-64`}>
                <div className="p-4 border-b border-gray-700">
                    <img 
                        src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1224184972.1714089600&semt=sph" 
                        alt="Logo" 
                        className="h-8 w-auto" /> {/* temperary logo until we have one*/}
                </div>
                <ul className="mt-4">
                    <li><Link href="/about" className="block p-4 hover:bg-gray-700">About</Link></li>
                    <li><Link href="/services" className="block p-4 hover:bg-gray-700">Services</Link></li>
                    <li><Link href="/contact" className="block p-4 hover:bg-gray-700">Contact</Link></li>
                </ul>
            </div>
        </div>
    );
}