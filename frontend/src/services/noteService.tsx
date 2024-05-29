import axios from "axios";
import { NoteForm } from "../types";

const API_URL = 'http://localhost:8000'; // URL de tu backend

export const getAllUserNotes = async (id: number | undefined) => {
    try {
        // Obtén el token JWT del local storage
        const token = localStorage.getItem('token');
        // Configura los encabezados de la solicitud con el token JWT
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Pasar el token JWT en el encabezado de autorización
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

        // Obtén el token JWT del local storage
        const token = localStorage.getItem('token'); // Asegúrate de cambiar 'jwt' por la clave real en la que guardas el token JWT
        console.log(token)
        // Configura los encabezados de la solicitud con el token JWT
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Pasar el token JWT en el encabezado de autorización
            },
        };
        // Realiza la solicitud POST con los datos del nuevo trabajo y los encabezados de autorización
        const response = await axios.delete(`${API_URL}/user/note/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }

};

export const createNote = async (newJobData: NoteForm) => {
    try {

        // Obtén el token JWT del local storage
        const token = localStorage.getItem('token');
        // Configura los encabezados de la solicitud con el token JWT
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Pasar el token JWT en el encabezado de autorización
            },
        };
        console.log(newJobData)

        // Realiza la solicitud POST con los datos del nuevo trabajo y los encabezados de autorización
        const response = await axios.post(`${API_URL}/user/note`, newJobData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating a new note:', error);
        throw error;
    }
};

export const updateNote = async (newJobData: NoteForm, id?: number) => {
    try {

        // Obtén el token JWT del local storage
        const token = localStorage.getItem('token'); // Asegúrate de cambiar 'jwt' por la clave real en la que guardas el token JWT
        console.log(token)
        // Configura los encabezados de la solicitud con el token JWT
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Pasar el token JWT en el encabezado de autorización
            },
        };

        // Realiza la solicitud POST con los datos del nuevo trabajo y los encabezados de autorización
        const response = await axios.put(`${API_URL}/user/note/${id}`, newJobData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
};

export const archiveNote = async (id: number) => {
    try {

        // Obtén el token JWT del local storage
        const token = localStorage.getItem('token'); // Asegúrate de cambiar 'jwt' por la clave real en la que guardas el token JWT
        console.log(token)
        // Configura los encabezados de la solicitud con el token JWT
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Pasar el token JWT en el encabezado de autorización
            },
        };
        console.log(token)
        // Realiza la solicitud POST con los datos del nuevo trabajo y los encabezados de autorización
        const response = await axios.put(`${API_URL}/user/archive/${id}`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Error archiving note:', error);
        throw error;
    }
};