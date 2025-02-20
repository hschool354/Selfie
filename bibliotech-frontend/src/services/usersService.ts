import axios from 'axios';

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

  export const usersService = {
    completeProfile: async (formData: FormData): Promise<void> => {  
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      // Convert FormData to JSON object
      const jsonData = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        dob: formData.get('dob'),
        gender: formData.get('gender'),
        address: formData.get('address'),
        nationality: formData.get('nationality'),
        bio: formData.get('bio')
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/complete-profile`,
          jsonData,
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
  }


export const logout = (): void => {
  localStorage.removeItem("user");
};