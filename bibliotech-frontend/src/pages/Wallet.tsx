import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { 
  PlusCircle, 
  CreditCard, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Wallet2,
  Clock,
  TrendingUp,
  ChevronRight,
  X
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';

const WalletDashboard = () => {
  const { isDarkMode } = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Sample data for spending chart
  const spendingData = [
    { name: 'Jan', amount: 120 },
    { name: 'Feb', amount: 180 },
    { name: 'Mar', amount: 150 },
    { name: 'Apr', amount: 240 },
    { name: 'May', amount: 190 },
    { name: 'Jun', amount: 220 }
  ];

  const sampleTransactions = [
    {
      transaction_id: 1,
      transaction_type: "DEPOSIT",
      amount: 50.00,
      status: "COMPLETED",
      transaction_date: "2024-02-20T10:30:00",
      metadata: { method: "CREDIT_CARD", last4: "4242" }
    },
    {
      transaction_id: 2,
      transaction_type: "MUA",
      book_id: 1,
      amount: 4.99,
      status: "COMPLETED",
      transaction_date: "2024-02-19T15:20:00",
      metadata: { book_title: "To Kill a Mockingbird" }
    }
  ];

  const paymentMethods = [
    {
      payment_method_id: 1,
      method_type: "CREDIT_CARD",
      card_number: "****4242",
      card_holder: "John Doe",
      expiration_date: "2025-12",
      is_default: true
    }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowUpCircle className="text-green-500" size={24} />;
      case "WITHDRAWAL":
        return <ArrowDownCircle className="text-red-500" size={24} />;
      case "MUA":
      case "THUE":
        return <CreditCard className="text-blue-500" size={24} />;
      default:
        return <CreditCard className="text-gray-500" size={24} />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTitle = (transaction) => {
    switch (transaction.transaction_type) {
      case "DEPOSIT":
        return "Wallet Deposit";
      case "MUA":
        return `Book Purchase: ${transaction.metadata.book_title}`;
      case "WITHDRAWAL":
        return "Wallet Withdrawal";
      default:
        return "Transaction";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <header className={`w-full border-b ${
          isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
        } backdrop-blur-sm sticky top-0 z-10`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet2 className="text-blue-500" size={28} />
                <h1 className="text-2xl font-bold">My Wallet</h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  isDarkMode 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white shadow-lg shadow-blue-500/20`}
              >
                <PlusCircle size={20} />
                Add Funds
              </motion.button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
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
                  <div className={`p-3 rounded-xl ${isDarkMode ? "bg-blue-500/20" : "bg-blue-100"}`}>
                    <Wallet2 className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Current Balance</h3>
                </div>
                <p className="text-3xl font-bold">$245.50</p>
                <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                  <TrendingUp size={16} />
                  +15.3% from last month
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
                  <div className={`p-3 rounded-xl ${isDarkMode ? "bg-purple-500/20" : "bg-purple-100"}`}>
                    <Clock className="text-purple-500" size={24} />
                  </div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Monthly Spent</h3>
                </div>
                <p className="text-3xl font-bold">$54.50</p>
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                  <TrendingUp size={16} />
                  +2.4% from last month
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
                  <div className={`p-3 rounded-xl ${isDarkMode ? "bg-green-500/20" : "bg-green-100"}`}>
                    <CreditCard className="text-green-500" size={24} />
                  </div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Books Purchased</h3>
                </div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                  <TrendingUp size={16} />
                  +4 this month
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
              <h2 className="text-xl font-bold mb-6">Spending Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                    <XAxis 
                      dataKey="name" 
                      stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
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
                      stroke="#3B82F6" 
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Payment Methods</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    isDarkMode 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Add New Card
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.payment_method_id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-2xl ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-lg border-2 ${
                      method.is_default 
                        ? "border-blue-500" 
                        : isDarkMode 
                          ? "border-gray-700" 
                          : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard size={24} className="text-blue-500" />
                      <span className="font-medium">{method.card_number}</span>
                      {method.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {method.card_holder}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Expires {method.expiration_date}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <div className="flex gap-2">
                  {['all', 'deposit', 'withdrawal', 'purchase'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "bg-blue-500 text-white"
                          : isDarkMode 
                            ? "bg-gray-800 hover:bg-gray-700" 
                            : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`rounded-2xl overflow-hidden ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}>
                {sampleTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.transaction_id}
                    whileHover={{ backgroundColor: isDarkMode ? "#374151" : "#F9FAFB" }}
                    onClick={() => setSelectedTransaction(transaction)}
                    className={`p-6 flex items-center justify-between border-b cursor-pointer ${
                      isDarkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.transaction_type === "DEPOSIT"
                          ? isDarkMode ? "bg-green-500/20" : "bg-green-100"
                          : isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                      }`}>
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {getTransactionTitle(transaction)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.transaction_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-medium ${
                        transaction.transaction_type === "DEPOSIT" 
                          ? "text-green-500" 
                          : "text-red-500"
                      }`}>
                        {transaction.transaction_type === "DEPOSIT" ? "+" : "-"}
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTransaction(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-lg rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-xl`}
              >
                <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Type</span>
                      <span className="font-medium">{selectedTransaction.transaction_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Amount</span>
                      <span className="font-medium">${selectedTransaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Date</span>
                      <span className="font-medium">
                        {formatDate(selectedTransaction.transaction_date)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTransaction.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    {selectedTransaction.metadata && (
                      <>
                        {selectedTransaction.metadata.book_title && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Book</span>
                            <span className="font-medium">{selectedTransaction.metadata.book_title}</span>
                          </div>
                        )}
                        {selectedTransaction.metadata.method && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                            <span className="font-medium">
                              {selectedTransaction.metadata.method} (*{selectedTransaction.metadata.last4})
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WalletDashboard;