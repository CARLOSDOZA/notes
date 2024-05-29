import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Category, NoteForm, NoteItem } from '../types';
import { createNote, updateNote } from '../services/noteService';
import { getAllUserCategories } from '../services/categoryService';
import CategoryFormComponent from './CategoryFormComponent';

type FormJobProps = {
    note?: NoteItem;
    isUpdate: boolean;
};

export default function NoteFormComponent({ note, isUpdate }: FormJobProps) {
    const auth = useAuth();
    const userId = auth?.authState.id;
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    // State to manage form data and categories
    const [formData, setFormData] = useState<NoteForm>({
        user_id: auth?.authState.id || 0,
        category_id: note ? note.category_id : 0,
        title: note ? note.title : '',
        content: note ? note.content : ''
    });
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllUserCategories(userId);
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [userId]);

    // Handle input changes for text fields and select
    const handleStringChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Convert the value to a number if necessary
        const numValue = name === 'category_id' ? Number(value) : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: numValue
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (isUpdate) {
                await updateNote(formData, note?.ID);
                console.log('Note updated successfully');
            } else {
                await createNote(formData);
                console.log('Note created successfully');
            }
            window.location.reload(); // Refresh the page after submission
        } catch (error) {
            console.error('Error submitting the note:', error);
        }
    };

    return (
        <>
            {showCategoryForm ? (
                <CategoryFormComponent />
            ) : (
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-2 bg-white">
                    <h2 className="text-2xl font-bold mb-4">{isUpdate ? 'Update Note' : 'Create Note'}</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleStringChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleStringChange}
                            className="w-full p-2 border border-gray-300 rounded-md h-48"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <select
                            id="category_id"
                            name="category_id"
                            onChange={handleStringChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value={0} disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.ID} value={cat.ID} className='text-black'>{cat.name}</option>
                            ))}
                        </select>

                        <button 
                            type="button"
                            className="ml-3 shadow-md rounded-md bg-teal-500 w-8 h-8 text-white font-black hover:bg-white hover:text-black transition duration-500 ease-in-out"
                            onClick={() => setShowCategoryForm(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-slate-200 hover:text-black shadow-md transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            {isUpdate ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}
