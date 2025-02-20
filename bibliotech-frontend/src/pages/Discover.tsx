import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Search, X } from "lucide-react";

const Discover = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll position for animations
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample book data with enhanced information
  const popularBooks = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 4.99,
      image: "/api/placeholder/300/400",
      pages: 336,
      rating: 4.5,
      reviews: 100,
      description:
        "Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred.",
      genres: ["Classic", "Fiction"],
    },
  ];

  const saleBooks = [
    {
      id: 4,
      title: "The Perfect Couple",
      author: "Elin Hilderbrand",
      originalPrice: 5.99,
      salePrice: 4.99,
      image: "/api/placeholder/300/400",
      discount: 20,
      genres: ["Romance", "Mystery"],
    },
  ];

  // Animation variants
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
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 flex flex-col transition-all duration-300">
        <header
          className={`sticky top-0 z-10 backdrop-blur-lg ${
            scrollY > 0 ? "shadow-lg" : ""
          } ${isDarkMode ? "bg-gray-900/90" : "bg-white/90"}`}
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
                  <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Discover your next favorite book..."
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl transition-all ${
                      isDarkMode
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-gray-50 text-gray-900 placeholder-gray-500"
                    } border-2 ${
                      isSearchFocused
                        ? "border-blue-500"
                        : isDarkMode
                        ? "border-gray-700"
                        : "border-gray-200"
                    } focus:outline-none`}
                  />
                </motion.div>
              </div>

              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-6 py-2 rounded-xl ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-sm`}
                >
                  <span className="font-medium">Balance: $0.00</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
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
                    className={`rounded-2xl overflow-hidden ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-lg hover:shadow-xl transition-shadow`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex gap-2 mb-2">
                          {book.genres.map((genre) => (
                            <span
                              key={genre}
                              className="px-2 py-1 text-xs rounded-full bg-white/20 text-white"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p
                        className={`text-sm mb-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {book.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-500 font-bold">
                          ${book.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm">{book.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

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
                    className={`rounded-2xl overflow-hidden ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-lg hover:shadow-xl transition-shadow`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{book.discount}%
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p
                        className={`text-sm mb-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {book.author}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-400">
                          ${book.originalPrice}
                        </span>
                        <span className="text-red-500 font-bold">
                          ${book.salePrice}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedBook && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className={`fixed right-0 w-96 h-screen ${
              isDarkMode
                ? "bg-gray-800/95 border-gray-700"
                : "bg-white/95 border-gray-200"
            } border-l backdrop-blur-xl shadow-2xl`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Book Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedBook(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {selectedBook.title}
                </h2>
                <p
                  className={`text-lg mb-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedBook.author}
                </p>

                {selectedBook.pages && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-4 rounded-xl ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-bold text-xl">{selectedBook.pages}</p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Pages
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-4 rounded-xl ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-bold text-xl">{selectedBook.rating}</p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Rating
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-4 rounded-xl ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-bold text-xl">
                        {selectedBook.reviews}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Reviews
                      </p>
                    </motion.div>
                  </div>
                )}

                {selectedBook.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedBook.description}
                    </p>
                  </div>
                )}

                {selectedBook.genres && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.genres.map((genre) => (
                        <span
                          key={genre}
                          className={`px-3 py-1 text-sm rounded-full ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${selectedBook.salePrice || selectedBook.price}
                    </span>
                    {selectedBook.originalPrice && (
                      <span className="text-sm line-through text-gray-400">
                        ${selectedBook.originalPrice}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl font-semibold ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;
