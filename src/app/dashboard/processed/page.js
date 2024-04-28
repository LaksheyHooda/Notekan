"use client";

import { db, auth } from "@/config/firebase/config";
import { Link } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center inset-0 fixed h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg-px:6">
          <h1 className="text-3xl font-bold text-white">
            NoteKan File Storage
          </h1>
        </div>
      </header>

      <div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Link
                href="#"
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    File Name.pdf
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last Modified: April 28, 2024
                  </p>
                </div>
              </Link>

              <Link
                href="#"
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Image.jgp
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last Modified: April 27, 2024
                  </p>
                </div>
              </Link>

              <Link
                href="#"
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    File Name.pdf
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last Modified: April 28, 2024
                  </p>
                </div>
              </Link>

              <Link
                href="#"
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-cover bg-center"></div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Spreadsheet.xlsx
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last Modified: April 25, 2024
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
