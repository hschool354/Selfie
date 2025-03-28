import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const WISHLIST_URL = `${API_BASE_URL}/wishlist`;

// Define types based on your backend Wishlist model
export interface WishlistResponse {
  wishlistId: number;
  userId: number;
  bookId: number;
  addedDate: string; // ISO date string (e.g., "2025-03-28T12:00:00")
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

// Wishlist Service API functions
const wishlistService = {
  // Get current user's wishlist
  getMyWishlist: (): Promise<AxiosResponse<WishlistResponse[]>> => {
    return axios.get(WISHLIST_URL, setAuthHeader());
  },

  // Get wishlist of a specific user (admin only)
  getUserWishlist: (userId: number): Promise<AxiosResponse<WishlistResponse[]>> => {
    return axios.get(`${WISHLIST_URL}/users/${userId}`, setAuthHeader());
  },

  // Add book to current user's wishlist
  addBookToWishlist: (bookId: number): Promise<AxiosResponse<WishlistResponse>> => {
    return axios.post(
      `${WISHLIST_URL}/add`,
      null,
      {
        ...setAuthHeader(),
        params: { bookId }
      }
    );
  },

  // Remove book from current user's wishlist
  removeBookFromWishlist: (bookId: number): Promise<AxiosResponse<string>> => {
    return axios.delete(
      `${WISHLIST_URL}/remove`,
      {
        ...setAuthHeader(),
        params: { bookId }
      }
    );
  }
};

export default wishlistService;