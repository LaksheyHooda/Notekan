"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { useEffect } from "react";
import { Link } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="absolute z-10">
      <Button
        className="bg-transparent text-black hover:text-white rounded-md transition-colors"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          " "
        ) : (
          <FontAwesomeIcon
            className="text-xl"
            aria-hidden="true"
            icon={faAnglesRight}
          />
        )}
      </Button>
      <div
        className={`fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
          <img
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1224184972.1714089600&semt=sph"
            alt="Logo"
            className="h-8 w-auto"
          />
          {/* temperary logo until we have one*/}
          <ul className="mt-4">
            <li>
              <Link href="/about" className="block p-4 hover:bg-gray-700">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="block p-4 hover:bg-gray-700">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block p-4 hover:bg-gray-700">
                Contact
              </Link>
            </li>
          </ul>

          <div className="absolute bottom-0 w-full">
            <Button
              className="bg-transparent text-black hover:text-white rounded-md transition-colors"
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon
                className="text-xl"
                aria-hidden="true"
                icon={faAnglesLeft}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
