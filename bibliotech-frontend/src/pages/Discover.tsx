import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Search, X } from "lucide-react";

const Discover = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedBook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedBook]);

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
      description: "Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred.",
      genres: ["Classic", "Fiction"]
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
      genres: ["Romance", "Mystery"]
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="flex-1 flex flex-col">
        <header className={`sticky top-0 z-10 bg-white ${
          scrollY > 0 ? "shadow-sm" : ""
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <motion.div
                  animate={{
                    scale: isSearchFocused ? 1.02 : 1,
                    boxShadow: isSearchFocused ? "0 4px 20px rgba(0,0,0,0.1)" : "none"
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

        <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
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
                    className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex gap-2 mb-2">
                          {book.genres.map((genre) => (
                            <span key={genre} className="px-2 py-1 text-xs rounded-full bg-white/90 text-gray-800">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900">{book.title}</h3>
                      <p className="text-sm mb-2 text-gray-600">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-500 font-bold">${book.price}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{book.rating}</span>
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
                    className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
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
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900">{book.title}</h3>
                      <p className="text-sm mb-2 text-gray-600">{book.author}</p>
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
                  <h2 className="text-xl font-bold text-gray-900">Book Details</h2>
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
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{selectedBook.title}</h2>
                  <p className="text-lg mb-6 text-gray-600">{selectedBook.author}</p>

                  {selectedBook.pages && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 rounded-xl bg-gray-50"
                      >
                        <p className="font-bold text-xl text-gray-900">{selectedBook.pages}</p>
                        <p className="text-sm text-gray-600">Pages</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 rounded-xl bg-gray-50"
                      >
                        <p className="font-bold text-xl text-gray-900">{selectedBook.rating}</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 rounded-xl bg-gray-50"
                      >
                        <p className="font-bold text-xl text-gray-900">{selectedBook.reviews}</p>
                        <p className="text-sm text-gray-600">Reviews</p>
                      </motion.div>
                    </div>
                  )}

                  {selectedBook.genres && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-gray-900">Genres</h3>
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
                      <h3 className="font-semibold mb-3 text-gray-900">Description</h3>
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