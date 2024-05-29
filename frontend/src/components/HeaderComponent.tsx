import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { useAuth } from '../context/AuthProvider';
import ModalComponent from './ModalComponent';
import RegisterComponent from './RegisterComponent';
import LoginComponent from './LoginComponent';

export default function HeaderComponent() {
  const auth = useAuth(); // Retrieve authentication context
  
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    // Clear localStorage data
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    // Implement logout logic here
    auth?.dispatch({ type: 'LOGOUT' }); // Dispatch logout action
  };

  return (
    <div className="flex items-center justify-between bg-teal-900 p-4 text-white shadow-md">
      <div className="flex items-center">
        {/* Logo and app name */}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
        </svg>
        <h1 className="text-lg font-bold">Note.Go</h1>
      </div>
      <div className="hidden md:flex items-center">
        {/* Conditional rendering based on authentication state */}
        {auth?.authState.loggedIn ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center hover:text-yellow-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="m-1">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
              </svg>
              {auth?.authState.username} {/* Display username from auth context */}
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-500 text-white' : 'text-gray-900'
                      } group flex items-center w-full px-2 py-2 text-sm`}
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        ) : (
          <div>
            {/* Modal trigger button */}
            <button className="btn-modal" onClick={() => setOpen(true)}>
              Log In
            </button>
            {/* Modal component for login/register */}
            <ModalComponent
              open={open}
              onClose={() => {
                setOpen(false);
                setShowRegister(false);
              }}
            >
              {showRegister ? (
                <RegisterComponent setShowRegister={setShowRegister} />
              ) : (
                <LoginComponent setShowRegister={setShowRegister} />
              )}
            </ModalComponent>
          </div>
        )}
      </div>
    </div>
  );
}
