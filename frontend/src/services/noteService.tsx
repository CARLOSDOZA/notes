import axios from "axios";
import { NoteForm } from "../types";

const API_URL = 'http://localhost:8000'; 
export const getAllUserNotes = async (id: number | undefined) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        };
        const response = await axios.get(`${API_URL}/user/notes/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

export const deleteNote = async (id: number) => {
    try {
        const token = localStorage.getItem('token'); 
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        };
        const response = await axios.delete(`${API_URL}/user/note/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }

};

export const createNote = async (newJobData: NoteForm) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/user/note`, newJobData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating a new note:', error);
        throw error;
    }
};

export const updateNote = async (newJobData: NoteForm, id?: number) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/user/note/${id}`, newJobData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
};

export const archiveNote = async (id: number) => {
    try {

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/user/archive/${id}`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Error archiving note:', error);
        throw error;
    }
};