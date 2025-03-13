import React, { useState, useEffect } from "react";
import { useTheme } from "../Hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Search, Filter, X } from "lucide-react";
import bookService from "../services/bookService";
import usersService from "../services/usersService";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  originalPrice?: number;
  discountedPrice?: number;
  averageRating?: number;
  featured?: boolean;
  totalSold?: number;
  publishDate?: string;
}

interface Category {
  categoryId: string;
  categoryName: string;
  description?: string;
  icon?: string;
  color?: string;
}

const CategoriesBook = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams();

  // States for UI
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  // States for sorting and filtering
  const [sortBy, setSortBy] = useState("popularity");
  const [activeFilters, setActiveFilters] = useState({
    price: [] as string[],
    rating: [] as string[],
    featured: false,
  });

  // States for data
  const [category, setCategory] = useState<Category | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const response = await usersService.getCurrentUserBalance();
        setUserBalance(response.accountBalance);
      } catch (err) {
        console.error("Error fetching user balance:", err);
      }
    };

    fetchUserBalance();
  }, []);

  // Get category from location state or fetch it if not available
  useEffect(() => {
    const initializeCategory = async () => {
        try {
          setLoading(true);
          let catId = null;
      
          // Try to get category from location state first
          const categoryFromState = location.state?.categoryData;
      
          if (categoryFromState) {
            catId = categoryFromState.id;
            setCategory({
              categoryId: categoryFromState.id,
              categoryName: categoryFromState.name,
              description: categoryFromState.description,
              icon: categoryFromState.icon,
              color: categoryFromState.color,
            });
          } else if (categoryId) {
            // If not from state, fetch it by ID
            catId = categoryId;
            const categoryResponse = await bookService.getCategoryById(categoryId);
            const categoryData = categoryResponse.data;
      
            // Add icon and color
            const { icon, color } = assignIconAndColor(categoryData.categoryName);
            setCategory({
              ...categoryData,
              icon,
              color,
            });
          } else {
            throw new Error("No category information available");
          }
      
          // Fetch initial books with the confirmed catId
          if (catId) {
            await fetchBooks(1, catId);
          } else {
            throw new Error("Category ID is missing");
          }
        } catch (err) {
          console.error("Failed to initialize category:", err);
          setError("Failed to load category information. Please try again.");
          setLoading(false);
        }
      };

    initializeCategory();
  }, [location.state, categoryId]);

  // Function to fetch books with pagination
  const fetchBooks = async (pageNumber: number, catId?: string) => {
    try {
      // Use the passed catId parameter or fall back to other sources
      const categoryIdentifier = catId || category?.categoryId || categoryId;
      if (!categoryIdentifier) {
        throw new Error("Category ID is missing");
      }
  
      const booksResponse = await bookService.getBooksByCategory(
        categoryIdentifier,
        pageNumber,
        12
      );
  
      if (pageNumber === 1) {
        setBooks(booksResponse.data);
      } else {
        setBooks((prev) => [...prev, ...booksResponse.data]);
      }
  
      setHasMore(booksResponse.data.length === 12);
      setPage(pageNumber);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books. Please try again.");
      setLoading(false);
    }
  };

  // Load more books
  const loadMoreBooks = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const catId = category?.categoryId || categoryId;
    await fetchBooks(page + 1, catId);
  };

  // Assign icon and color to category
  const assignIconAndColor = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    // Map icons based on category names
    const iconMap = {
      fiction: { icon: "📖", color: "bg-red-500" },
      novel: { icon: "📚", color: "bg-red-400" },
      science: { icon: "🔬", color: "bg-blue-500" },
      physics: { icon: "⚛️", color: "bg-blue-400" },
      chemistry: { icon: "🧪", color: "bg-blue-600" },
      biology: { icon: "🧬", color: "bg-green-500" },
      history: { icon: "🏛", color: "bg-yellow-500" },
      art: { icon: "🎨", color: "bg-purple-500" },
      music: { icon: "🎵", color: "bg-purple-400" },
      mathematics: { icon: "🔢", color: "bg-indigo-500" },
      computer: { icon: "💻", color: "bg-gray-700" },
      programming: { icon: "👨‍💻", color: "bg-gray-600" },
      philosophy: { icon: "🧠", color: "bg-amber-500" },
      psychology: { icon: "🧐", color: "bg-amber-400" },
      religion: { icon: "🙏", color: "bg-teal-500" },
      business: { icon: "💼", color: "bg-blue-800" },
      economics: { icon: "📊", color: "bg-blue-700" },
      cooking: { icon: "🍳", color: "bg-green-400" },
      sports: { icon: "⚽", color: "bg-green-600" },
      travel: { icon: "🌍", color: "bg-cyan-500" },
      biography: { icon: "👤", color: "bg-pink-500" },
      children: { icon: "👶", color: "bg-pink-400" },
      fantasy: { icon: "🧙‍♂️", color: "bg-purple-600" },
      thriller: { icon: "🔍", color: "bg-red-600" },
      horror: { icon: "👻", color: "bg-gray-800" },
      romance: { icon: "❤️", color: "bg-pink-600" },
      poetry: { icon: "🪶", color: "bg-amber-600" },
      comics: { icon: "💬", color: "bg-yellow-400" },
      health: { icon: "🩺", color: "bg-emerald-500" },
      selfhelp: { icon: "🌱", color: "bg-emerald-400" },
    };

    // Find partial matches
    for (const key in iconMap) {
      if (name.includes(key) || key.includes(name)) {
        return iconMap[key];
      }
    }

    // Default if no match found
    return { icon: "📗", color: "bg-lime-500" };
  };

  // Filter and sort books
  const getFilteredBooks = () => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (activeFilters.price.length > 0) {
      filtered = filtered.filter((book) => {
        const price = book.discountedPrice || book.originalPrice || 0;
        if (activeFilters.price.includes("under10") && price < 10) return true;
        if (activeFilters.price.includes("10to20") && price >= 10 && price < 20)
          return true;
        if (activeFilters.price.includes("20to30") && price >= 20 && price < 30)
          return true;
        if (activeFilters.price.includes("30plus") && price >= 30) return true;
        return false;
      });
    }

    // Rating filter
    if (activeFilters.rating.length > 0) {
      filtered = filtered.filter((book) => {
        const rating = book.averageRating || 0;
        if (activeFilters.rating.includes("4plus") && rating >= 4) return true;
        if (activeFilters.rating.includes("3to4") && rating >= 3 && rating < 4)
          return true;
        if (activeFilters.rating.includes("under3") && rating < 3) return true;
        return false;
      });
    }

    // Featured filter
    if (activeFilters.featured) {
      filtered = filtered.filter((book) => book.featured);
    }

    // Sorting
    if (sortBy === "popularity") {
      filtered.sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    } else if (sortBy === "priceAsc") {
      filtered.sort(
        (a, b) =>
          (a.discountedPrice || a.originalPrice || 0) -
          (b.discountedPrice || b.originalPrice || 0)
      );
    } else if (sortBy === "priceDesc") {
      filtered.sort(
        (a, b) =>
          (b.discountedPrice || b.originalPrice || 0) -
          (a.discountedPrice || a.originalPrice || 0)
      );
    } else if (sortBy === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.publishDate || 0).getTime() -
          new Date(a.publishDate || 0).getTime()
      );
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    return filtered;
  };

  // Components
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
        placeholder="Search books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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

  const FilterPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          className={`fixed right-0 top-0 h-full w-80 shadow-xl z-50 p-6 
            ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filters</h3>
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setShowFilters(false)}
            />
          </div>

          {/* Sort options */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Sort By</h4>
            <div className="space-y-2">
              {[
                { id: "popularity", label: "Most Popular" },
                { id: "rating", label: "Highest Rated" },
                { id: "newest", label: "Newest First" },
                { id: "priceAsc", label: "Price: Low to High" },
                { id: "priceDesc", label: "Price: High to Low" },
              ].map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`cursor-pointer p-2 rounded-lg ${
                    sortBy === option.id
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-2">
              {[
                { id: "under10", label: "Under $10" },
                { id: "10to20", label: "$10 - $20" },
                { id: "20to30", label: "$20 - $30" },
                { id: "30plus", label: "$30+" },
              ].map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`price-${option.id}`}
                    checked={activeFilters.price.includes(option.id)}
                    onChange={() => {
                      setActiveFilters((prev) => {
                        const newPrices = prev.price.includes(option.id)
                          ? prev.price.filter((id) => id !== option.id)
                          : [...prev.price, option.id];
                        return { ...prev, price: newPrices };
                      });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`price-${option.id}`}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Rating</h4>
            <div className="space-y-2">
              {[
                { id: "4plus", label: "4★ & above" },
                { id: "3to4", label: "3★ - 4★" },
                { id: "under3", label: "Under 3★" },
              ].map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`rating-${option.id}`}
                    checked={activeFilters.rating.includes(option.id)}
                    onChange={() => {
                      setActiveFilters((prev) => {
                        const newRatings = prev.rating.includes(option.id)
                          ? prev.rating.filter((id) => id !== option.id)
                          : [...prev.rating, option.id];
                        return { ...prev, rating: newRatings };
                      });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`rating-${option.id}`}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Featured filter */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={activeFilters.featured}
                onChange={() => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    featured: !prev.featured,
                  }));
                }}
                className="mr-2"
              />
              <label htmlFor="featured">Featured Books Only</label>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setActiveFilters({
                price: [],
                rating: [],
                featured: false,
              });
              setSortBy("popularity");
            }}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const BookCard = ({ book, index }: { book: Book; index: number }) => {
    // Random book icon when no image
    const bookIcons = ["📚", "📖", "📘", "📕", "📗", "📙"];
    const randomIcon = bookIcons[index % bookIcons.length];

    // Diverse color gradients for cards
    const cardGradients = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-indigo-600",
      "from-green-500 to-emerald-600",
      "from-amber-500 to-orange-600",
      "from-purple-500 to-violet-600",
      "from-red-500 to-rose-600",
      "from-teal-500 to-cyan-600",
      "from-fuchsia-500 to-pink-600",
    ];

    // Get corresponding gradient
    const gradient = cardGradients[index % cardGradients.length];

    return (
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
              className="w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <span className="text-5xl">{randomIcon}</span>
            </div>
          )}

          {book.featured && (
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              className="absolute top-4 left-0 bg-blue-500/90 backdrop-blur-sm text-white 
                px-4 py-1.5 rounded-r-full text-sm font-medium z-10"
            >
              Featured
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white/90 backdrop-blur-sm text-black px-6 py-2 rounded-full font-medium 
                mx-auto mb-4 transform transition-all duration-300"
            >
              Quick View
            </motion.button>
          </motion.div>
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
              {book.averageRating && (
                <>
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                    {book.averageRating.toFixed(1)}
                  </span>
                </>
              )}
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
            <div className="flex items-center gap-2">
              <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                $
                {(book.discountedPrice || book.originalPrice || 9.99).toFixed(
                  2
                )}
              </p>
              {book.discountedPrice && book.originalPrice && (
                <span className="text-gray-400 line-through text-sm">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
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
  };

  const CategoryBanner = () => {
    if (!category) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 p-6 rounded-xl overflow-hidden relative ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className={`w-16 h-16 flex items-center justify-center rounded-xl ${category.color}`}
          >
            <span className="text-3xl">{category.icon}</span>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {category.categoryName}
            </h1>
            {category.description && (
              <p
                className={`mt-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Gradient decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <main
        className={`flex-1 flex flex-col transition-all duration-300 
          ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
          }`}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className={`p-2 rounded-full ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-md`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <SearchInput />
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(true)}
                  className={`p-2 rounded-full ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-md`}
                >
                  <Filter className="w-5 h-5" />
                </motion.button>
                <motion.span
                  className="font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-medium">
                    Balance: ${userBalance.toFixed(2)}
                  </span>
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
            {/* Display category banner */}
            <CategoryBanner />

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
                className="p-6 bg-red-100 text-red-700 rounded-lg text-center my-10"
              >
                {error}
              </motion.div>
            )}

            {/* Filter Panel */}
            <FilterPanel />

            {/* Books grid */}
            {!loading && !error && (
              <>
                {/* Filter indicators */}
                {(activeFilters.price.length > 0 ||
                  activeFilters.rating.length > 0 ||
                  activeFilters.featured) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex flex-wrap gap-2"
                  >
                    <span
                      className={`px-3 py-1 rounded-full ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      Filters:
                    </span>

                    {activeFilters.price.map((price) => (
                      <motion.span
                        key={price}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1"
                      >
                        {price === "under10" && "Under $10"}
                        {price === "10to20" && "$10 - $20"}
                        {price === "20to30" && "$20 - $30"}
                        {price === "30plus" && "$30+"}
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setActiveFilters((prev) => ({
                              ...prev,
                              price: prev.price.filter((id) => id !== price),
                            }));
                          }}
                        />
                      </motion.span>
                    ))}

                    {activeFilters.rating.map((rating) => (
                      <motion.span
                        key={rating}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center gap-1"
                      >
                        {rating === "4plus" && "4★ & above"}
                        {rating === "3to4" && "3★ - 4★"}
                        {rating === "under3" && "Under 3★"}
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setActiveFilters((prev) => ({
                              ...prev,
                              rating: prev.rating.filter((id) => id !== rating),
                            }));
                          }}
                        />
                      </motion.span>
                    ))}

                    {activeFilters.featured && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1"
                      >
                        Featured
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setActiveFilters((prev) => ({
                              ...prev,
                              featured: false,
                            }));
                          }}
                        />
                      </motion.span>
                    )}

                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        setActiveFilters({
                          price: [],
                          rating: [],
                          featured: false,
                        });
                      }}
                    >
                      Clear All
                    </motion.span>
                  </motion.div>
                )}

                {/* Results count and sort indicator */}
                <div className="flex justify-between items-center mb-6">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {getFilteredBooks().length} books found
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Sorted by:
                    </span>
                    <span
                      className="cursor-pointer font-medium"
                      onClick={() => setShowFilters(true)}
                    >
                      {sortBy === "popularity" && "Most Popular"}
                      {sortBy === "rating" && "Highest Rated"}
                      {sortBy === "newest" && "Newest First"}
                      {sortBy === "priceAsc" && "Price: Low to High"}
                      {sortBy === "priceDesc" && "Price: High to Low"}
                    </span>
                  </motion.div>
                </div>

                {/* Empty state */}
                {getFilteredBooks().length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold mb-2">No books found</h3>
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Try adjusting your filters or search term
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchTerm("");
                        setActiveFilters({
                          price: [],
                          rating: [],
                          featured: false,
                        });
                        setSortBy("popularity");
                      }}
                      className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full"
                    >
                      Reset All Filters
                    </motion.button>
                  </motion.div>
                )}

                {/* Books grid */}
                {getFilteredBooks().length > 0 && (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  >
                    {getFilteredBooks().map((book, index) => (
                      <BookCard key={book.id} book={book} index={index} />
                    ))}
                  </motion.div>
                )}

                {/* Load more button */}
                {!loading && hasMore && getFilteredBooks().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-10"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMoreBooks}
                      className={`px-8 py-3 rounded-full font-medium
                        ${
                          isDarkMode
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "bg-white text-gray-900 hover:bg-gray-100"
                        } 
                        shadow-lg transition-all duration-300`}
                    >
                      Load More Books
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesBook;
