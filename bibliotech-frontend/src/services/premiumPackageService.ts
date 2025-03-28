import axios from "axios";
import { AxiosResponse } from "axios";

// Base URL should point to your API endpoint
const API_BASE_URL = "http://localhost:8080/api";
const PREMIUM_PACKAGES_URL = `${API_BASE_URL}/premium-packages`;

// Define types based on your backend model
export interface PremiumPackageResponse {
  packageId: number;
  packageName: string;
  price: number;
  duration: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string; // This is a JSON string in your backend
  isActive: boolean;
}

export interface PremiumPackageRequest {
  packageId?: number;
  packageName: string;
  price: number;
  duration: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string;
  isActive?: boolean;
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

// Premium Package Service API functions
const premiumPackageService = {
  
  // Get all active premium packages (public access)
  getAllActivePackages: (): Promise<AxiosResponse<PremiumPackageResponse[]>> => {
    return axios.get(`${PREMIUM_PACKAGES_URL}/active`, setAuthHeader());
  },

  // Get all premium packages (admin only)
  getAllPackages: (): Promise<AxiosResponse<PremiumPackageResponse[]>> => {
    return axios.get(PREMIUM_PACKAGES_URL, setAuthHeader());
  },

  // Get premium package by ID
  getPackageById: (packageId: number): Promise<AxiosResponse<PremiumPackageResponse>> => {
    return axios.get(`${PREMIUM_PACKAGES_URL}/${packageId}`, setAuthHeader());
  },

  // Create new premium package (admin only)
  createPremiumPackage: (premiumPackage: PremiumPackageRequest): Promise<AxiosResponse<PremiumPackageResponse>> => {
    return axios.post(PREMIUM_PACKAGES_URL, premiumPackage, setAuthHeader());
  },

  // Update premium package (admin only)
  updatePremiumPackage: (packageId: number, premiumPackage: PremiumPackageRequest): Promise<AxiosResponse<PremiumPackageResponse>> => {
    return axios.put(`${PREMIUM_PACKAGES_URL}/${packageId}`, premiumPackage, setAuthHeader());
  },

  // Toggle premium package active status (admin only)
  togglePackageStatus: (packageId: number, isActive: boolean): Promise<AxiosResponse<PremiumPackageResponse>> => {
    return axios.patch(`${PREMIUM_PACKAGES_URL}/${packageId}/toggle-status?isActive=${isActive}`, {}, setAuthHeader());
  },

  // Delete premium package (admin only)
  deletePackage: (packageId: number): Promise<AxiosResponse<void>> => {
    return axios.delete(`${PREMIUM_PACKAGES_URL}/${packageId}`, setAuthHeader());
  }
};

export default premiumPackageService;