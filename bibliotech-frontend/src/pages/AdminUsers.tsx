import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import {
  Users,
  Lock,
  Unlock,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Import services (giả định)
import usersService from "../services/usersService";

// Define types based on your database schema
interface User {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isPremium: boolean;
  accountBalance: number;
  registrationStatus: "PENDING" | "COMPLETED";
  lastLoginDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  userId: number;
  fullName: string | null;
  phone: string | null;
  dob: string | null;
  gender: "Male" | "Female" | "Other" | null;
  address: string | null;
  nationality: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
}

interface UserRegistrationStatus {
  userId: number;
  isProfileCompleted: boolean;
  profileCompletionDate: string | null;
}

const AdminUsers = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<(User & UserProfile & UserRegistrationStatus)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User & UserProfile> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching users...");
      const usersResponse = await usersService.getAllUsers();
      const users = usersResponse.data;

      console.log("Fetching user profiles...");
      const userProfiles = await Promise.all(
        users.map(async (user) => {
          try {
            const profileResponse = await usersService.getUserProfileById(user.userId);
            return { ...user, ...profileResponse.data };
          } catch (err) {
            console.error(`Error fetching profile for user ${user.userId}:`, err);
            return { ...user, fullName: null, phone: null, dob: null, gender: null, address: null, nationality: null, bio: null };
          }
        })
      );

      console.log("Fetched users with profiles:", userProfiles); // Debug log
      setUsers(userProfiles);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (userId: number, currentStatus: "PENDING" | "COMPLETED") => {
    try {
      const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
      await usersService.updateUserStatus(userId, newStatus);
      setUsers(users.map(user =>
        user.userId === userId ? { ...user, registrationStatus: newStatus } : user
      ));
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Failed to update user status.");
    }
  };

  const handleEdit = (user: User & UserProfile & UserRegistrationStatus) => {
    setEditingUserId(user.userId);
    setEditedUser({
      fullName: user.fullName,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      nationality: user.nationality,
      bio: user.bio,
    });
  };

  const handleSave = async (userId: number) => {
    if (!editedUser) return;
    try {
      await usersService.updateUserProfile(userId, editedUser);
      setUsers(users.map(user =>
        user.userId === userId ? { ...user, ...editedUser } : user
      ));
      setEditingUserId(null);
      setEditedUser(null);
    } catch (err) {
      console.error("Error saving user profile:", err);
      setError("Failed to save user profile.");
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <header
          className={`w-full border-b ${
            isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
          } backdrop-blur-sm sticky top-0 z-10`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" size={28} />
                <h1 className="text-2xl font-bold">Manage Users</h1>
              </div>
              <input
                type="text"
                placeholder="Search by username, email, or full name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-4 py-2 rounded-xl ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div
              className={`mx-auto mt-4 p-3 rounded-lg flex items-center gap-2 max-w-7xl ${
                isDarkMode ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-800"
              }`}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className={`rounded-2xl overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">Username</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Full Name</th>
                      <th className="p-4 text-left">Balance</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-gray-500 dark:text-gray-400">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.userId}
                          className={`border-t ${
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          } hover:${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
                        >
                          <td className="p-4">{user.userId}</td>
                          <td className="p-4">{user.username}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">
                            {editingUserId === user.userId ? (
                              <input
                                type="text"
                                value={editedUser?.fullName || ""}
                                onChange={(e) =>
                                  setEditedUser({ ...editedUser, fullName: e.target.value })
                                }
                                className="px-2 py-1 rounded border"
                              />
                            ) : (
                              user.fullName || "N/A"
                            )}
                          </td>
                          <td className="p-4">${user.accountBalance.toFixed(2)}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                user.registrationStatus === "COMPLETED"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {user.registrationStatus}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            {editingUserId === user.userId ? (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSave(user.userId)}
                                  className="p-2 text-green-500 hover:text-green-700"
                                >
                                  <Save size={20} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleCancelEdit}
                                  className="p-2 text-red-500 hover:text-red-700"
                                >
                                  <X size={20} />
                                </motion.button>
                              </>
                            ) : (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleToggleLock(user.userId, user.registrationStatus)}
                                  className={`p-2 ${
                                    user.registrationStatus === "COMPLETED"
                                      ? "text-red-500 hover:text-red-700"
                                      : "text-green-500 hover:text-green-700"
                                  }`}
                                  title={user.registrationStatus === "COMPLETED" ? "Lock" : "Unlock"}
                                >
                                  {user.registrationStatus === "COMPLETED" ? (
                                    <Lock size={20} />
                                  ) : (
                                    <Unlock size={20} />
                                  )}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEdit(user)}
                                  className="p-2 text-blue-500 hover:text-blue-700"
                                  title="Edit"
                                >
                                  <Edit size={20} />
                                </motion.button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;