import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import {
  Users,
  DollarSign,
  Book,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios"; // Add this import

// Import services (giả định bạn đã có các service này)
import usersService from "../services/usersService";
import transactionService from "../services/transactionService";
import bookService from "../services/bookService"; 

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();

  // States for data
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Fetching total users...");
      const usersResponse = await usersService.getAllUsers();
      console.log("Total users response:", usersResponse.data);
      setTotalUsers(usersResponse.data.length);

      // Fetch total books
      console.log("Fetching total books...");
      const booksResponse = await bookService.getAllBooks();
      console.log("Total books response:", booksResponse.data);
      setTotalBooks(booksResponse.data.length);

      // Fetch transactions for revenue
      console.log("Fetching transactions...");
      const transactionResponse = await transactionService.getAllTransactions();
      const allTransactions = transactionResponse.data;
      console.log("All transactions:", allTransactions); // Debug log

      if (allTransactions.length === 0) {
        console.warn("No transactions found."); // Debug log
        setTotalRevenue(0);
        setMonthlyRevenue(0);
        setRevenueData([]);
        return;
      }

      // Calculate total revenue
      const revenue = allTransactions
        .filter((transaction) =>
          ["MUA", "THUE", "SUBSCRIPTION"].includes(transaction.transactionType)
        )
        .reduce((total, transaction) => total + (transaction.amount || 0), 0);
      console.log("Calculated total revenue:", revenue); // Debug log
      setTotalRevenue(revenue);

      // Calculate monthly revenue
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRev = allTransactions
        .filter(
          (transaction) =>
            new Date(transaction.transactionDate) >= firstDayOfMonth &&
            ["MUA", "THUE", "SUBSCRIPTION"].includes(transaction.transactionType)
        )
        .reduce((total, transaction) => total + (transaction.amount || 0), 0);
      console.log("Calculated monthly revenue:", monthlyRev); // Debug log
      setMonthlyRevenue(monthlyRev);

      // Generate revenue chart data for last 6 months
      const last6Months = generateLast6MonthsLabels();
      const revenueByMonth = last6Months.map((month) => {
        const [monthName, year] = month.split(" ");
        const startDate = new Date(
          parseInt(year),
          getMonthNumber(monthName),
          1
        );
        const endDate = new Date(
          parseInt(year),
          getMonthNumber(monthName) + 1,
          0
        );

        const monthlyRevenue = allTransactions
          .filter((transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            return (
              transactionDate >= startDate &&
              transactionDate <= endDate &&
              ["MUA", "THUE", "SUBSCRIPTION"].includes(
                transaction.transactionType
              )
            );
          })
          .reduce((total, transaction) => total + transaction.amount, 0);

        return {
          name: monthName,
          amount: monthlyRevenue,
        };
      });
      setRevenueData(revenueByMonth);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          console.error("Access denied: Redirecting to login.");
          setError("Access denied. Please log in with an account that has the required permissions.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login"; // Redirect to login page
          return;
        }
        console.error("Error fetching admin data:", err.message);
        setError(err.response?.data?.message || "Failed to load dashboard data. Please try again.");
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateLast6MonthsLabels = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const result = [];
    const date = new Date();

    for (let i = 5; i >= 0; i--) {
      const pastDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const month = months[pastDate.getMonth()];
      const year = pastDate.getFullYear();
      result.push(`${month} ${year}`);
    }

    return result;
  };

  const getMonthNumber = (monthName) => {
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    return months[monthName];
  };

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
            isDarkMode
              ? "bg-gray-900/95 border-gray-700"
              : "bg-white/95 border-gray-200"
          } backdrop-blur-sm sticky top-0 z-10`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-500" size={28} />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div
              className={`mx-auto mt-4 p-3 rounded-lg flex items-center gap-2 max-w-7xl ${
                isDarkMode
                  ? "bg-red-900/50 text-red-200"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className={`p-6 rounded-2xl ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-lg`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                      }`}
                    >
                      <Users className="text-blue-500" size={24} />
                    </div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">
                      Total Users
                    </h3>
                  </div>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={16} />
                    Registered Users
                  </p>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className={`p-6 rounded-2xl ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-lg`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isDarkMode ? "bg-green-500/20" : "bg-green-100"
                      }`}
                    >
                      <DollarSign className="text-green-500" size={24} />
                    </div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">
                      Total Revenue
                    </h3>
                  </div>
                  <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={16} />
                    All Time
                  </p>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className={`p-6 rounded-2xl ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-lg`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                      }`}
                    >
                      <Book className="text-purple-500" size={24} />
                    </div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">
                      Total Books
                    </h3>
                  </div>
                  <p className="text-3xl font-bold">{totalBooks}</p>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={16} />
                    In Library
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`mb-8 p-6 rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                      />
                      <YAxis
                        stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                          border: "none",
                          borderRadius: "0.5rem",
                        }}
                        labelStyle={{
                          color: isDarkMode ? "#E5E7EB" : "#111827",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-6 rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-100/50 dark:bg-gray-700/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-500">${monthlyRevenue.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-100/50 dark:bg-gray-700/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Premium Users</p>
                    <p className="text-2xl font-bold">{/* Giả định cần API */}0</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;