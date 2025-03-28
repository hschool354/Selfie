import React, { useState, useEffect } from "react";
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
  X,
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

// Import services
import transactionService, {
  TransactionResponse,
  TransactionRequest,
  TransactionType,
  TransactionStatus,
} from "../services/transactionService";

import paymentMethodService, {
  PaymentMethodResponse,
  PaymentMethodRequest,
  MethodType,
} from "../services/paymentMethodService";
import usersService from "../services/usersService";

const WalletDashboard = () => {
  const { isDarkMode } = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // States for data
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>(
    []
  );
  const [balance, setBalance] = useState(0);
  const [monthlySpendings, setMonthlySpendings] = useState(0);
  const [booksPurchased, setBooksPurchased] = useState(0);
  const [spendingData, setSpendingData] = useState([]);

  // States for modals
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const [newCardDetails, setNewCardDetails] = useState({
    methodType: MethodType.CREDIT_CARD,
    cardNumber: "",
    cardHolder: "",
    expirationDate: "",
    expirationMonth: "",
    expirationYear: "",
    isDefault: false,
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch transactions
      const transactionResponse =
        await transactionService.getUserTransactions();
      const userTransactions = transactionResponse.data;
      setTransactions(userTransactions);

      // Fetch payment methods
      const paymentMethodResponse =
        await paymentMethodService.getUserPaymentMethods();
      const userPaymentMethods = paymentMethodResponse.data;
      setPaymentMethods(userPaymentMethods);

      // Calculate balance - assuming deposits add to balance and withdrawals/purchases subtract
      const userBalance = await usersService.getCurrentUserBalance();
      setBalance(userBalance.accountBalance);

      // Calculate monthly spendings
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlySpent = userTransactions
        .filter(
          (transaction) =>
            new Date(transaction.transactionDate) >= firstDayOfMonth &&
            [
              TransactionType.MUA,
              TransactionType.THUE,
              TransactionType.SUBSCRIPTION,
            ].includes(transaction.transactionType)
        )
        .reduce((total, transaction) => total + transaction.amount, 0);
      setMonthlySpendings(monthlySpent);

      // Calculate books purchased
      const booksCount = userTransactions.filter(
        (transaction) =>
          transaction.transactionType === TransactionType.MUA ||
          transaction.transactionType === TransactionType.THUE
      ).length;
      setBooksPurchased(booksCount);

      // Generate spending chart data
      const last6Months = generateLast6MonthsLabels();
      const spendingByMonth = last6Months.map((month) => {
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

        const spending = userTransactions
          .filter((transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            return (
              transactionDate >= startDate &&
              transactionDate <= endDate &&
              [
                TransactionType.MUA,
                TransactionType.THUE,
                TransactionType.SUBSCRIPTION,
              ].includes(transaction.transactionType)
            );
          })
          .reduce((total, transaction) => total + transaction.amount, 0);

        return {
          name: monthName,
          amount: spending,
        };
      });

      setSpendingData(spendingByMonth);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load wallet data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateLast6MonthsLabels = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
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
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    return months[monthName];
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      if (!selectedPaymentMethod) {
        throw new Error("Please select a payment method");
      }

      // Get the selected payment method details
      const paymentMethod = paymentMethods.find(
        (method) => method.paymentMethodId === selectedPaymentMethod
      );

      // Create metadata for the transaction
      const metadata = JSON.stringify({
        method: paymentMethod.methodType,
        last4: paymentMethod.cardNumber?.slice(-4) || "N/A",
      });

      // Execute deposit
      await transactionService.depositFunds(amount, metadata);

      // Refresh data
      await fetchUserData();

      // Close modal and reset form
      setShowAddFundsModal(false);
      setDepositAmount("");
      setSelectedPaymentMethod(null);
    } catch (err) {
      console.error("Error adding funds:", err);
      setError(err.message || "Failed to process deposit. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Validate card details
      if (
        !newCardDetails.cardNumber ||
        !newCardDetails.cardHolder ||
        !newCardDetails.expirationDate
      ) {
        throw new Error("Please fill in all card details");
      }

      // Format expiration date to YYYY-MM format if it's MM/YY
      let formattedExpDate = newCardDetails.expirationDate;
      if (newCardDetails.expirationMonth && newCardDetails.expirationYear) {
        formattedExpDate = `20${newCardDetails.expirationYear}-${newCardDetails.expirationMonth}-01`;
      }

      let formattedCardNumber = newCardDetails.cardNumber.replace(/\D/g, "");
      if (formattedCardNumber.length > 16) {
        throw new Error(
          "Card number is too long. Please enter a valid card number."
        );
      }

      const paymentMethodRequest = {
        ...newCardDetails,
        cardNumber: formattedCardNumber,
        expirationDate: formattedExpDate,
      };

      // Add new payment method
      await paymentMethodService.addPaymentMethod(paymentMethodRequest);

      // Refresh payment methods
      await fetchUserData();

      // Close modal and reset form
      setShowAddCardModal(false);
      setNewCardDetails({
        methodType: MethodType.CREDIT_CARD,
        cardNumber: "",
        cardHolder: "",
        expirationDate: "",
        isDefault: false,
      });
    } catch (err) {
      console.error("Error adding card:", err);
      setError(
        err.message || "Failed to add payment method. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId) => {
    try {
      await paymentMethodService.setDefaultPaymentMethod(methodId);
      await fetchUserData();
    } catch (err) {
      console.error("Error setting default payment method:", err);
      setError("Failed to set default payment method. Please try again.");
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (
      window.confirm("Are you sure you want to remove this payment method?")
    ) {
      try {
        await paymentMethodService.deletePaymentMethod(methodId);
        await fetchUserData();
      } catch (err) {
        console.error("Error deleting payment method:", err);
        setError("Failed to delete payment method. Please try again.");
      }
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return <ArrowUpCircle className="text-green-500" size={24} />;
      case TransactionType.WITHDRAWAL:
        return <ArrowDownCircle className="text-red-500" size={24} />;
      case TransactionType.MUA:
      case TransactionType.THUE:
        return <CreditCard className="text-blue-500" size={24} />;
      case TransactionType.REFUND:
        return <ArrowUpCircle className="text-purple-500" size={24} />;
      case TransactionType.SUBSCRIPTION:
        return <Clock className="text-orange-500" size={24} />;
      default:
        return <CreditCard className="text-gray-500" size={24} />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTitle = (transaction) => {
    switch (transaction.transactionType) {
      case TransactionType.DEPOSIT:
        return "Wallet Deposit";
      case TransactionType.MUA:
        const bookTitle =
          transaction.metadata?.book_title || `Book #${transaction.bookId}`;
        return `Book Purchase: ${bookTitle}`;
      case TransactionType.THUE:
        const rentedBookTitle =
          transaction.metadata?.book_title || `Book #${transaction.bookId}`;
        return `Book Rental: ${rentedBookTitle}`;
      case TransactionType.WITHDRAWAL:
        return "Wallet Withdrawal";
      case TransactionType.REFUND:
        return "Refund";
      case TransactionType.SUBSCRIPTION:
        return "Subscription Payment";
      default:
        return "Transaction";
    }
  };

  const getFilteredTransactions = () => {
    if (activeTab === "all") {
      return transactions;
    }

    const typeMap = {
      deposit: TransactionType.DEPOSIT,
      withdrawal: TransactionType.WITHDRAWAL,
      purchase: TransactionType.MUA,
    };

    return transactions.filter(
      (transaction) => transaction.transactionType === typeMap[activeTab]
    );
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
                onClick={() => setShowAddFundsModal(true)}
              >
                <PlusCircle size={20} />
                Add Funds
              </motion.button>
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
                    <Wallet2 className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Current Balance
                  </h3>
                </div>
                <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                {!isLoading && (
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={16} />
                    Available for purchases
                  </p>
                )}
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
                      isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                    }`}
                  >
                    <Clock className="text-purple-500" size={24} />
                  </div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly Spent
                  </h3>
                </div>
                <p className="text-3xl font-bold">
                  ${monthlySpendings.toFixed(2)}
                </p>
                {!isLoading && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={16} />
                    This month
                  </p>
                )}
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
                      isDarkMode ? "bg-green-500/20" : "bg-green-100"
                    }`}
                  >
                    <CreditCard className="text-green-500" size={24} />
                  </div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Books Purchased
                  </h3>
                </div>
                <p className="text-3xl font-bold">{booksPurchased}</p>
                {!isLoading && (
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={16} />
                    All time
                  </p>
                )}
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
                      <linearGradient
                        id="colorAmount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
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
                      formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
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
                  onClick={() => setShowAddCardModal(true)}
                >
                  Add New Card
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div
                    className={`p-6 rounded-2xl ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-lg text-center`}
                  >
                    Loading payment methods...
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div
                    className={`p-6 rounded-2xl ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-lg text-center`}
                  >
                    <p>No payment methods found.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Add a new card to make deposits and purchases.
                    </p>
                  </div>
                ) : (
                  paymentMethods.map((method) => (
                    <motion.div
                      key={method.paymentMethodId}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-2xl ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow-lg border-2 ${
                        method.isDefault
                          ? "border-blue-500"
                          : isDarkMode
                          ? "border-gray-700"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard size={24} className="text-blue-500" />
                        <span className="font-medium">
                          {method.methodType === MethodType.PAYPAL
                            ? "PayPal"
                            : `****${method.cardNumber?.slice(-4)}`}
                        </span>
                        {method.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {method.cardHolder}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires{" "}
                        {method.expirationDate
                          ? method.expirationDate
                              .substring(0, 7)
                              .replace("-", "/")
                          : "N/A"}
                      </p>

                      <div className="mt-4 pt-3 border-t flex justify-between items-center">
                        {!method.isDefault && (
                          <button
                            onClick={() =>
                              handleSetDefaultPaymentMethod(
                                method.paymentMethodId
                              )
                            }
                            className="text-sm text-blue-500 hover:text-blue-700"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeletePaymentMethod(method.paymentMethodId)
                          }
                          className="text-sm text-red-500 hover:text-red-700 ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
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
                  {["all", "deposit", "withdrawal", "purchase"].map((tab) => (
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
              <div
                className={`rounded-2xl overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                {isLoading ? (
                  <div className="p-6 text-center">Loading transactions...</div>
                ) : getFilteredTransactions().length === 0 ? (
                  <div className="p-6 text-center">
                    <p>
                      No {activeTab !== "all" ? activeTab : ""} transactions
                      found.
                    </p>
                  </div>
                ) : (
                  getFilteredTransactions().map((transaction) => (
                    <motion.div
                      key={transaction.transactionId}
                      whileHover={{
                        backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                      }}
                      onClick={() => setSelectedTransaction(transaction)}
                      className={`p-6 flex items-center justify-between border-b cursor-pointer ${
                        isDarkMode ? "border-gray-700" : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            transaction.transactionType ===
                            TransactionType.DEPOSIT
                              ? isDarkMode
                                ? "bg-green-500/20"
                                : "bg-green-100"
                              : isDarkMode
                              ? "bg-blue-500/20"
                              : "bg-blue-100"
                          }`}
                        >
                          {getTransactionIcon(transaction.transactionType)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {getTransactionTitle(transaction)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.transactionDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p
                          className={`font-medium ${
                            transaction.transactionType ===
                              TransactionType.DEPOSIT ||
                            transaction.transactionType ===
                              TransactionType.REFUND
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.transactionType ===
                            TransactionType.DEPOSIT ||
                          transaction.transactionType === TransactionType.REFUND
                            ? "+"
                            : "-"}
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Transaction Details Modal */}
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
                      <span className="text-gray-500 dark:text-gray-400">
                        Type
                      </span>
                      <span className="font-medium">
                        {selectedTransaction.transactionType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Amount
                      </span>
                      <span className="font-medium">
                        ${selectedTransaction.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Date
                      </span>
                      <span className="font-medium">
                        {formatDate(selectedTransaction.transactionDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedTransaction.status ===
                          TransactionStatus.COMPLETED
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : selectedTransaction.status ===
                              TransactionStatus.PENDING
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {selectedTransaction.status}
                      </span>
                    </div>
                    {selectedTransaction.bookId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">
                          Book ID
                        </span>
                        <span className="font-medium">
                          {selectedTransaction.bookId}
                        </span>
                      </div>
                    )}
                    {selectedTransaction.metadata && (
                      <>
                        {typeof selectedTransaction.metadata === "string"
                          ? // Parse metadata string if needed
                            (() => {
                              try {
                                const parsed = JSON.parse(
                                  selectedTransaction.metadata
                                );
                                return Object.entries(parsed).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex justify-between items-center"
                                    >
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {key.charAt(0).toUpperCase() +
                                          key.slice(1).replace(/_/g, " ")}
                                      </span>
                                      <span className="font-medium">
                                        {String(value)}
                                      </span>
                                    </div>
                                  )
                                );
                              } catch (e) {
                                return (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Metadata
                                    </span>
                                    <span className="font-medium">
                                      {selectedTransaction.metadata}
                                    </span>
                                  </div>
                                );
                              }
                            })()
                          : // Handle object metadata
                            Object.entries(selectedTransaction.metadata).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {key.charAt(0).toUpperCase() +
                                      key.slice(1).replace(/_/g, " ")}
                                  </span>
                                  <span className="font-medium">
                                    {String(value)}
                                  </span>
                                </div>
                              )
                            )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Funds Modal */}
        <AnimatePresence>
          {showAddFundsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => !isProcessing && setShowAddFundsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-xl`}
              >
                <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold">Add Funds to Wallet</h3>
                  <button
                    onClick={() => !isProcessing && setShowAddFundsModal(false)}
                    className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isProcessing}
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddFunds} className="p-6">
                  {error && (
                    <div
                      className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                        isDarkMode
                          ? "bg-red-900/50 text-red-200"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Amount to Add
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className={`block w-full pl-8 pr-4 py-3 rounded-xl ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-200 text-gray-900"
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="0.00"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Payment Method
                    </label>

                    {paymentMethods.length === 0 ? (
                      <div
                        className={`p-4 rounded-xl text-center ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <p className="text-sm">No payment methods available.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddFundsModal(false);
                            setShowAddCardModal(true);
                          }}
                          className="text-blue-500 text-sm mt-2"
                        >
                          Add a payment method
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.paymentMethodId}
                            onClick={() =>
                              !isProcessing &&
                              setSelectedPaymentMethod(method.paymentMethodId)
                            }
                            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer border-2 ${
                              selectedPaymentMethod === method.paymentMethodId
                                ? "border-blue-500"
                                : isDarkMode
                                ? "border-gray-700"
                                : "border-gray-200"
                            } ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-50"
                            } ${
                              isProcessing
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedPaymentMethod === method.paymentMethodId
                                  ? "border-blue-500"
                                  : isDarkMode
                                  ? "border-gray-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {selectedPaymentMethod ===
                                method.paymentMethodId && (
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {method.methodType === MethodType.PAYPAL
                                  ? "PayPal"
                                  : `****${method.cardNumber?.slice(-4)}`}
                                {method.isDefault && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                                    Default
                                  </span>
                                )}
                              </p>
                              {method.methodType !== MethodType.PAYPAL && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Expires{" "}
                                  {method.expirationDate
                                    .substring(0, 7)
                                    .replace("-", "/")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        !isProcessing && setShowAddFundsModal(false)
                      }
                      className={`px-4 py-2 rounded-xl mr-3 ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white ${
                        isProcessing || paymentMethods.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isProcessing || paymentMethods.length === 0}
                    >
                      {isProcessing ? "Processing..." : "Add Funds"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Card Modal */}
        <AnimatePresence>
          {showAddCardModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => !isProcessing && setShowAddCardModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-xl`}
              >
                <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold">Add Payment Method</h3>
                  <button
                    onClick={() => !isProcessing && setShowAddCardModal(false)}
                    className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isProcessing}
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddCard} className="p-6">
                  {error && (
                    <div
                      className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                        isDarkMode
                          ? "bg-red-900/50 text-red-200"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Payment Method Type
                    </label>
                    <select
                      value={newCardDetails.methodType}
                      onChange={(e) =>
                        setNewCardDetails({
                          ...newCardDetails,
                          methodType: e.target.value as MethodType,
                        })
                      }
                      className={`block w-full px-4 py-3 rounded-xl ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      disabled={isProcessing}
                    >
                      <option value={MethodType.CREDIT_CARD}>
                        Credit Card
                      </option>
                      <option value={MethodType.DEBIT_CARD}>Debit Card</option>
                      <option value={MethodType.PAYPAL}>PayPal</option>
                    </select>
                  </div>

                  {newCardDetails.methodType !== MethodType.PAYPAL && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={newCardDetails.cardNumber}
                          onChange={(e) =>
                            setNewCardDetails({
                              ...newCardDetails,
                              cardNumber: e.target.value,
                            })
                          }
                          className={`block w-full px-4 py-3 rounded-xl ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-gray-50 border-gray-200 text-gray-900"
                          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="0000 0000 0000 0000"
                          required
                          disabled={isProcessing}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Card Holder Name
                        </label>
                        <input
                          type="text"
                          value={newCardDetails.cardHolder}
                          onChange={(e) =>
                            setNewCardDetails({
                              ...newCardDetails,
                              cardHolder: e.target.value,
                            })
                          }
                          className={`block w-full px-4 py-3 rounded-xl ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-gray-50 border-gray-200 text-gray-900"
                          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Full Name"
                          required
                          disabled={isProcessing}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Expiration Date
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newCardDetails.expirationMonth || ""}
                            onChange={(e) =>
                              setNewCardDetails({
                                ...newCardDetails,
                                expirationMonth: e.target.value,
                                expirationDate: `${e.target.value}/${
                                  newCardDetails.expirationYear || ""
                                }`,
                              })
                            }
                            className={`block w-full px-4 py-3 rounded-xl ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-200 text-gray-900"
                            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                            disabled={isProcessing}
                          >
                            <option value="" disabled>
                              Month
                            </option>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = i + 1;
                              return (
                                <option
                                  key={month}
                                  value={month.toString().padStart(2, "0")}
                                >
                                  {month.toString().padStart(2, "0")}
                                </option>
                              );
                            })}
                          </select>

                          <select
                            value={newCardDetails.expirationYear || ""}
                            onChange={(e) =>
                              setNewCardDetails({
                                ...newCardDetails,
                                expirationYear: e.target.value,
                                expirationDate: `${
                                  newCardDetails.expirationMonth || ""
                                }/${e.target.value}`,
                              })
                            }
                            className={`block w-full px-4 py-3 rounded-xl ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-200 text-gray-900"
                            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                            disabled={isProcessing}
                          >
                            <option value="" disabled>
                              Year
                            </option>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <option
                                  key={year}
                                  value={year.toString().slice(2)}
                                >
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCardDetails.isDefault}
                        onChange={(e) =>
                          setNewCardDetails({
                            ...newCardDetails,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                        disabled={isProcessing}
                      />
                      <span className="text-sm">
                        Set as default payment method
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        !isProcessing && setShowAddCardModal(false)
                      }
                      className={`px-4 py-2 rounded-xl mr-3 ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white ${
                        isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Add Card"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WalletDashboard;
