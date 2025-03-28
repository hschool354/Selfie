import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Heart, Trash2, Star, BookOpen, X, ChevronLeft } from "lucide-react";
import wishlistService from "../services/WishlistService";
import bookService from "../services/bookService";
import usersService from "../services/usersService";

const Favorites = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [favoritedBooks, setFavoritedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Fetch wishlist when component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await wishlistService.getMyWishlist();
        const wishlistData = await Promise.all(
          response.data.map(async (item) => {
            const bookDetails = await bookService.getBookById(item.bookId);
            return {
              id: item.bookId,
              title: bookDetails.data.title,
              author: bookDetails.data.author,
              price: bookDetails.data.discountedPrice || bookDetails.data.originalPrice,
              dateAdded: item.addedDate,
              pages: bookDetails.data.pageCount || 0,
              rating: bookDetails.data.averageRating || 0,
              reviews: bookDetails.data.ratingCount || 0,
              description: bookDetails.data.description || "No description available",
              coverUrl: bookDetails.data.coverImageUrl || "/api/placeholder/300/400",
            };
          })
        );
        setFavoritedBooks(wishlistData);
      } catch (err) {
        setError("Failed to load wishlist. Please try again.");
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const balanceData = await usersService.getCurrentUserBalance();
        setUserBalance(balanceData.accountBalance);
      } catch (err) {
        console.error("Error fetching user balance:", err);
      }
    };

    fetchUserBalance();
  }, []);

  // Handle removing book from wishlist
  const handleRemoveFromFavorites = async (bookId) => {
    try {
      await wishlistService.removeBookFromWishlist(bookId);
      setFavoritedBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setShowDeleteConfirm(null);
      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("Failed to remove book from wishlist.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const bookCardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: "100%",
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <header className={`sticky top-0 z-10 backdrop-blur-lg ${
          isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-gray-50/80 border-gray-200"
        } border-b`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                </motion.div>
                <h1 className="text-2xl font-bold">My Favorites</h1>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-medium">Balance: ${userBalance.toFixed(2)}</span>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {favoritedBooks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Your wishlist is empty.
            </p>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            >
              <AnimatePresence>
                {favoritedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={bookCardVariants}
                    whileHover={{ y: -5 }}
                    className={`group relative rounded-xl overflow-hidden ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <motion.div 
                      className="aspect-[3/4] relative cursor-pointer"
                      onClick={() => setSelectedBook(book)}
                    >
                      <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm"
                      onClick={() => setShowDeleteConfirm(book.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{book.rating}</span>
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">${book.price}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedBook && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className={`fixed md:relative right-0 w-full md:w-[420px] h-screen border-l overflow-y-auto ${
              isDarkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"
            } backdrop-blur-md z-20`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="hidden md:block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-6 shadow-xl">
                <img 
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">{selectedBook.author}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="text-center p-4 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-sm"
                >
                  <p className="font-bold text-xl">{selectedBook.pages}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pages</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="text-center p-4 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <p className="font-bold text-xl">{selectedBook.rating}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="text-center p-4 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-sm"
                >
                  <p className="font-bold text-xl">{selectedBook.reviews}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
                </motion.div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {selectedBook.description}
              </p>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Read Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(selectedBook.id)}
                  className="px-4 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Remove from Favorites?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to remove this book from your favorites? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRemoveFromFavorites(showDeleteConfirm)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
                >
                  Remove
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;