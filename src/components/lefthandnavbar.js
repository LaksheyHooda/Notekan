"use client";

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
    <div className="flex h-screen absolute z-10">
      <Button
        className="bg-transparent fill-current text-black hover:text-red-500 rounded-md transition-colors"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          " "
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12H20"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 18H20"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Button>
      <div
        className={`fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-white shadow-lg rounded-r-3xl p-6 flex flex-col justify-between relative">
          <div className="absolute top-4 right-4">
            <Button
              onClick={toggleSidebar}
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 focus:outline-none w-10 h-10"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </Button>
          </div>
          <div>
            <div className="mt-12   md:border-2 rounded-full p-4">
              <Link href="/" className="md:w-48 md:h-48 max-w-full h-auto">
                <img
                  src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1224184972.1714089600&semt=sph"
                  alt="Logo"
                  className="rounded-full"
                />
              </Link>
            </div>

            <nav className="mt-8">
              <Link
                href="/dashboard"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <span className="font-medium text-gray-800">Dashboard</span>
              </Link>
              <Link
                href="/dashboard/processed"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 7V21H18V7H6Z"
                    fill="#F3F4F6"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 7V3H14L18 7V21H6V7Z"
                    fill="#FFFFFF"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3V7H18"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11H14"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 15H14"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M5 6V20H17V6H5Z"
                    fill="#F3F4F6"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 6V2H13L17 6V20H5V6Z"
                    fill="#FFFFFF"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 2V6H17"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 10H13"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 14H13"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M4 5V19H16V5H4Z"
                    fill="#F3F4F6"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 5V1H12L16 5V19H4V5Z"
                    fill="#FFFFFF"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 1V5H16"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9H12"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 13H12"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium text-gray-800">Documents</span>
              </Link>
              <Link
                href="/dashboard/archive"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V8H4V6Z"
                    fill="#ccc"
                  />
                  <path
                    d="M20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V10H20Z"
                    fill="#999"
                  />
                  <path d="M8 14H16V16H8V14Z" fill="#333" />
                  <path d="M8 10H16V12H8V10Z" fill="#333" />
                </svg>
                <span className="font-medium text-gray-800">Archive</span>
              </Link>
              <Link
                href="/dashboard/customtemplates"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                <span className="font-medium text-gray-800">
                  Custom Templates
                </span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="#6B7280"
                    strokeWidth="2"
                  />
                  <path
                    d="M23 21v-2a4 4 0 0 0-3-3.87"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium text-gray-800">About</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/login"
              className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span className="font-medium text-gray-800">Logout</span>
            </Link>
            <Link
              href="#"
              className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
