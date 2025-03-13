import React, { useState, useEffect } from "react";
import { useTheme } from "../Hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Search,
  Filter,
  SlidersHorizontal,
  X,
} from "lucide-react";
import bookService from "../services/bookService";
import usersService from "../services/usersService"; 
import { useNavigate } from "react-router-dom";

const ExploreAllBooks = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // States
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    price: [],
    rating: [],
    featured: false,
    categories: [],
  });
 

  const handleReadNow = async (book) => {
    try {
      // Create a reading history entry
      const readingSession = {
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
    } catch (err) {
      console.error("Error recording reading history:", err);
      // Still navigate even if recording fails
      navigate(`/home/informationBook`, { state: { bookData: book } });
    }
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const itemsPerPage = 20;

  // Sorting state
  const [sortBy, setSortBy] = useState("newest");

  // Categories state
  const [categories, setCategories] = useState([]);

  // Fetch books and categories when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
        try {
          setLoading(true);
          
          // THÊM LOG DEBUG VÀO ĐÂY - TRƯỚC KHI GỌI API
          console.log("Fetching books with params:", {
            searchQuery,
            category: activeFilters.categories.length > 0 ? activeFilters.categories[0] : undefined,
            minPrice: getPriceRangeMin(activeFilters.price),
            maxPrice: getPriceRangeMax(activeFilters.price),
            hasDiscount: activeFilters.featured,
            page: currentPage - 1,
            size: itemsPerPage,
            sortBy: getSortField(sortBy),
            direction: getSortDirection(sortBy)
          });
          
          // Prepare filter parameters according to the bookService.getAllBooks function
          const response = await bookService.getAllBooks(
            searchQuery, // title
            "", // author (you can add this as a filter if needed)
            activeFilters.categories.length > 0
              ? activeFilters.categories[0]
              : undefined, // category
            "", // language
            // Convert price ranges to actual numbers
            getPriceRangeMin(activeFilters.price),
            getPriceRangeMax(activeFilters.price),
            activeFilters.featured, // hasDiscount
            currentPage - 1, // API uses 0-based indexing
            itemsPerPage,
            getSortField(sortBy), // Convert UI sort options to API fields
            getSortDirection(sortBy) // Convert UI sort options to API directions
          );
          
          // THÊM LOG DEBUG VÀO ĐÂY - SAU KHI NHẬN PHẢN HỒI API
          console.log("API Response:", response);
          console.log("Received books:", response.data);
          console.log("Books length:", Array.isArray(response.data) ? response.data.length : 0);
          
          // Xử lý dữ liệu phản hồi
          if (response && response.data) {
            const booksData = Array.isArray(response.data) ? response.data : [];
            setBooks(booksData);
            setTotalBooks(booksData.length);
            setTotalPages(Math.ceil(booksData.length / itemsPerPage));
          } else {
            setBooks([]);
            setTotalPages(1);
            setTotalBooks(0);
          }
      
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch books:", err);
          setError("Failed to load books. Please try again later.");
          setLoading(false);
        }
      };

    const getPriceRangeMin = (priceRanges) => {
      if (priceRanges.includes("Under $5")) return 0;
      if (priceRanges.includes("$5 - $10")) return 5;
      if (priceRanges.includes("$10 - $20")) return 10;
      return undefined;
    };

    const getPriceRangeMax = (priceRanges) => {
      if (priceRanges.includes("Under $5")) return 5;
      if (priceRanges.includes("$5 - $10")) return 10;
      if (priceRanges.includes("$10 - $20")) return 20;
      return undefined;
    };

    const getSortField = (sortOption) => {
      switch (sortOption) {
        case "newest":
        case "oldest":
          return "createdAt";
        case "priceAsc":
        case "priceDesc":
          return "originalPrice";
        case "ratingDesc":
          return "averageRating";
        default:
          return "title";
      }
    };

    const getSortDirection = (sortOption) => {
      switch (sortOption) {
        case "oldest":
        case "priceAsc":
          return "asc";
        case "newest":
        case "priceDesc":
        case "ratingDesc":
          return "desc";
        default:
          return "asc";
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await bookService.getAllCategories();
        // Process categories similar to the Category component
        const processedCategories = response.data.map((category) => {
          return {
            id: category.categoryId,
            name: category.categoryName,
            description: category.description,
          };
        });
        setCategories(processedCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchBooks();
    fetchCategories();
  }, [currentPage, sortBy, searchQuery, activeFilters]);

  // Handler for going back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handler for search queries
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handler for filter toggle
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handler for applying filters
  const applyFilters = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setShowFilters(false);
  };

  // Handler for changing sort
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Enhanced BookCard component with motion
  const BookCard = ({ book, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className={`book-card group relative w-full rounded-xl overflow-hidden 
        ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} 
        shadow-xl backdrop-blur-lg`}
    >
      <motion.div
        className="relative aspect-[3/4] overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-5xl">📚</span>
          </div>
        )}

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
            text-black px-6 py-2 rounded-full font-medium opacity-0 
            transform translate-y-10 group-hover:opacity-100 
            group-hover:translate-y-0 transition-all duration-300"
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
          {/* Rating stars */}
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-4 h-4 ${
                  i < Math.floor(book.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {book.averageRating?.toFixed(1) || "N/A"}
          </span>
        </motion.div>

        <motion.h3
          className="font-bold text-lg mb-1 line-clamp-2 bg-gradient-to-r from-blue-500 
            to-purple-500 bg-clip-text text-transparent"
        >
          {book.title}
        </motion.h3>

        <motion.p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
          by {book.author || "Unknown Author"}
        </motion.p>

        <motion.div
          className="flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
            ${book.discountedPrice || book.originalPrice || 9.99}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReadNow(book)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 
              rounded-lg text-sm font-medium transition-all duration-200"
          >
            Read Now
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
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search books"
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        className={`w-full pl-10 p-3 rounded-xl transition-all duration-300 
          ${
            isDarkMode
              ? "bg-gray-800/90 text-white"
              : "bg-white/90 text-gray-900"
          } 
          border-2 ${
            searchFocused
              ? "border-blue-500"
              : "border-gray-200 dark:border-gray-700"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-lg`}
      />
    </motion.div>
  );

  // Filter panel
  const FilterPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed right-0 top-0 h-full w-80 z-50 
            ${isDarkMode ? "bg-gray-800" : "bg-white"} 
            shadow-2xl p-6 overflow-y-auto`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Filters
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="space-y-6">
            {/* Price Range Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Price Range
              </h4>
              <div className="space-y-2">
                {["Under $5", "$5 - $10", "$10 - $20", "Over $20"].map(
                  (range) => (
                    <div key={range} className="flex items-center">
                      <input
                        type="checkbox"
                        id={range.replace(/\s/g, "")}
                        className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 rounded"
                        checked={activeFilters.price.includes(range)}
                        onChange={() => {
                          const newPriceFilters = activeFilters.price.includes(
                            range
                          )
                            ? activeFilters.price.filter((r) => r !== range)
                            : [...activeFilters.price, range];
                          setActiveFilters({
                            ...activeFilters,
                            price: newPriceFilters,
                          });
                        }}
                      />
                      <label
                        htmlFor={range.replace(/\s/g, "")}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {range}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Rating
              </h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating${rating}`}
                      className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 rounded"
                      checked={activeFilters.rating.includes(rating)}
                      onChange={() => {
                        const newRatingFilters = activeFilters.rating.includes(
                          rating
                        )
                          ? activeFilters.rating.filter((r) => r !== rating)
                          : [...activeFilters.rating, rating];
                        setActiveFilters({
                          ...activeFilters,
                          rating: newRatingFilters,
                        });
                      }}
                    />
                    <label
                      htmlFor={`rating${rating}`}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      {rating}+ <span className="text-yellow-400 ml-1">★</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Filter */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 rounded"
                  checked={activeFilters.featured}
                  onChange={() => {
                    setActiveFilters({
                      ...activeFilters,
                      featured: !activeFilters.featured,
                    });
                  }}
                />
                <label
                  htmlFor="featured"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Featured Books Only
                </label>
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Categories
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cat${category.id}`}
                      className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 rounded"
                      checked={activeFilters.categories.includes(category.id)}
                      onChange={() => {
                        const newCategories = activeFilters.categories.includes(
                          category.id
                        )
                          ? activeFilters.categories.filter(
                              (id) => id !== category.id
                            )
                          : [...activeFilters.categories, category.id];
                        setActiveFilters({
                          ...activeFilters,
                          categories: newCategories,
                        });
                      }}
                    />
                    <label
                      htmlFor={`cat${category.id}`}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setActiveFilters({
                      price: [],
                      rating: [],
                      featured: false,
                      categories: [],
                    })
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium flex-1"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium flex-1"
                >
                  Apply
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Pagination component
  const Pagination = () => (
    <div className="flex items-center justify-between mt-10 mb-8">
      <div className="text-gray-600 dark:text-gray-400">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalBooks)} -{" "}
        {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} books
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`p-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, index) => {
            // Logic to show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = index + 1;
            } else if (currentPage <= 3) {
              pageNum = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + index;
            } else {
              pageNum = currentPage - 2 + index;
            }

            return pageNum > 0 && pageNum <= totalPages ? (
              <motion.button
                key={pageNum}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </motion.button>
            ) : null;
          })}

          {/* Show ellipsis if there are more pages */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="text-gray-500 dark:text-gray-400">...</span>
          )}

          {/* Show last page if not visible */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(totalPages)}
              className="w-8 h-8 flex items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {totalPages}
            </motion.button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`p-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <ChevronLeft className="w-5 h-5 transform rotate-180" />
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <main
        className={`flex-1 flex flex-col transition-all duration-300 
          ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
          }`}
      >
        {/* Filter overlay */}
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

        {/* Filter panel */}
        <FilterPanel />

        {/* Header */}
        <motion.header
          className={`sticky top-0 w-full border-b z-30 
            ${
              isDarkMode
                ? "bg-gray-900/90 border-gray-700"
                : "bg-gray-50/90 border-gray-200"
            } 
            backdrop-blur-lg`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleGoBack}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <SearchInput />
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className={`p-2 rounded-lg border 
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="priceAsc">Price (Low to High)</option>
                  <option value="priceDesc">Price (High to Low)</option>
                  <option value="ratingDesc">Highest Rated</option>
                </select>

                <motion.button
                  onClick={toggleFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                Explore All Books
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                {Object.keys(activeFilters).some((key) => {
                  if (Array.isArray(activeFilters[key])) {
                    return activeFilters[key].length > 0;
                  }
                  return activeFilters[key] === true;
                }) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setActiveFilters({
                        price: [],
                        rating: [],
                        featured: false,
                        categories: [],
                      })
                    }
                    className="text-sm text-blue-500 dark:text-blue-400 font-medium flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-red-100 text-red-700 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            {/* No results state */}
            {!loading && !error && books.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  No Books Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilters({
                      price: [],
                      rating: [],
                      featured: false,
                      categories: [],
                    });
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium"
                >
                  Reset All Filters
                </motion.button>
              </motion.div>
            )}

            {/* Books grid */}
            {!loading && !error && books.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {books.map((book, index) => (
                    <BookCard
                      key={book.bookId || index}
                      book={book}
                      index={index}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExploreAllBooks;
