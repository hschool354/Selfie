import axios from 'axios';
import AxiosResponse from 'axios' 

const API_BASE_URL = "http://localhost:8080/api/users";

export interface ProfileDataDto {
  fullName: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  nationality: string;
  bio: string;
  profilePictureUrl?: string;
}

export interface UserDto {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  accountBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDto {
  userId: number;
  fullName: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  nationality: string;
  bio: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesDto {
  userId: number;
  preferredCategoryId: number;
  preferenceWeight: number;
}

export interface UserBalanceDto {
  userId: number;
  username: string;
  accountBalance: number;
}

export interface UserLibraryDto {
  userId: number;
  bookId: number;
  addedDate: string;
  status: 'SAVED' | 'READING' | 'COMPLETED' | 'ABANDONED';
  progressPercentage: number;
  lastReadDate: string;
}

export interface ReadingHistoryDto {
  historyId?: number;
  userId: number;
  bookId: number;
  startTime: string;
  endTime: string;
  pagesRead: number;
  currentPage: number;
}

export interface BookStatusUpdateDto {
  status?: 'SAVED' | 'READING' | 'COMPLETED' | 'ABANDONED';
  progress?: number;
}

// Authentication helper
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const usersService = {
  // Complete user profile
  completeProfile: async (formData: ProfileDataDto): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/complete-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data?.message || "Failed to complete profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to complete profile";
        console.error("Complete profile error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Get current user information
  getCurrentUser: async (): Promise<UserDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get current user";
        console.error("Get current user error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Get current user profile
  getCurrentUserProfile: async (): Promise<UserProfileDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me/profile`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get current user profile";
        console.error("Get current user profile error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Update current user profile
  updateCurrentUserProfile: async (profileData: ProfileDataDto): Promise<UserProfileDto> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/me/profile`,
        profileData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update user profile";
        console.error("Update user profile error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Get current user balance
  getCurrentUserBalance: async (): Promise<UserBalanceDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me/balance`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get user balance";
        console.error("Get user balance error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Get specific user by ID
  getUserById: async (userId: number): Promise<UserDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get user";
        console.error("Get user error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Get specific user profile by ID
  getUserProfileById: async (userId: number): Promise<UserProfileDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}/profile`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get user profile";
        console.error("Get user profile error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Update specific user profile by ID
  updateUserProfileById: async (userId: number, profileData: ProfileDataDto): Promise<UserProfileDto> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${userId}/profile`,
        profileData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update user profile";
        console.error("Update user profile error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Update registration status
  updateRegistrationStatus: async (isProfileCompleted: boolean): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/registration-status`,
        { isProfileCompleted },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update registration status";
        console.error("Update registration status error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // User Preferences
  getUserPreferences: async (): Promise<UserPreferencesDto[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/preferences`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get user preferences";
        console.error("Get user preferences error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  updateUserPreferences: async (preferences: UserPreferencesDto[]): Promise<UserPreferencesDto[]> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/preferences`,
        preferences,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update user preferences";
        console.error("Update user preferences error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // User Library 
  getUserLibrary: async (): Promise<UserLibraryDto[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/library`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get user library";
        console.error("Get user library error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  addBookToLibrary: async (bookId: number): Promise<UserLibraryDto> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/library`,
        { bookId: bookId },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to add book to library";
        console.error("Add book to library error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  updateBookStatus: async (bookId: number, updateData: BookStatusUpdateDto): Promise<UserLibraryDto> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/library/${bookId}`,
        updateData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update book status";
        console.error("Update book status error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Reading History
  getReadingHistory: async (): Promise<ReadingHistoryDto[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reading-history`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to get reading history";
        console.error("Get reading history error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  recordReadingSession: async (readingSession: ReadingHistoryDto): Promise<ReadingHistoryDto> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reading-history`,
        readingSession,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to record reading session";
        console.error("Record reading session error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },

  getAllUsers: async (): Promise<AxiosResponse<UserDto[]>> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        throw new Error("Authentication token is missing. Please log in again.");
      }

      console.log("Using token:", token); // Debug log
      const response = await axios.get(`${API_BASE_URL}/all`, getAuthHeader());
      console.log("Fetched all users:", response.data); // Debug log
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          console.error("Access denied: Admin privileges are required.");
          throw new Error("Access denied. Only admins can access this resource.");
        }
        console.error("Error fetching all users:", error.message);
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export default usersService;

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};