import axios from "axios";
import { CategoryForm } from "../types";

const API_URL = 'http://localhost:8000';

export const getAllUserCategories = async (id: number | undefined) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        };
        const response = await axios.get(`${API_URL}/user/categories/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (newCategoryData: CategoryForm) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        };
        const response = await axios.post(`${API_URL}/user/categories`, newCategoryData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};