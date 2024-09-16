import { Dispatch, useState } from 'react';
import { Register } from '../types';
import { registerUser } from '../services/authService';

type ModalProps = {
  setShowRegister: Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterComponent({ setShowRegister }: ModalProps) {
  const [formData, setFormData] = useState<Register>({
    Username: '',
    Email: '',
    Password: ''
  });
  const [registerError, setRegisterError] = useState('');

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
      await registerUser(formData);
      console.log(formData);
      setShowRegister(false);
    } catch (error) {
      setRegisterError('Error: Failed to register user');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-teal-900">Create a New Account</h2>
      </div>
      <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label htmlFor="username" className="text-black">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            className="px-2 py-1 border border-gray-300 rounded text-black"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-black">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="px-2 py-1 border border-gray-300 rounded text-black"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="text-black">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="px-2 py-1 border border-gray-300 rounded text-black"
            onChange={handleChange}
          />
        </div>
        {registerError && (
          <div className="text-red-500 text-right text-xs mb-2">{registerError}</div>
        )}
        <div className='pt-5'>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-slate-200 hover:text-black shadow-md transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
