import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const PAYMENT_METHODS_URL = `${API_BASE_URL}/payment-methods`;

// Define types based on your backend DTOs
export enum MethodType {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER"
}

export interface PaymentMethodResponse {
  paymentMethodId: number;
  userId: number;
  methodType: MethodType;
  cardNumber?: string;
  cardHolder?: string;
  expirationDate: string; // ISO date string format
  isDefault: boolean;
  createdAt: string; // ISO date string format
}

export interface PaymentMethodRequest {
  paymentMethodId?: number;
  userId?: number; // Will be set by the backend from authenticated user
  methodType: MethodType;
  cardNumber?: string;
  cardHolder?: string;
  expirationDate: string; // ISO date string format
  isDefault?: boolean;
  createdAt?: string; // Optional, will be set by backend if not provided
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

// Payment Method Service API functions
const paymentMethodService = {
  // Get all payment methods for the authenticated user
  getUserPaymentMethods: (): Promise<AxiosResponse<PaymentMethodResponse[]>> => {
    return axios.get(PAYMENT_METHODS_URL, setAuthHeader());
  },

  // Add a new payment method
  addPaymentMethod: (paymentMethod: PaymentMethodRequest): Promise<AxiosResponse<PaymentMethodResponse>> => {
    return axios.post(PAYMENT_METHODS_URL, paymentMethod, setAuthHeader());
  },

  // Update an existing payment method
  updatePaymentMethod: (
    methodId: number, 
    paymentMethod: PaymentMethodRequest
  ): Promise<AxiosResponse<PaymentMethodResponse>> => {
    return axios.put(`${PAYMENT_METHODS_URL}/${methodId}`, paymentMethod, setAuthHeader());
  },

  // Delete a payment method
  deletePaymentMethod: (methodId: number): Promise<AxiosResponse<void>> => {
    return axios.delete(`${PAYMENT_METHODS_URL}/${methodId}`, setAuthHeader());
  },

  // Set a payment method as the default
  setDefaultPaymentMethod: (methodId: number): Promise<AxiosResponse<PaymentMethodResponse>> => {
    return axios.patch(`${PAYMENT_METHODS_URL}/${methodId}/default`, {}, setAuthHeader());
  }
};

export default paymentMethodService;