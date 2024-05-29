import axios from 'axios';
import { Login, Register } from '../types';

const API_URL = 'http://localhost:8000'; // URL de tu backend

export const Auth = async (token: string | null) => {

    // Obtén el token JWT del local storage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Pasar el token JWT en el encabezado de autorización
        },
    };
    try {
        const response = await axios.get(`${API_URL}/auth/`, config);
        return response.data;
    } catch (error) {
        console.error('Error auth:', error);
        throw error;
    }
}

export const loginUser = async (loginData: Login) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, loginData);
        return response.data;
    } catch (error) {
        console.error('Error Login:', error);
        throw error;
    }
}

export const registerUser = async (registerData: Register) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, registerData);
        return response.data;
    } catch (error) {
        console.error('Error Register:', error);
        throw error;
    }
}