import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../Hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
  Search,
} from "lucide-react";
import bookService from "../services/bookService";
import usersService from "../services/usersService"; 
import { useEffect as useEffectImport } from "react";

const Category = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [userBalance, setUserBalance] = useState<number>(0);  
  const [activeFilters, setActiveFilters] = useState({
    price: [],
    rating: [],
    featured: false,
  });
  const [exploreBooks, setExploreBooks] = useState([]);

  // State để lưu trữ danh sách categories từ API
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  const handleViewAll = () => {
    navigate(`/home/exploreAllBook`);
  };

  const handleClickNow = async (category) => {      
    navigate(`/home/categoriesBook`, { state: { categoryData: category } });
};

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

  // Hàm để gán icon và màu dựa trên tên category
  const assignIconAndColor = (categoryName) => {
    const name = categoryName.toLowerCase();

    // Map các icon dựa trên tên danh mục
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

    // Tìm kiếm khớp một phần
    for (const key in iconMap) {
      if (name.includes(key) || key.includes(name)) {
        return iconMap[key];
      }
    }

    // Default nếu không tìm thấy khớp
    return { icon: "📗", color: "bg-lime-500" };
  };

  // Fetch categories từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await bookService.getAllCategories();

        // Chuyển đổi dữ liệu API và thêm icon + màu sắc
        const processedCategories = response.data.map((category) => {
          const { icon, color } = assignIconAndColor(category.categoryName);
          return {
            id: category.categoryId,
            name: category.categoryName,
            // Giả định là không có count từ API, nên tạm thời dùng giá trị ngẫu nhiên
            count: Math.floor(Math.random() * 100) + 20,
            icon,
            color,
            description: category.description,
          };
        });

        setCategories(processedCategories);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();

    // Scroll handler for parallax effects
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chia categories thành các nhóm để hiển thị theo hàng (mỗi hàng tối đa 4 category)
  const groupCategories = (categories, groupSize = 4) => {
    const result = [];
    for (let i = 0; i < categories.length; i += groupSize) {
      result.push(categories.slice(i, i + groupSize));
    }
    return result;
  };

  const categoryGroups = groupCategories(categories);

  // Enhanced CategoryRow with motion
  const CategoryRow = ({ categories }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex gap-4 overflow-x-auto py-2 mb-4"
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
//          onClick={() => navigate(`/category/${category.id}`)}
          onClick={() => handleClickNow(category)}
          className={`category-card p-4 rounded-xl cursor-pointer flex-shrink-0 w-[280px] 
            ${
              isDarkMode
                ? "bg-gray-800/90 backdrop-blur-lg"
                : "bg-white/90 backdrop-blur-lg"
            } 
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
            <motion.div whileHover={{ x: 5 }} className="text-gray-400">
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
                className={`w-4 h-4 ${
                  i < Math.floor(book.rating)
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

  useEffect(() => {
    const fetchExploreBooks = async () => {
      try {
        // Có thể sử dụng getTopRatedBooks hoặc getAllBooks tùy theo nhu cầu
        const response = await bookService.getTopRatedBooks(12);
        setExploreBooks(response.data);
      } catch (err) {
        console.error("Failed to fetch explore books:", err);
      }
    };

    fetchExploreBooks();
  }, []);


  const MasonryBookCard = ({ book, index, colorIndex }) => {
    const { isDarkMode } = useTheme();

    // Mảng gradient màu đa dạng cho card
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

    // Lấy màu gradient tương ứng
    const gradient = cardGradients[colorIndex % cardGradients.length];

    // Tỷ lệ khung hình ngẫu nhiên (đa dạng layout)
    const isLarge = index % 5 === 0 || index % 7 === 0;
    const aspectRatio = isLarge ? "aspect-[4/5]" : "aspect-[3/4]";

    // Biểu tượng sách ngẫu nhiên khi không có hình ảnh
    const bookIcons = ["📚", "📖", "📘", "📕", "📗", "📙"];
    const randomIcon = bookIcons[index % bookIcons.length];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -5 }}
        className={`rounded-xl overflow-hidden shadow-lg w-full
        ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-lg`}
      >
        <div className={`relative overflow-hidden ${aspectRatio} flex items-center justify-center p-6 md:p-8 rounded-2xl`}>
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-[80%] h-[80%] object-cover transition-all duration-500 hover:scale-105 rounded-xl shadow-lg"
            />
          ) : (
            <div
        className={`w-[80%] h-[80%] bg-gradient-to-br ${gradient} flex items-center justify-center rounded-xl shadow-lg`}
      >
              <span className="text-5xl">{randomIcon}</span>
            </div>
          )}

          {/* Overlay hiệu ứng khi hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
          opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          >
            <h3 className="text-white font-bold text-lg line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-300 text-sm mt-1">by {book.author}</p>

            <div className="mt-3 flex items-center justify-between">
              {book.averageRating && (
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-white">
                    {book.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
              <span className="text-white font-bold">
                ${book.discountedPrice || book.originalPrice || 9.99}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {book.averageRating && (
                <>
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className={isDarkMode ? "text-white" : "text-gray-800"}>
                    {book.averageRating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${book.discountedPrice || book.originalPrice || 9.99}
              </span>
              {book.discountedPrice && (
                <span className="text-gray-400 line-through text-sm">
                  ${book.originalPrice}
                </span>
              )}
            </div>
          </div>

          <h3
            className={`font-bold text-lg mb-2 line-clamp-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {book.title}
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-1">
            by {book.author || "Unknown Author"}
          </p>
        </div>
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
              <SearchInput />
              <div className="flex items-center gap-6">
                <motion.span
                  className="font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-medium">Balance: ${userBalance.toFixed(2)}</span>
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

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center py-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                  />
                </div>
              )}

              {/* Error state */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-100 text-red-700 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Categories grid */}
              {!loading && !error && (
                <div className="space-y-4">
                  {categoryGroups.map((group, index) => (
                    <CategoryRow key={index} categories={group} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Books grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>

            {/* Explore Books section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 
      bg-clip-text text-transparent"
                >
                  Explore Books
                </motion.h2>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewAll()}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
            text-white font-medium text-sm"
                >
                  View All
                </motion.button>
              </div>

              {/* Masonry grid with 4 columns */}
              <div
                className="masonry-grid"
                style={{
                  columnCount: 4,
                  columnGap: "20px",
                  position: "relative",
                }}
              >
                {exploreBooks.map((book, index) => (
                  <div
                    key={book.bookId || index}
                    className="masonry-grid-item"
                    style={{
                      breakInside: "avoid",
                      marginBottom: "20px",
                    }}
                  >
                    <MasonryBookCard book={book} index={index} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;
