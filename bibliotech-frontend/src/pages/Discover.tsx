import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Search, X } from "lucide-react";
import bookService from "../services/bookService"; 
import usersService from "../services/usersService"; 
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState<(PopularBook | SaleBook) | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const navigate = useNavigate();

  interface PopularBook {
    id: number;
    title: string;
    author: string;
    price: number;
    image: string;
    pages: null;
    rating: number;
    reviews: number;
    description?: string;
    genres: string[];
  }
  
  interface SaleBook {
    id: number;
    title: string;
    author: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    image: string;
    genres: string[];
  }

  interface BookResponse {
    author: string;
    description: string;
    categoryNames: string[];
    averageRating: number;
  }
  
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [saleBooks, setSaleBooks] = useState<SaleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReadNow = async (book) => {
    try {
      // Create a reading history entry
      const readingSession: ReadingHistoryDto = {
        userId: 0, // The backend will use the authenticated user's ID
        bookId: book.id,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(), // Initially same as start time
        pagesRead: 0,
        currentPage: 0
      };
      
      // Record the reading session
      await usersService.recordReadingSession(readingSession);
      
      // Navigate to book information page
      navigate(`/home/informationBook`, { state: { bookData: book } });
      setSelectedBook(null);
    } catch (err) {
      console.error("Error recording reading history:", err);
      // You might want to show an error toast here
      
      // Still navigate even if recording fails
      navigate(`/home/informationBook`, { state: { bookData: book } });
      setSelectedBook(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedBook) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBook]);

  // Fetch popular books and sale books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        // Fetch top-rated books (popular books)
        const popularBooksResponse = await bookService.getTopRatedBooks(5);

        // Fetch sale books
        const saleBooksResponse = await bookService.getSaleBooksCoverInfo();

        // Map the API responses to match our component's expected format
        const mappedPopularBooks = popularBooksResponse.data.map((book) => ({
          id: book.bookId,
          title: book.title,
          author: book.author,
          price: Number(book.originalPrice) || 0, // Provide default value
          image: book.coverImageUrl || "/api/placeholder/300/400",
          pages: null, // API doesn't provide this info
          rating: book.averageRating || 0,
          reviews: 0, // API doesn't provide this info
          description: book.description,
          genres: book.categories?.map(category => category.categoryName) || [],
        }));

        // For sale books, update the mapping to match your API response:
        const mappedSaleBooks = saleBooksResponse.data
          .slice(0, 5)
          .map((book) => ({
            id: book.bookId,
            title: book.title,
            author: "", // API doesn't provide this in sale info
            originalPrice: Number(book.originalPrice) || 0, // Changed from book.price
            salePrice: Number(book.discountedPrice) || 0, // Changed from book.salePrice
            discount: (book.originalPrice, book.discountedPrice), // Calculate from actual prices
            image: book.coverImageUrl || "/api/placeholder/300/400", // Changed from book.coverImage
            genres: [], // API doesn't provide this in sale info
          }));

        setPopularBooks(mappedPopularBooks);
        setSaleBooks(mappedSaleBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Fetch book details when a sale book is selected
  useEffect(() => {
    if (selectedBook && !selectedBook.description) {
      const fetchBookDetails = async () => {
        try {
          const response = await bookService.getBookById(selectedBook.id);
          const bookDetails = response.data as BookResponse;

          // Update the selected book with additional details
          setSelectedBook((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              author: bookDetails.author,
              description: bookDetails.description,
              genres: bookDetails.categoryNames || [],
              rating: bookDetails.averageRating || 0,
            };
          });
        } catch (err) {
          console.error("Error fetching book details:", err);
        }
      };

      fetchBookDetails();
    }
  }, [selectedBook]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const response = await usersService.getCurrentUserBalance();
        setUserBalance(response.accountBalance);
      } catch (err) {
        console.error("Error fetching user balance:", err);
        // Optionally show an error toast/message
      }
    };
  
    fetchUserBalance();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const bookCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="flex-1 flex flex-col">
        <header
          className={`sticky top-0 z-10 bg-white ${
            scrollY > 0 ? "shadow-sm" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <motion.div
                  animate={{
                    scale: isSearchFocused ? 1.02 : 1,
                    boxShadow: isSearchFocused
                      ? "0 4px 20px rgba(0,0,0,0.1)"
                      : "none",
                  }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Discover your next favorite book..."
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-blue-500 focus:outline-none"
                  />
                </motion.div>
              </div>

              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl bg-white shadow-sm"
                >
                  <span className="font-medium">Balance: ${userBalance.toFixed(2)}</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p>{error}</p>
              </div>
            )}

            {/* Popular Books Section */}
            {!loading && popularBooks.length > 0 && (
              <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mb-12"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Popular Books
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    View All
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {popularBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      variants={bookCardVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 flex items-center justify-center p-3">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="max-w-[90%] max-h-[90%] object-contain"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex gap-2 mb-2">
                            {book.genres &&
                              book.genres.map((genre) => (
                                <span
                                  key={genre}
                                  className="px-2 py-1 text-xs rounded-full bg-white/90 text-gray-800"
                                >
                                  {genre}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-sm mb-2 text-gray-600">
                          {book.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-500 font-bold">
                            $
                            {typeof book.price === "number"
                              ? book.price.toFixed(2)
                              : "0.00"}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">
                              {typeof book.rating === "number"
                                ? book.rating.toFixed(1)
                                : "0.0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Sale Books Section */}
            {!loading && saleBooks.length > 0 && (
              <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mb-12"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    On Sale
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    View All
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {saleBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      variants={bookCardVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 flex items-center justify-center p-3">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="max-w-[90%] max-h-[90%] object-contain"
                        />
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -
                          {typeof book.discount === "number"
                            ? book.discount
                            : 0}
                          %
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-sm mb-2 text-gray-600">
                          {book.author}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-400">
                            $
                            {typeof book.originalPrice === "number"
                              ? book.originalPrice.toFixed(2)
                              : "0.00"}
                          </span>
                          <span className="text-red-500 font-bold">
                            $
                            {typeof book.salePrice === "number"
                              ? book.salePrice.toFixed(2)
                              : "0.00"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* No results state */}
            {!loading &&
              popularBooks.length === 0 &&
              saleBooks.length === 0 &&
              !error && (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-xl text-gray-600 mb-4">No books found</p>
                  <p className="text-gray-500">
                    Try adjusting your search or check back later
                  </p>
                </div>
              )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            <motion.aside
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              className="fixed right-0 w-96 h-screen bg-white border-l border-gray-200 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Book Details
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedBook(null)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-lg bg-gray-100 flex items-center justify-center p-4">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="max-w-[90%] max-h-[90%] object-contain"
                  />
                  {'salePrice' in selectedBook && selectedBook.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{selectedBook.discount}%
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    {selectedBook.title}
                  </h2>
                  <p className="text-lg mb-6 text-gray-600">
                    {selectedBook.author}
                  </p>

                  {selectedBook.rating !== undefined && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 rounded-xl bg-gray-50"
                      >
                        <p className="font-bold text-xl text-gray-900">
                          {typeof selectedBook.rating === "number"
                            ? selectedBook.rating.toFixed(1)
                            : "0.0"}
                        </p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </motion.div>
                      {selectedBook.originalPrice ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-4 rounded-xl bg-gray-50"
                        >
                          <p className="font-bold text-xl text-red-500">
                            $
                            {typeof selectedBook.salePrice === "number"
                              ? selectedBook.salePrice.toFixed(2)
                              : "0.00"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="line-through">
                              $
                              {typeof selectedBook.originalPrice === "number"
                                ? selectedBook.originalPrice.toFixed(2)
                                : "0.00"}
                            </span>
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-4 rounded-xl bg-gray-50"
                        >
                          <p className="font-bold text-xl text-blue-500">
                            $
                            {typeof selectedBook.price === "number"
                              ? selectedBook.price.toFixed(2)
                              : "0.00"}
                          </p>
                          <p className="text-sm text-gray-600">Price</p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {selectedBook.genres && selectedBook.genres.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-gray-900">
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBook.genres.map((genre) => (
                          <motion.span
                            key={genre}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700"
                          >
                            {genre}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBook.description && (
                    <div className="mb-8">
                      <h3 className="font-semibold mb-3 text-gray-900">
                        Description
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {selectedBook.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReadNow(selectedBook)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Read Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 text-gray-900"
                  >
                    Add to Library
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;
