import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";

const Discover = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample book data
  const popularBooks = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 4.99,
      image: "/path/to/mockingbird.jpg",
      pages: 336,
      rating: 4.5,
      reviews: 100,
      description: "Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred."
    },
  ];

  const saleBooks = [
    {
      id: 4,
      title: "The Perfect Couple",
      author: "Elin Hilderbrand",
      originalPrice: 5.99,
      salePrice: 4.99,
      image: "/path/to/perfect.jpg"
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
        style={{
          '--scrollbar-track': isDarkMode ? '#1F2937' : '#F3F4F6',
          '--scrollbar-thumb': isDarkMode ? '#4B5563' : '#E5E7EB',
        }}
      >
        <style jsx global>{`
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
          }
          ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb);
            opacity: 0.8;
          }
        `}</style>

        <header className={`w-full border-b ${
          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search your favourite book"
                  className={`w-full p-3 rounded-xl transition-colors ${
                    isDarkMode 
                      ? "bg-gray-800 text-white placeholder-gray-400" 
                      : "bg-white text-gray-900 placeholder-gray-500"
                  } border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex items-center gap-6">
                <span className="font-medium">Balance: $0.00</span>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Popular Books</h2>
                <button className="text-blue-500 hover:text-blue-600 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {popularBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`rounded-lg overflow-hidden ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow hover:shadow-md cursor-pointer w-48`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="aspect-[3/4] bg-gray-700"></div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1 truncate">{book.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{book.author}</p>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">${book.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">On Sale</h2>
                <button className="text-blue-500 hover:text-blue-600 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {saleBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`rounded-lg overflow-hidden ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow hover:shadow-md cursor-pointer w-48`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="aspect-[3/4] bg-gray-700"></div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1 truncate">{book.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-400 text-xs">
                          ${book.originalPrice}
                        </span>
                        <span className="text-red-500 text-sm font-medium">
                          ${book.salePrice}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {selectedBook && (
        <aside className={`w-96 h-screen border-l overflow-y-auto ${
          isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-sm`}>
          <div className="p-6">
            <div className="aspect-[3/4] bg-gray-700 rounded-xl mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{selectedBook.author}</p>
            
            {selectedBook.pages && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50">
                  <p className="font-bold text-lg">{selectedBook.pages}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pages</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50">
                  <p className="font-bold text-lg">{selectedBook.rating}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50">
                  <p className="font-bold text-lg">{selectedBook.reviews}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
                </div>
              </div>
            )}
            
            {selectedBook.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {selectedBook.description}
              </p>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
            >
              Read Now
            </motion.button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Discover;