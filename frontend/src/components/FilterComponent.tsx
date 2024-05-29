import React, { Dispatch, useEffect, useState } from 'react';
import { getAllUserCategories } from '../services/categoryService';
import { Category } from '../types';
import ToolTipComponent from './ToolTipComponent';
import ModalComponent from './ModalComponent';
import { useAuth } from '../context/AuthProvider';
import CategoryFormComponent from './CategoryFormComponent';
import RegisterComponent from './RegisterComponent';
import LoginComponent from './LoginComponent';

type FilterComponentProps = {
    setJobNameFilter: Dispatch<React.SetStateAction<string>>;
    setDateFilter: Dispatch<React.SetStateAction<Date | null>>;
    setArchivedFilter: Dispatch<React.SetStateAction<boolean>>;
    setCategoryFilter: Dispatch<React.SetStateAction<number>>;
};

export default function FilterComponent({ setJobNameFilter, setDateFilter, setArchivedFilter, setCategoryFilter }: FilterComponentProps) {
    const [isArchived, setIsArchived] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const auth = useAuth();
    const userId = auth?.authState.id;


    const isLogged = auth?.authState.loggedIn

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllUserCategories(userId);
                console.log(response)
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobNameFilter(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const numValue = Number(e.target.value);
        setCategoryFilter(numValue);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const dateValue = new Date(e.target.value);
            dateValue.setUTCHours(5, 0, 0, 0);
            setDateFilter(dateValue);
        } else {
            setDateFilter(null);
        }
    };

    const handleArchivedToggle = (archivedStatus: boolean) => {
        setIsArchived(archivedStatus);
        setArchivedFilter(archivedStatus);
    };

    return (
        <div className="m-5">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="textFilter">Title:</label>
                <input
                    type="text"
                    id="textFilter"
                    name="textFilter"
                    placeholder="Title"
                    onChange={handleNameChange}
                    className="px-2 py-1 border border-gray-300 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="category_id">
                    Category
                </label>
                <div className="flex items-center">
                    <select
                        id="category_id"
                        name="category_id"
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value={0} disabled>Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.ID} value={cat.ID} className='text-black'>{cat.name}</option>
                        ))}
                    </select>
                    <ToolTipComponent tooltip="Add Category">
                        <button className="ml-3 shadow-md rounded-md bg-teal-500 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out"
                            onClick={() => setOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </ToolTipComponent>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="dateFilter">Date:</label>
                <input
                    type="date"
                    id="dateFilter"
                    name="dateFilter"
                    onChange={handleDateChange}
                    className="px-2 py-1 border border-gray-300 rounded w-full"
                />
            </div>
            <div className="flex items-center mb-4 w-full pt-5">
                <button
                    type="button"
                    onClick={() => handleArchivedToggle(true)}
                    className={`px-4 py-2 w-full transition duration-300 ${isArchived ? 'bg-teal-500 text-white shadow-inner' : 'bg-gray-300 text-black hover:bg-teal-400 hover:text-white hover:shadow-md'}`}
                    disabled={isArchived}
                >
                    Archived
                </button>
                <button
                    type="button"
                    onClick={() => handleArchivedToggle(false)}
                    className={`px-4 py-2 w-full transition duration-300 ${!isArchived ? 'bg-teal-500 text-white shadow-inner' : 'bg-gray-300 text-black hover:bg-teal-400 hover:text-white hover:shadow-md'}`}
                    disabled={!isArchived}
                >
                    Not Archived
                </button>
            </div>
            <ModalComponent
                open={open}
                onClose={() => {
                    setOpen(false);
                    setShowRegister(false);
                }}>
                {isLogged ? (
                    <CategoryFormComponent />
                ) : showRegister ? (
                    <RegisterComponent setShowRegister={setShowRegister} />
                ) : (
                    <LoginComponent setShowRegister={setShowRegister} />
                )}
            </ModalComponent>
        </div>
    );
}
