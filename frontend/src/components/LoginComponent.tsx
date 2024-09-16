import React, { Dispatch, useState } from 'react';
import { Login } from '../types';
import { useAuth } from '../context/AuthProvider';
import { Auth, loginUser } from '../services/authService';

type ModalProps = {
    setShowRegister: Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginComponent({ setShowRegister }: ModalProps) {
    const auth = useAuth(); // Retrieve authentication context

    // Check if authentication context is null
    if (!auth) {
        // Handle this case as needed, for example, render an error message
        return <div>Error: Authentication context not available</div>;
    }

    const { dispatch } = auth;

    const [formData, setFormData] = useState<Login>({ Username: "", Password: "" });
    const [loginError, setLoginError] = useState('');

    const handleRegister = () => {
        setShowRegister(true); // Show registration modal
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData); // Attempt to login with form data
            console.log(data);
            if (data) {
                const { token, id, username, message } = data;
                localStorage.setItem('token', token); // Store token in localStorage
                localStorage.setItem('username', username); // Store username in localStorage
                localStorage.setItem('id', id); // Store user ID in localStorage

                // Check if user is an admin
                const isAdminResponse = await Auth(token);
                const isAdmin = isAdminResponse.isAdmin;

                // Dispatch login success action if not already logged in
                if (!auth.authState.loggedIn) {
                    dispatch({
                        type: 'LOGIN_SUCCESS', payload: {
                            username, token,
                            isAdmin,
                            id
                        }
                    });
                }
                console.log(message); // Log success message
                window.location.reload(); // Refresh the page (temporary solution)
            } else {
                console.error('Error: Login response does not contain data'); // Handle case where response data is undefined or null
            }
        } catch (error) {
            setLoginError('Error: Incorrect username or password'); // Set login error message
            console.error(error); // Log error to console
        }
    };

    return (
        <div className="max-w-md w-full space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-teal-900">Sign in to your account</h2>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                <div className="rounded-md -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input id="email-address" name="username" type="text" autoComplete="email" required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                            placeholder="Username or Email address"
                            onChange={handleChange} />
                    </div>
                    <div className='shadow-sm'>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            onChange={handleChange} />
                    </div>
                    {loginError && (
                        <div className="text-red-500 text-right text-xs mb-2">{loginError}</div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox"
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>

                    <div className="btn-modal text-sm">
                        <div className="font-medium text-teal-700 hover:text-teal-600" onClick={handleRegister}>
                            Create an account
                        </div>
                        <div className="text-sm font-medium text-teal-700 hover:text-teal-600">
                            Forgot your password?
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-slate-200 hover:text-black shadow-md transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    )
}
