import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const TRANSACTIONS_URL = `${API_BASE_URL}/transactions`;

// Define enums based on your backend
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  MUA = "MUA",
  THUE = "THUE",
  REFUND = "REFUND",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

// Define interfaces based on your backend model
export interface TransactionResponse {
  transactionId: number;
  userId: number;
  bookId?: number;
  transactionType: TransactionType;
  amount: number;
  status: TransactionStatus;
  transactionDate: string; // ISO date string format
  metadata?: string;
}

export interface TransactionRequest {
  transactionId?: number; // Optional, will be generated by backend if not provided
  userId?: number; // Optional, will be set from authenticated user if not provided
  bookId?: number; // Optional, required for book-related transactions
  transactionType: TransactionType;
  amount: number;
  status?: TransactionStatus; // Optional, defaults to PENDING
  transactionDate?: string; // Optional, defaults to current time
  metadata?: string; // Optional additional information
}

export interface BookResponse {
  bookId: number;
  title: string;
  author: string;
  isbn?: string;
  originalPrice: number;
  discountedPrice?: number;
  publicationYear?: number;
  language?: string;
  pageCount?: number;
  averageRating?: number;
  ratingCount?: number;
  description?: string;
  coverImageUrl?: string;
  stockQuantity?: number;
  deal?: { dealId: number };
  readingDifficulty?: string;
  estimatedReadingTime?: number;
  contentRating?: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: { categoryId: number; categoryName: string; description?: string }[];
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

// Transaction Service API functions
const transactionService = {
  // Get transactions for the authenticated user or specified user
  getUserTransactions: (userId?: number): Promise<AxiosResponse<TransactionResponse[]>> => {
    const url = userId ? `${TRANSACTIONS_URL}?userId=${userId}` : TRANSACTIONS_URL;
    return axios.get(url, setAuthHeader());
  },

  // Get a specific transaction by ID
  getTransactionById: (transactionId: number): Promise<AxiosResponse<TransactionResponse>> => {
    return axios.get(`${TRANSACTIONS_URL}/${transactionId}`, setAuthHeader());
  },

  // Create a general transaction
  createTransaction: (transaction: TransactionRequest): Promise<AxiosResponse<TransactionResponse>> => {
    return axios.post(TRANSACTIONS_URL, transaction, setAuthHeader());
  },

  // Deposit funds into user account
  depositFunds: (amount: number, metadata?: string): Promise<AxiosResponse<TransactionResponse>> => {
    const transaction: TransactionRequest = {
      transactionType: TransactionType.DEPOSIT,
      amount: amount,
      metadata: metadata,
    };
    return axios.post(`${TRANSACTIONS_URL}/deposit`, transaction, setAuthHeader());
  },

  // Withdraw funds from user account
  withdrawFunds: (amount: number, metadata?: string): Promise<AxiosResponse<TransactionResponse>> => {
    const transaction: TransactionRequest = {
      transactionType: TransactionType.WITHDRAWAL,
      amount: amount,
      metadata: metadata,
    };
    return axios.post(`${TRANSACTIONS_URL}/withdraw`, transaction, setAuthHeader());
  },

  // Purchase a book
  purchaseBook: (bookId: number, amount: number, metadata?: string): Promise<AxiosResponse<TransactionResponse>> => {
    const transaction: TransactionRequest = {
      transactionType: TransactionType.MUA,
      bookId: bookId,
      amount: amount,
      status: TransactionStatus.COMPLETED, 
      metadata: metadata,
    };
    return axios.post(TRANSACTIONS_URL, transaction, setAuthHeader());
  },

  // Rent a book
  rentBook: (bookId: number, amount: number): Promise<AxiosResponse<TransactionResponse>> => {
    const transaction: TransactionRequest = {
      transactionType: TransactionType.THUE,
      bookId: bookId,
      amount: amount,
    };
    return axios.post(TRANSACTIONS_URL, transaction, setAuthHeader());
  },

  // Process a refund for a book
  processRefund: (
    bookId: number,
    amount: number,
    metadata?: string
  ): Promise<AxiosResponse<TransactionResponse>> => {
    const transaction: TransactionRequest = {
      transactionType: TransactionType.REFUND,
      bookId: bookId,
      amount: amount,
      metadata: metadata,
    };
    return axios.post(TRANSACTIONS_URL, transaction, setAuthHeader());
  },

  // Purchase a subscription
  purchaseSubscription: (amount: number): Promise<AxiosResponse<TransactionResponse>> => {
    const transaction: TransactionRequest = {
      transactionType: TransactionType.SUBSCRIPTION,
      amount: amount,
    };
    return axios.post(TRANSACTIONS_URL, transaction, setAuthHeader());
  },

  // Get purchased books for the authenticated user
  getMyPurchasedBooks: (): Promise<AxiosResponse<BookResponse[]>> => {
    return axios.get(`${TRANSACTIONS_URL}/purchased-books`, setAuthHeader());
  },

  // Get purchased books for a specific user (admin only)
  getUserPurchasedBooks: (userId: number): Promise<AxiosResponse<BookResponse[]>> => {
    return axios.get(`${TRANSACTIONS_URL}/users/${userId}/purchased-books`, setAuthHeader());
  },
};

export default transactionService;