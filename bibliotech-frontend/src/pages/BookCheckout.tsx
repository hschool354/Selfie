import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet2,
  X,
  AlertCircle,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import transactionService, { TransactionResponse, TransactionStatus } from "../services/transactionService";
import paymentMethodService, { PaymentMethodResponse, MethodType } from "../services/paymentMethodService";

const BookCheckout = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const bookData = location.state?.bookData;

  // States
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!bookData) {
      setError("No book data provided. Please return to the book page.");
      setIsLoading(false);
      return;
    }

    fetchPaymentMethods();
  }, [bookData]);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    setError("");

    try {
      const paymentMethodResponse = await paymentMethodService.getUserPaymentMethods();
      const userPaymentMethods = paymentMethodResponse.data || [];
      setPaymentMethods(userPaymentMethods);

      const defaultMethod = userPaymentMethods.find((method) => method.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.paymentMethodId);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError("Failed to load payment methods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!selectedPaymentMethod) {
        throw new Error("Please select a payment method.");
      }

      const paymentMethod = paymentMethods.find(
        (method) => method.paymentMethodId === selectedPaymentMethod
      );

      const metadata = JSON.stringify({
        book_id: bookData.id,
        book_title: bookData.title,
        method: paymentMethod?.methodType,
        last4: paymentMethod?.cardNumber?.slice(-4) || "N/A",
      });

      // Gọi API mua sách và lấy phản hồi
      const response = await transactionService.purchaseBook(bookData.id, bookData.price, metadata);
      const transaction: TransactionResponse = response.data; // Giả sử API trả về thông tin giao dịch

      // Kiểm tra trạng thái giao dịch
      if (transaction.status === TransactionStatus.COMPLETED) {
        setSuccessMessage("Purchase successful! Redirecting to your library...");
        setTimeout(() => {
          navigate("/home/myLibrary");
        }, 2000);
      } else if (transaction.status === TransactionStatus.PENDING) {
        setSuccessMessage("Transaction is being processed. Please check your library later.");
        setTimeout(() => {
          navigate("/home/myLibrary");
        }, 2000);
      } else {
        throw new Error("Transaction failed. Please try again.");
      }
    } catch (err) {
      console.error("Error processing purchase:", err);
      setError(err.message || "Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading payment details...
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <main className="flex-1 overflow-y-auto">
        <header
          className={`w-full border-b ${isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"} backdrop-blur-sm sticky top-0 z-10`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-500" size={28} />
                <h1 className="text-2xl font-bold">Checkout</h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-xl font-medium ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => navigate("/home/informationBook", { state: { bookData } })}
                disabled={isProcessing}
              >
                Back to Book
              </motion.button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {error && (
            <div
              className={`mx-auto mt-4 p-3 rounded-lg flex items-center gap-2 max-w-7xl ${isDarkMode ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-800"}`}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div
              className={`mx-auto mt-4 p-3 rounded-lg flex items-center gap-2 max-w-7xl ${isDarkMode ? "bg-green-900/50 text-green-200" : "bg-green-100 text-green-800"}`}
            >
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={bookData.cover}
                  alt={bookData.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{bookData.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{bookData.author}</p>
                  <p className="text-lg font-bold mt-2">{bookData.price.toLocaleString("vi-VN")} đ</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <span className="text-xl font-bold text-blue-500">{bookData.price.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              {paymentMethods.length === 0 ? (
                <div className={`p-4 rounded-xl text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <p className="text-sm">No payment methods available.</p>
                  <button
                    onClick={() => navigate("/home/wallet", { state: { fromCheckout: true } })}
                    className="text-blue-500 text-sm mt-2"
                  >
                    Add a payment method
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckout}>
                  <div className="space-y-2 mb-6">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.paymentMethodId}
                        onClick={() => !isProcessing && setSelectedPaymentMethod(method.paymentMethodId)}
                        className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer border-2 ${selectedPaymentMethod === method.paymentMethodId ? "border-blue-500" : isDarkMode ? "border-gray-700" : "border-gray-200"} ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.paymentMethodId ? "border-blue-500" : isDarkMode ? "border-gray-500" : "border-gray-400"}`}
                        >
                          {selectedPaymentMethod === method.paymentMethodId && (
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
                              Expires {method.expirationDate.substring(0, 7).replace("-", "/")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => !isProcessing && navigate("/home/informationBook", { state: { bookData } })}
                      className={`px-4 py-2 rounded-xl mr-3 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white ${isProcessing || !selectedPaymentMethod ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isProcessing || !selectedPaymentMethod}
                    >
                      {isProcessing ? "Processing..." : "Confirm Payment"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookCheckout;