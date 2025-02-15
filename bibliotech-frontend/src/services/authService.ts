import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

export interface SignUpRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  identifier: string; 
  password: string;
}

export interface AuthResponseDto {
  token: string;
  username: string;
  email: string;
}

export const authService = {
  login: async (loginRequest: LoginRequestDto): Promise<AuthResponseDto> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginRequest);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || 'Login failed');
      }
      throw error;
    }
  },

  signup: async (signUpRequest: SignUpRequestDto): Promise<AuthResponseDto> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, signUpRequest);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || 'Signup failed');
      }
      throw error;
    }
  }
};

export const logout = (): void => {
  localStorage.removeItem('user');
};