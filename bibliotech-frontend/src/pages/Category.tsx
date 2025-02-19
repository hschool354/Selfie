import React, { useRef, useState } from "react";
import { useTheme } from "../Hooks/useTheme";
import { ChevronRight, ChevronLeft, SlidersHorizontal, X } from "lucide-react";

// Define interfaces for type safety
interface Category {
    id: number;
    name: string;
    icon: string;
    count: number;
    color: string;
  }
  
  interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
    featured: boolean;
    rating: number;
    reviews: number;
  }
  
  interface FilterOption {
    label: string;
    value: string;
  }
  
  interface FilterOptions {
    price: FilterOption[];
    rating: FilterOption[];
  }
  
  interface ActiveFilters {
    price: string[];
    rating: string[];
    featured: boolean;
  }


const Categories = () => {
  const { isDarkMode } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    price: [],
    rating: [],
    featured: false
  });

  const categories = [
    // Categories array remains the same
    { id: 1, name: "Fiction", icon: "📚", count: 2456, color: "bg-blue-500" },
    { id: 2, name: "Romance", icon: "❤️", count: 1832, color: "bg-pink-500" },
    { id: 3, name: "Science", icon: "🌍", count: 1654, color: "bg-green-500" },
    { id: 4, name: "Technology", icon: "💻", count: 1243, color: "bg-purple-500" },
    { id: 5, name: "Arts", icon: "📷", count: 986, color: "bg-orange-500" },
    { id: 6, name: "Music", icon: "🎵", count: 765, color: "bg-yellow-500" },
    { id: 7, name: "Lifestyle", icon: "☕", count: 1123, color: "bg-red-500" },
    { id: 8, name: "Bestsellers", icon: "⭐", count: 2789, color: "bg-indigo-500" },
    { id: 9, name: "Psychology", icon: "🧠", count: 856, color: "bg-teal-500" },
    { id: 10, name: "Cooking", icon: "🍳", count: 743, color: "bg-amber-500" },
    { id: 11, name: "Travel", icon: "✈️", count: 654, color: "bg-cyan-500" },
    { id: 12, name: "History", icon: "🏛️", count: 1234, color: "bg-stone-500" },
    { id: 13, name: "Business", icon: "💼", count: 1890, color: "bg-violet-500" },
    { id: 14, name: "Self-Help", icon: "🌟", count: 2123, color: "bg-sky-500" },
    { id: 15, name: "Education", icon: "📖", count: 1567, color: "bg-emerald-500" },
    { id: 16, name: "Health", icon: "🏥", count: 987, color: "bg-rose-500" },
  ];

  // Enhanced books array with varying heights and featured status
  const books = [
    {
      id: 1,
      title: "The Third Gilmore Girl",
      author: "Kelly Bishop",
      price: 14.99,
      featured: true,
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      title: "Halloween Hidden Pictures",
      author: "Highlights",
      price: 2.0,
      featured: false,
      rating: 4.2,
      reviews: 84
    },
    {
      id: 3,
      title: "The Book of Bill",
      author: "Anonymous",
      price: 18.88,
      featured: true,
      rating: 4.8,
      reviews: 256
    },
    {
      id: 4,
      title: "Sandwich: A Novel",
      author: "Catherine Newman",
      price: 11.99,
      featured: false,
      rating: 4.1,
      reviews: 92
    },
    {
      id: 5,
      title: "The Hazelbourne Ladies Motorcycle Club",
      author: "Helen Simonson",
      price: 1.99,
      featured: false,
      rating: 4.3,
      reviews: 167
    }
  ];

  // Filter options
  const filterOptions = {
    price: [
      { label: "Under $5", value: "under-5" },
      { label: "$5 - $10", value: "5-10" },
      { label: "$10 - $15", value: "10-15" },
      { label: "Over $15", value: "over-15" }
    ],
    rating: [
      { label: "4.5 & up", value: "4.5-up" },
      { label: "4.0 & up", value: "4.0-up" },
      { label: "3.5 & up", value: "3.5-up" }
    ]
  };

  const toggleFilter = (category: keyof Omit<ActiveFilters, 'featured'>, value: string) => {
    setActiveFilters(prev => {
      if (category === 'featured') {
        return { ...prev, featured: !prev.featured };
      }
      
      const updatedFilters = { ...prev };
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(v => v !== value);
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      return updatedFilters;
    });
  };

  const toggleFeatured = () => {
    setActiveFilters(prev => ({
      ...prev,
      featured: !prev.featured
    }));
  };

  // Filter panel component
  const FilterPanel = () => (
    <div
      className={`${
        showFilters ? 'translate-x-0' : '-translate-x-full'
      } fixed left-0 top-0 h-full w-80 bg-gray-50 dark:bg-gray-700 shadow-lg 
        ring-1 ring-gray-200 dark:ring-gray-500 transform transition-transform 
        duration-300 ease-in-out z-50 overflow-y-auto`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Filters
          </h3>
          <button
            onClick={() => setShowFilters(false)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
  
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Price Range
          </h4>
          <div className="space-y-2">
            {filterOptions.price.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.price.includes(option.value)}
                  onChange={() => toggleFilter('price', option.value)}
                  className="w-4 h-4 text-blue-500 rounded border-gray-300 
                      focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 
                      transition-all"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Rating */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Rating
          </h4>
          <div className="space-y-2">
            {filterOptions.rating.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.rating.includes(option.value)}
                  onChange={() => toggleFilter('rating', option.value)}
                  className="w-4 h-4 text-blue-500 rounded border-gray-300 
                    focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 
                    transition-all"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Filter overlay
  const FilterOverlay = () => (
    <div 
      className={`${showFilters ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
        fixed inset-0 bg-black transition-opacity duration-300 z-40`}
      onClick={() => setShowFilters(false)}
    />
  );

  // Filter button component
  const FilterButton = () => (
    <button
      onClick={() => setShowFilters(true)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg 
        ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} 
        shadow-sm transition-colors duration-200`}
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span className="font-medium">Filters</span>
      {(activeFilters.price.length > 0 || activeFilters.rating.length > 0 || activeFilters.featured) && (
        <span className="w-5 h-5 flex items-center justify-center bg-blue-500 
          text-white text-xs font-medium rounded-full">
          {activeFilters.price.length + activeFilters.rating.length + (activeFilters.featured ? 1 : 0)}
        </span>
      )}
    </button>
  );

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = container.offsetWidth / 2;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const CategoryRow = ({ categories }) => (
    <div className="flex gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`category-card p-4 rounded-xl cursor-pointer flex-shrink-0 w-[280px] ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl ${category.color} transform transition-transform duration-300 hover:scale-105`}
            >
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {category.count.toLocaleString()} books
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      ))}
    </div>
  );

  const BookCard = ({ book }) => (
    <div
      className={`book-card group relative w-full rounded-xl overflow-hidden ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Black placeholder for book cover */}
        <div className={`w-full h-full bg-black transition-transform duration-500 group-hover:scale-105`} />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {book.featured && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium z-10">
            Featured
          </div>
        )}
        
        {/* Quick view button */}
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          Quick View
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(book.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({book.reviews})
          </span>
        </div>

        <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
          {book.title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
          by {book.author}
        </p>
        
        <div className="flex items-center justify-between">
          <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
            ${book.price.toFixed(2)}
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <FilterPanel />
        {/* Header section remains the same */}
        <header
          className={`w-full border-b ${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search categories"
                  className={`w-full p-3 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-500"
                  } border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300`}
                />
              </div>
              <div className="flex items-center gap-6">
                <span className="font-medium">Balance: $0.00</span>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-transform duration-300 hover:scale-105"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {/* Categories section remains the same */}
            <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>

            <div className="relative mb-12">
              <button
                onClick={() => scroll("left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                ref={scrollContainerRef}
                className="overflow-x-auto space-y-4 pb-4 scroll-smooth hide-scrollbar"
              >
                <CategoryRow categories={categories.slice(0, 8)} />
                <CategoryRow categories={categories.slice(8, 16)} />
              </div>

              <button
                onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Books section with filter */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Trending Books</h2>
              <FilterButton />
            </div>

            {/* Enhanced Masonry Grid Book Showcase */}
            <h2 className="text-2xl font-bold mb-8">Trending Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <div
                  key={book.id}
                  className={`${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  } ${
                    index === 3 ? "md:col-span-2" : ""
                  }`}
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.6s ease-out ${index * 0.15}s forwards`,
                  }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;