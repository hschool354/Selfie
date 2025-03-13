import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your books API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const BOOKS_URL = `${API_BASE_URL}/books`;

// Define types based on your backend DTOs
export interface BookRequest {
  title: string;
  author: string;
  isbn?: string;
  originalPrice: number;
  discountedPrice?: number;
  publicationYear?: number;
  language: string;
  pageCount?: number;
  description?: string;
  coverImageUrl?: string;
  stockQuantity: number;
  dealId?: number;
  readingDifficulty?: string;
  estimatedReadingTime?: number;
  contentRating?: string;
  categoryIds: number[];
}

export interface BookResponse {
  bookId: number;
  title: string;
  author: string;
  isbn?: string;
  originalPrice: number;
  discountedPrice?: number;
  publicationYear?: number;
  language: string;
  pageCount?: number;
  averageRating?: number;
  ratingCount?: number;
  description?: string;
  coverImageUrl?: string;
  stockQuantity: number;
  deal?: DealResponse;
  readingDifficulty?: string;
  estimatedReadingTime?: number;
  contentRating?: string;
  categories: CategoryResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DealResponse {
  dealId: number;
  // Add other deal properties as needed
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description?: string;
  parentCategory?: CategoryResponse;
}

export interface BookSaleInfoDTO {
  bookId: number;
  title: string;
  coverImageUrl: string;
  originalPrice: number;
  discountedPrice: number;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface Review {
  reviewId: number;
  bookId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CategoryDTO {
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

// Book Service API functions
const bookService = {
  
  // Get all books with optional filters
  // Sửa hàm getAllBooks trong bookService
getAllBooks: (
  title?: string,
  author?: string,
  category?: number,
  language?: string,
  minPrice?: number,
  maxPrice?: number,
  hasDiscount?: boolean,
  page: number = 0,
  size: number = 10,
  sortBy: string = "title",
  direction: string = "asc"
): Promise<AxiosResponse<BookResponse[]>> => {
  // Chỉ thêm các tham số được chỉ định vào URL
  const params = new URLSearchParams();
  
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sortBy', sortBy);
  params.append('direction', direction);
  
  if (title) params.append('title', title);
  if (author) params.append('author', author);
  if (category !== undefined) params.append('category', category.toString());
  if (language) params.append('language', language);
  if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
  if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
  // Chỉ gửi hasDiscount khi là true
  if (hasDiscount === true) params.append('hasDiscount', 'true');
  
  return axios.get(`${BOOKS_URL}?${params.toString()}`, setAuthHeader());
},

  // Get book by ID
  getBookById: (bookId: number): Promise<AxiosResponse<BookResponse>> => {
    const token = localStorage.getItem("token");
    return axios.get(`${BOOKS_URL}/${bookId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      }
    });
  },

  // Add a new book (admin only)
  addBook: (bookRequest: BookRequest): Promise<AxiosResponse<BookResponse>> => {
    return axios.post(BOOKS_URL, bookRequest, setAuthHeader());
  },

  // Update an existing book (admin only)
  updateBook: (bookId: number, bookRequest: BookRequest): Promise<AxiosResponse<BookResponse>> => {
    return axios.put(`${BOOKS_URL}/${bookId}`, bookRequest, setAuthHeader());
  },

  // Delete a book (admin only)
  deleteBook: (bookId: number): Promise<AxiosResponse<{message: string}>> => {
    return axios.delete(`${BOOKS_URL}/${bookId}`, setAuthHeader());
  },

  // Get reviews for a book
  getBookReviews: (
    bookId: number,
    page: number = 0,
    size: number = 10
  ): Promise<AxiosResponse<Review[]>> => {
    return axios.get(`${BOOKS_URL}/${bookId}/reviews?page=${page}&size=${size}`);
  },

  // Add a review to a book
  addBookReview: (
    bookId: number,
    reviewRequest: ReviewRequest
  ): Promise<AxiosResponse<Review>> => {
    return axios.post(`${BOOKS_URL}/${bookId}/reviews`, reviewRequest, setAuthHeader());
  },

  // Get sale books information
  getSaleBooksCoverInfo: (): Promise<AxiosResponse<BookSaleInfoDTO[]>> => {
    return axios.get(`${BOOKS_URL}/sale-books-info`, setAuthHeader());
  },

  // Get top rated books
  getTopRatedBooks: (limit: number = 5): Promise<AxiosResponse<BookResponse[]>> => {
    return axios.get(`${BOOKS_URL}/top-rated?limit=${limit}`, setAuthHeader());
  },

  // Get all book categories
  getAllCategories: (): Promise<AxiosResponse<CategoryDTO[]>> => {
    return axios.get(`${BOOKS_URL}/categories`, setAuthHeader());
  },

  // Add a new category (admin only)
  addCategory: (categoryRequest: CategoryRequest): Promise<AxiosResponse<CategoryDTO>> => {
    return axios.post(`${BOOKS_URL}/categories`, categoryRequest, setAuthHeader());
  },

  // Add this to your bookService
getCategoryById: (categoryId: string): Promise<AxiosResponse<CategoryDTO>> => {
  return axios.get(`${API_BASE_URL}/categories/${categoryId}`, setAuthHeader());
},

// And add this function to retrieve books by category
getBooksByCategory: (
  categoryId: string,
  page: number = 0,
  size: number = 12
): Promise<AxiosResponse<BookResponse[]>> => {
  return axios.get(
    `${API_BASE_URL}/categories/${categoryId}/books?page=${page}&size=${size}`,
    setAuthHeader()
  );
},
};

export default bookService;