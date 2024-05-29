import { FormEvent, useState } from 'react';
import { CategoryForm } from '../types';
import { createCategory } from '../services/categoryService';
import { useAuth } from '../context/AuthProvider';

export default function CategoryFormComponent() {
    const auth = useAuth();
    // State to manage form data and categories
    const [formData, setFormData] = useState<CategoryForm>({
        name: '',
        user_id: auth?.authState.id || 0,
    });

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await createCategory(formData);
            console.log('Category created successfully');
            window.location.reload(); // Refresh the page after submission
        } catch (error) {
            console.error('Error submitting the category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-2 bg-white">
            <h2 className="text-2xl font-bold mb-4">Create Category</h2>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-slate-200 hover:text-black shadow-md transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Create
                </button>
            </div>
        </form>
    );
}
