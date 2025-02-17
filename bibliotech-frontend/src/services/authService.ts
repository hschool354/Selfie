import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

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
  isFirstLogin: boolean;
  isAdmin: boolean;
}

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

export const authService = {
  login: async (loginRequest: LoginRequestDto): Promise<AuthResponseDto> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginRequest);
      const token = response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Store token
      localStorage.setItem("token", token);

      // Check if user is admin
      const adminCheckResponse = await axios.get(
        `${API_BASE_URL}/check-admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Only check first login if user is not admin
      let isFirstLogin = false;
      if (!adminCheckResponse.data) {
        const firstLoginResponse = await axios.get(
          `${API_BASE_URL}/check-first-login`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        isFirstLogin = firstLoginResponse.data;
      }

      const authResponse: AuthResponseDto = {
        ...response.data,
        isFirstLogin,
        isAdmin: adminCheckResponse.data
      };

      localStorage.setItem("user", JSON.stringify(authResponse));

      return authResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || "Login failed");
      }
      throw error;
    }
  },

  signup: async (signUpRequest: SignUpRequestDto): Promise<AuthResponseDto> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        signUpRequest
      );

      return {
        ...response.data,
        isFirstLogin: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || "Signup failed");
      }
      throw error;
    }
  },

  completeProfile: async (profileData: ProfileDataDto): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/complete-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data || "Failed to complete profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data || "Failed to complete profile";
        console.error("Complete profile error:", message);
        throw new Error(message);
      }
      throw error;
    }
  },
};

export const logout = (): void => {
  localStorage.removeItem("user");
};
