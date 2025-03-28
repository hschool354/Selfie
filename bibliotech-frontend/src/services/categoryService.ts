import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const CATEGORIES_URL = `${API_BASE_URL}/categories`;

// Define types based on your backend model
export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description?: string;
  parentCategoryId?: number;
}

export interface CategoryRequest {
  categoryName: string;
  description?: string;
  parentCategoryId?: number;
}

// Helper function to set auth token for requests
const setAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// Category Service API functions
const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<AxiosResponse<CategoryResponse[]>> => {
    try {
      console.log("Fetching all categories...");
      const response = await axios.get(CATEGORIES_URL, setAuthHeader());
      console.log("Fetched categories:", response.data); // Debug log
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          console.error("Access denied: You do not have permission to access categories.");
          throw new Error("Access denied. Please check your permissions.");
        }
        console.error("Error fetching categories:", error.message);
      }
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: (categoryId: number): Promise<AxiosResponse<CategoryResponse>> => {
    return axios.get(`${CATEGORIES_URL}/${categoryId}`, setAuthHeader());
  },

  // Add a new category (admin only)
  addCategory: (categoryRequest: CategoryRequest): Promise<AxiosResponse<CategoryResponse>> => {
    return axios.post(CATEGORIES_URL, categoryRequest, setAuthHeader());
  },

  // Update an existing category (admin only)
  updateCategory: (categoryId: number, categoryRequest: CategoryRequest): Promise<AxiosResponse<CategoryResponse>> => {
    return axios.put(`${CATEGORIES_URL}/${categoryId}`, categoryRequest, setAuthHeader());
  },

  // Delete a category (admin only)
  deleteCategory: (categoryId: number): Promise<AxiosResponse<void>> => {
    return axios.delete(`${CATEGORIES_URL}/${categoryId}`, setAuthHeader());
  },
};

export default categoryService;
