import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Search } from "lucide-react";

const MyLibrary = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const myBooks = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      shelf: "fiction",
      lastRead: "2024-02-15",
      progress: 75,
      coverColor: "#7C3AED",
      position: "straight"
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      shelf: "fiction",
      lastRead: "2024-01-20",
      progress: 100,
      coverColor: "#2563EB",
      position: "lean-right"
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      shelf: "technical",
      lastRead: "2024-02-10",
      progress: 45,
      coverColor: "#DC2626",
      position: "straight"
    }
  ];

  const shelves = [
    { id: "all", name: "All Books" },
    { id: "fiction", name: "Fiction" },
    { id: "technical", name: "Technical" },
    { id: "recent", name: "Recently Read" }
  ];

  const filteredBooks = myBooks.filter(book => {
    const matchesShelf = selectedShelf === "all" || book.shelf === selectedShelf;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShelf && matchesSearch;
  });

  const Bookshelf = ({ books }) => (
    <div className="relative mb-12">
      {/* Bookshelf container */}
      <div className={`relative rounded-lg ${
        isDarkMode ? "bg-gray-800/50" : "bg-white"
      } shadow-lg`}>
        {/* Books container */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-8">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Book */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="w-32 aspect-[2/3] rounded-lg overflow-hidden cursor-pointer shadow-md transition-shadow duration-300 group-hover:shadow-xl"
                style={{ backgroundColor: book.coverColor }}
                onClick={() => setSelectedBook(book)}
              >
                <div className="p-3 h-full flex flex-col text-white">
                  <h3 className="text-sm font-bold mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-xs opacity-80 mb-2">{book.author}</p>
                  <div className="mt-auto">
                    <div className="w-full bg-white/20 h-1 rounded-full">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] mt-1 opacity-80">
                      {book.progress}% completed
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Book bottom shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-black/10 rounded-full blur-sm" />
            </motion.div>
          ))}
        </div>

        {/* Shelf wood texture */}
        <div className={`absolute bottom-0 inset-x-0 h-4 ${
          isDarkMode ? "bg-gray-700" : "bg-amber-100"
        } rounded-b-lg`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
        </div>
      </div>

      {/* Shelf supports */}
      <div className="absolute -bottom-6 inset-x-8 flex justify-between">
        <div className={`w-1 h-6 ${
          isDarkMode ? "bg-gray-700" : "bg-amber-200"
        } rounded-b-lg shadow-md transform -skew-x-12`} />
        <div className={`w-1 h-6 ${
          isDarkMode ? "bg-gray-700" : "bg-amber-200"
        } rounded-b-lg shadow-md transform skew-x-12`} />
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
        <header className={`w-full border-b ${
          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">My Library</h1>
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your books"
                  className={`w-full p-3 rounded-xl transition-colors ${
                    isDarkMode 
                      ? "bg-gray-800 text-white placeholder-gray-400" 
                      : "bg-white text-gray-900 placeholder-gray-500"
                  } border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {shelves.map((shelf) => (
                <button
                  key={shelf.id}
                  onClick={() => setSelectedShelf(shelf.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedShelf === shelf.id
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-white text-gray-700"
                  }`}
                >
                  {shelf.name}
                </button>
              ))}
            </div>

            <Bookshelf books={filteredBooks} />
          </div>
        </div>
      </main>

      {selectedBook && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className={`w-96 h-screen border-l overflow-y-auto ${
            isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
          } backdrop-blur-sm`}
        >
          <div className="p-6">
            <div 
              className="aspect-[2/3] rounded-xl mb-6"
              style={{ backgroundColor: selectedBook.coverColor }}
            >
              <div className="p-4 h-full flex flex-col text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="opacity-80">{selectedBook.author}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
              }`}>
                <h3 className="font-medium mb-2">Reading Progress</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${selectedBook.progress}%` }}
                  />
                </div>
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                  Last read on {new Date(selectedBook.lastRead).toLocaleDateString()}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
              >
                Continue Reading
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </div>
  );
};

export default MyLibrary;