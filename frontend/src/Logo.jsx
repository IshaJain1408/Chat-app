import { useState } from 'react';

export default function Logo(){
    const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen)};
    return(
        <div className="flex items-center justify-between gap-2 p-4 font-bold text-gray-700">
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
<path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
</svg> */}
<div className='flex items-center justify-between'></div>
WaveMessenger
<div className="relative inline-block">
        {/* Dropdown toggle button */}
        <button
          onClick={toggleDropdown}
          className="relative z-10 block p-2 text-gray-700 border border-transparent rounded-md focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="absolute right-0 z-20 w-48 py-2 mt-2 origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800"
          >
            {/* Dropdown items */}
            <a
              href="#"
              className="flex items-center px-3 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {/* Replace this with your icon */}
              <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Replace with your path data */}
                <path d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z" fill="currentColor"></path>
              </svg>

              <span className="mx-1">View Profile</span>
            </a>

            {/* Add more dropdown items as needed */}
            {/* ... */}

            {/* Separator */}
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Another dropdown item */}
            <a
              href="#"
              className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {/* Replace this with your icon */}
              <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Replace with your path data */}
                <path d="M13 22H11C11 19.2386 13.2386 17 16 17C18.7614 17 21 19.2386 21 22ZM16 16V18C16 19.1046 16.8954 20 18 20C19.1045 20 20 19.1046 20 18C20 16.8954 19.1045 16 18 16H16ZM9.99996 16C8.89539 16 7.99996 16.8954 7.99996 18C7.99996 19.1046 8.89539 20 9.99996 20C10.5321 20.0057 11.0441 19.7968 11.4204 19.4205C11.7967 19.0442 12.0056 18.5321 12 17.9999V16H9.99996ZM13 9.99999V14H17V9.99999H13ZM18 3.99999C17.4678 3.99431 16.9558 4.2032 16.5795 4.57952C16.2032 4.95583 15.9943 5.46784 16 5.99999V7.99999H18C18.5321 8.00567 19.0441 7.79678 19.4204 7.42047C19.7967 7.04416 20.0056 6.53215 20 5.99999C20.0056 5.46783 19.7967 4.95582 19.4204 4.57951C19.0441 4.2032 18.5321 3.99431 18 3.99999ZM14 2.99999V5.99999H16V2.99999H14ZM11.5 8.99999C11.2239 8.99999 11 9.22386 11 9.49999C11 9.77612 11.2239 9.99999 11.5 9.99999C11.7761 9.99999 12 9.77612 12 9.49999C12 9.22386 11.7761 8.99999 11.5 8.99999Z" fill="currentColor"></path>
              </svg>

              <span className="mx-1">Settings</span>
            </a>
          </div>
        )}
      </div>
        </div>
    )
}