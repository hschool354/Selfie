import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const CULTIVATION_URL = `${API_BASE_URL}/cultivation/levels`;
const USER_CULTIVATION_URL = `${API_BASE_URL}/user-cultivation`;

// Define types based on your backend DTOs
export interface CultivationLevelResponse {
  levelId: number;
  levelName: string;
  levelDescription?: string;
  booksRequired: number;
  readingTimeRequired: number;
  iconUrl: string;
}

export interface CultivationLevelRequest {
  levelName: string;
  levelDescription?: string;
  booksRequired: number;
  readingTimeRequired: number;
  iconUrl: string;
}

// User Cultivation interfaces based on your Java model
export interface UserCultivationResponse {
  userId: number;
  currentLevel: CultivationLevelResponse;
  totalBooksRead: number;
  totalReadingTime: number;
  cultivationPoints: number;
  lastLevelUpDate: string; // ISO date string format
}

export interface UserCultivationRequest {
  userId: number;
  currentLevel: { levelId: number };
  totalBooksRead: number;
  totalReadingTime: number;
  cultivationPoints: number;
  lastLevelUpDate?: string;
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

// Combined Cultivation Service API functions
const cultivationService = {
  
  // Cultivation Level API functions
  
  // Get all cultivation levels
  getAllCultivationLevels: (): Promise<AxiosResponse<CultivationLevelResponse[]>> => {
    return axios.get(CULTIVATION_URL, setAuthHeader());
  },

  // Get cultivation level by ID
  getCultivationLevelById: (levelId: number): Promise<AxiosResponse<CultivationLevelResponse>> => {
    return axios.get(`${CULTIVATION_URL}/${levelId}`, setAuthHeader());
  },

  // User Cultivation API functions

  // Get all user cultivations
  getAllUserCultivations: (): Promise<AxiosResponse<UserCultivationResponse[]>> => {
    return axios.get(USER_CULTIVATION_URL, setAuthHeader());
  },

  // Get user cultivation by user ID
  getUserCultivationById: (userId: number): Promise<AxiosResponse<UserCultivationResponse>> => {
    return axios.get(`${USER_CULTIVATION_URL}/${userId}`, setAuthHeader());
  },

  // Create new user cultivation record
  createUserCultivation: (userCultivation: UserCultivationRequest): Promise<AxiosResponse<UserCultivationResponse>> => {
    return axios.post(USER_CULTIVATION_URL, userCultivation, setAuthHeader());
  },

  // Update user cultivation record (based on userId in the request)
  updateUserCultivation: (userCultivation: UserCultivationRequest): Promise<AxiosResponse<UserCultivationResponse>> => {
    return axios.post(USER_CULTIVATION_URL, userCultivation, setAuthHeader());
  },

  // Delete user cultivation by user ID
  deleteUserCultivation: (userId: number): Promise<AxiosResponse<void>> => {
    return axios.delete(`${USER_CULTIVATION_URL}/${userId}`, setAuthHeader());
  },

  // Additional helper methods you might need

  // Increment user's books read count
  incrementBooksRead: (userId: number): Promise<AxiosResponse<UserCultivationResponse>> => {
    return axios.post(`${USER_CULTIVATION_URL}/${userId}/increment-books`, {}, setAuthHeader());
  },

  // Add reading time to user's total
  addReadingTime: (userId: number, minutes: number): Promise<AxiosResponse<UserCultivationResponse>> => {
    return axios.post(`${USER_CULTIVATION_URL}/${userId}/add-reading-time`, { minutes }, setAuthHeader());
  }

  // Note: The two helper methods above would require additional endpoints in your backend controller
};

export default cultivationService;