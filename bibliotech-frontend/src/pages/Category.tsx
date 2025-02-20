import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../Hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, SlidersHorizontal, X, Search } from "lucide-react";

const Category = () => {
  const { isDarkMode } = useTheme();
  const scrollContainerRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeFilters, setActiveFilters] = useState({
    price: [],
    rating: [],
    featured: false
  });

  const categories = [
    { id: 1, name: "Fiction", count: 120, color: "bg-red-500", icon: "📖" },
    { id: 2, name: "Science", count: 80, color: "bg-blue-500", icon: "🔬" },
    { id: 3, name: "History", count: 60, color: "bg-yellow-500", icon: "🏛" }
  ];

  const [books, setBooks] = useState([]);


  // Scroll handler for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced CategoryRow with motion
  const CategoryRow = ({ categories }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex gap-4"
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className={`category-card p-4 rounded-xl cursor-pointer flex-shrink-0 w-[280px] 
            ${isDarkMode ? "bg-gray-800/90 backdrop-blur-lg" : "bg-white/90 backdrop-blur-lg"} 
            shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className={`w-12 h-12 flex items-center justify-center rounded-xl ${category.color}`}
            >
              <span className="text-2xl">{category.icon}</span>
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {category.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {category.count.toLocaleString()} books
              </p>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="text-gray-400"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Enhanced BookCard with motion
  const BookCard = ({ book, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`book-card group relative w-full rounded-xl overflow-hidden 
        ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} 
        shadow-xl backdrop-blur-lg`}
    >
      <motion.div 
        className="relative aspect-[3/4] overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
        
        {book.featured && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white 
              px-4 py-1.5 rounded-full text-sm font-medium z-10"
          >
            Featured
          </motion.div>
        )}
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm 
            text-black px-6 py-2 rounded-full font-medium group-hover:opacity-100 
            transform group-hover:translate-y-0 transition-all duration-300"
        >
          Quick View
        </motion.button>
      </motion.div>

      <div className="p-5">
        <motion.div 
          className="flex items-center gap-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Rating stars animation */}
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-4 h-4 ${i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </div>
        </motion.div>

        <motion.h3 
          className="font-bold text-lg mb-1 line-clamp-2 bg-gradient-to-r from-blue-500 
            to-purple-500 bg-clip-text text-transparent"
        >
          {book.title}
        </motion.h3>
        
        <motion.p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
          by {book.author}
        </motion.p>
        
        <motion.div 
          className="flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
            ${book.price.toFixed(2)}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 
              rounded-lg text-sm font-medium transition-all duration-200"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );

  // Enhanced search input with animation
  const SearchInput = () => (
    <motion.div 
      className="relative flex-1 max-w-md"
      animate={{ scale: searchFocused ? 1.02 : 1 }}
    >
      <motion.div
        className={`absolute inset-y-0 left-3 flex items-center pointer-events-none
          ${searchFocused ? "text-blue-500" : "text-gray-400"}`}
      >
        <Search className="w-5 h-5" />
      </motion.div>
      <input
        type="text"
        placeholder="Search categories"
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        className={`w-full pl-10 p-3 rounded-xl transition-all duration-300 
          ${isDarkMode ? "bg-gray-800/90 text-white" : "bg-white/90 text-gray-900"} 
          border-2 ${searchFocused ? "border-blue-500" : "border-gray-200 dark:border-gray-700"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-lg`}
      />
    </motion.div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <main
        className={`flex-1 flex flex-col transition-all duration-300 
          ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      >
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowFilters(false)}
            />
          )}
        </AnimatePresence>

        <motion.header
          className={`sticky top-0 w-full border-b z-30 
            ${isDarkMode ? "bg-gray-900/90 border-gray-700" : "bg-gray-50/90 border-gray-200"} 
            backdrop-blur-lg`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <SearchInput />
              <div className="flex items-center gap-6">
                <motion.span 
                  className="font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Balance: $0.00
                </motion.span>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {/* Categories section */}
              <motion.h2 
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 
                  bg-clip-text text-transparent"
              >
                Browse Categories
              </motion.h2>
              
              {/* Categories carousel */}
              <div className="relative">
                <CategoryRow categories={categories.slice(0, 8)} />
                <CategoryRow categories={categories.slice(8)} />
              </div>
            </motion.div>

            {/* Books grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;