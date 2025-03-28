import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { useLocation , useNavigate } from "react-router-dom";
import bookService from "../services/bookService";
import transactionService, { BookResponse as TransactionBookResponse } from "../services/transactionService";
import {
  BookOpen,
  Calendar,
  Globe,
  Star,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Users,
  Timer,
  AlertTriangle,
  Award,
  ArrowLeft,
} from "lucide-react";

// Define types
type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

const InformationBook = () => {
  const location = useLocation();
  const passedBookData = location.state?.bookData;
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("description");
  const [isLiked, setIsLiked] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [purchasedBooks, setPurchasedBooks] = useState<TransactionBookResponse[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchBookDetailsAndPurchases = async () => {
      try {
        setLoading(true);

        // Lấy danh sách sách đã mua
        let purchasedBooksData: TransactionBookResponse[] = [];
        try {
          const purchaseResponse = await transactionService.getMyPurchasedBooks();
          purchasedBooksData = purchaseResponse.data || [];
          setPurchasedBooks(purchasedBooksData);
        } catch (purchaseError) {
          console.error("Error fetching purchased books:", purchaseError);
          setPurchasedBooks([]); // Nếu lỗi, để danh sách rỗng
        }

        if (passedBookData) {
          const bookId = passedBookData.id || passedBookData.bookId; // Đảm bảo lấy đúng bookId

          try {
            const response = await bookService.getBookById(bookId);
            const data = response.data;

            // Kiểm tra dữ liệu trả về từ API
            if (!data || !data.bookId) {
              throw new Error("Invalid book data from API");
            }

            const formattedBook = {
              id: data.bookId,
              title: data.title || "Unknown Book",
              author: data.author || "Unknown Author",
              cover: data.coverImageUrl || "/api/placeholder/400/600",
              description: data.description || "No description available",
              price: data.originalPrice || 0,
              rating: data.averageRating || 0,
              reviews: data.ratingCount || 0,
              pages: data.pageCount || 0,
              publishYear: data.publicationYear || new Date().getFullYear(),
              language: data.language || "Tiếng Việt",
              publisher: "NXB Văn Học", // Giá trị mặc định
              category: data.categories?.map((cat: any) => cat.categoryName).join(", ") || "Không có thể loại",
              reading_difficulty: data.readingDifficulty || "MEDIUM",
              estimated_reading_time: data.estimatedReadingTime || 480,
              content_rating: data.contentRating || "TEEN",
              stock_quantity: data.stockQuantity || 0,
            };

            setBookDetails(formattedBook);

            // Kiểm tra xem sách có trong danh sách đã mua không
            const isBookPurchased = purchasedBooksData.some(
              (book) => book.bookId === formattedBook.id
            );
            setIsPurchased(isBookPurchased);
          } catch (apiError) {
            console.error("Error fetching book details from API:", apiError);
            // Fallback về passedBookData nếu API lỗi
            const fallbackBook = {
              id: passedBookData?.bookId || passedBookData?.id,
              title: passedBookData?.title || "Unknown Book",
              author: passedBookData?.author || "Unknown Author",
              cover: passedBookData?.coverImageUrl || "/api/placeholder/400/600",
              description: passedBookData?.description || "No description available",
              price: passedBookData?.originalPrice || 0,
              rating: passedBookData?.averageRating || 0,
              reviews: passedBookData?.ratingCount || 0,
              pages: passedBookData?.pageCount || 0,
              publishYear: passedBookData?.publicationYear || new Date().getFullYear(),
              language: passedBookData?.language || "Tiếng Việt",
              publisher: "NXB Văn Học",
              category: passedBookData?.categories?.map((cat: any) => cat.categoryName).join(", ") || "Không có thể loại",
              reading_difficulty: passedBookData?.readingDifficulty || "MEDIUM",
              estimated_reading_time: passedBookData?.estimatedReadingTime || 480,
              content_rating: passedBookData?.contentRating || "TEEN",
              stock_quantity: passedBookData?.stockQuantity || 0,
            };
            setBookDetails(fallbackBook);

            // Kiểm tra với fallback data
            const isBookPurchased = purchasedBooksData.some(
              (book) => book.bookId === fallbackBook.id
            );
            setIsPurchased(isBookPurchased);
          }

          // Mock dữ liệu sách tương tự
          const mockSimilarBooks = [
            { id: 1, title: "Related Book 1", author: "Author Name", cover: "/api/placeholder/300/450", rating: 4.3, reviews: 128 },
            { id: 2, title: "Related Book 2", author: "Another Author", cover: "/api/placeholder/300/450", rating: 4.1, reviews: 95 },
            { id: 3, title: "Related Book 3", author: "Third Author", cover: "/api/placeholder/300/450", rating: 4.7, reviews: 218 },
          ];
          setSimilarBooks(mockSimilarBooks);
        } else {
          setError("No book data provided");
        }
      } catch (error) {
        console.error("Error in fetchBookDetailsAndPurchases:", error);
        setError("Failed to load book information");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetailsAndPurchases();
  }, [passedBookData]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading book details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
  };

  const tabVariants = {
    inactive: { borderBottom: "2px solid transparent" },
    active: { borderBottom: "2px solid #3B82F6" },
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        />
      ));
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    const colors = { EASY: "text-green-500", MEDIUM: "text-yellow-500", HARD: "text-red-500" };
    return colors[difficulty] || "text-gray-500";
  };

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleReadBook = () => {
    console.log("Reading book:", bookDetails.title);
  };

  const handlePurchaseBook = () => {
    navigate("/home/bookCheckout", { state: { bookData: bookDetails } });
  };

  const handleReadWithPremium = () => {
    console.log("Read with Premium clicked");
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <style>
        {`
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: ${isDarkMode ? "#1F2937" : "#F3F4F6"}; }
          ::-webkit-scrollbar-thumb { background: ${isDarkMode ? "#4B5563" : "#E5E7EB"}; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? "#4B5563" : "#E5E7EB"}; opacity: 0.8; }
        `}
      </style>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.button
            className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-md transition-colors`}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={containerAnimation} className="md:col-span-1">
              <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <motion.img
                  src={bookDetails.cover}
                  alt={bookDetails.title}
                  className="w-full h-auto object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    {isPurchased ? (
                      <motion.button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReadBook}
                      >
                        <BookOpen className="w-5 h-5" />
                        Read
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white transition-colors`}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePurchaseBook}
                        >
                          {bookDetails.price.toLocaleString("vi-VN")} đ
                        </motion.button>
                        <motion.button
                          className={`ml-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white transition-colors`}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleReadWithPremium}
                        >
                          <Award className="w-5 h-5" />
                          Đọc với Premium
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      className={`ml-2 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${isLiked ? "text-red-500" : ""}`}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <motion.div animate={isLiked ? { scale: [1, 1.2, 1] } : {}}>
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                      </motion.div>
                    </motion.button>
                    <motion.button
                      className={`ml-2 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${getDifficultyColor(bookDetails.reading_difficulty)}`} />
                          <span className="text-sm">Độ khó:</span>
                        </div>
                        <span className={`font-medium ${getDifficultyColor(bookDetails.reading_difficulty)}`}>
                          {bookDetails.reading_difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Thời gian đọc:</span>
                        </div>
                        <span className="font-medium">{formatReadingTime(bookDetails.estimated_reading_time)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Độ tuổi:</span>
                        </div>
                        <span className="font-medium">{bookDetails.content_rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={containerAnimation} className="md:col-span-2">
              <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <motion.h1 className="text-3xl font-bold mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {bookDetails.title}
                </motion.h1>
                <motion.p className="text-lg text-blue-500 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {bookDetails.author}
                </motion.p>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">{renderStars(bookDetails.rating)}</div>
                  <span className="text-lg font-semibold">{bookDetails.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400">({bookDetails.reviews} đánh giá)</span>
                </div>

                <motion.div className="text-2xl font-bold mb-6 text-blue-500" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                  {bookDetails.price.toLocaleString("vi-VN")} đ
                </motion.div>

                <div className="border-b mb-6">
                  <div className="flex gap-6">
                    {["description", "details", "reviews"].map((tab) => (
                      <motion.button
                        key={tab}
                        className={`pb-2 px-1 ${selectedTab === tab ? "text-blue-500" : ""}`}
                        variants={tabVariants}
                        animate={selectedTab === tab ? "active" : "inactive"}
                        onClick={() => setSelectedTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={selectedTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {selectedTab === "description" && (
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{bookDetails.description}</p>
                    )}
                    {selectedTab === "details" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Số trang</span>
                          </div>
                          <p>{bookDetails.pages}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Năm xuất bản</span>
                          </div>
                          <p>{bookDetails.publishYear}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Ngôn ngữ</span>
                          </div>
                          <p>{bookDetails.language}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Bookmark className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Thể loại</span>
                          </div>
                          <p>{bookDetails.category}</p>
                        </div>
                      </div>
                    )}
                    {selectedTab === "reviews" && (
                      <div className="space-y-6">
                        <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold">{bookDetails.rating}</div>
                              <div className="flex justify-center mt-2">{renderStars(bookDetails.rating)}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bookDetails.reviews} đánh giá</div>
                            </div>
                            <div className="flex-1">
                              {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {Array(star)
                                      .fill(0)
                                      .map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                      ))}
                                  </div>
                                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400" style={{ width: `${Math.random() * 100}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <h3 className="font-semibold mb-4">Viết đánh giá của bạn</h3>
                          <div className="flex items-center gap-2 mb-4">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <motion.button key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Star className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                                </motion.button>
                              ))}
                          </div>
                          <textarea
                            className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} border border-gray-300 dark:border-gray-600`}
                            rows={4}
                            placeholder="Chia sẻ suy nghĩ của bạn về cuốn sách..."
                          />
                          <motion.button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            Gửi đánh giá
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div variants={containerAnimation} className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Sách tương tự</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                      whileHover={{ y: -5 }}
                    >
                      <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{book.author}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(book.rating)}</div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">({book.reviews})</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InformationBook;