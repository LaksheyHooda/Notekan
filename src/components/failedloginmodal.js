// components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  setTimeout(() => {
    onClose();
  }, 5000);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center items-start">
      <div
        className="w-full bg-red-100 border-b border-red-400 text-red-700 px-4 py-4 rounded-b-lg text-center"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{message}</span>
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-red-500 focus:outline-none focus:shadow-outline"
        >
          <svg
            className="fill-current h-6 w-6"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 3.152a1.2 1.2 0 1 1-1.698-1.697l2.651-3.152-2.651-3.152a1.2 1.2 0 1 1 1.698-1.697L10 8.303l2.651-3.152a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 3.152a1.2 1.2 0 0 1 0 1.697z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Modal;
