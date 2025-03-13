import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Search, Clock, BookOpen } from "lucide-react";
import { usersService, UserLibraryDto, ReadingHistoryDto } from "../services/usersService";
import bookService from "../services/bookService"; // Import bookService

const MyLibrary = () => {
  const { isDarkMode } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLibrary, setUserLibrary] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [bookDetails, setBookDetails] = useState({}); // Store book details by ID
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch both user library and reading history in parallel
        const [libraryData, historyData] = await Promise.all([
          usersService.getUserLibrary(),
          usersService.getReadingHistory()
        ]);
        
        setUserLibrary(libraryData);
        setReadingHistory(historyData);
        
        // Get unique book IDs from both library and history
        const bookIds = new Set([
          ...libraryData.map(item => item.bookId),
          ...historyData.map(item => item.bookId)
        ]);
        
        // Fetch book details for all books
        await fetchBookDetails(Array.from(bookIds));
      } catch (err) {
        setError("Failed to load your library data. Please try again later.");
        console.error("Error fetching library data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch book details for all books in library and history
  const fetchBookDetails = async (bookIds) => {
    try {
      const bookDetailsMap = {};
      
      // Fetch details for each book in parallel
      const bookPromises = bookIds.map(bookId => 
        bookService.getBookById(bookId)
          .then(response => {
            bookDetailsMap[bookId] = response.data;
          })
          .catch(err => {
            console.error(`Error fetching details for book ${bookId}:`, err);
            // Provide fallback data
            bookDetailsMap[bookId] = {
              title: `Book #${bookId}`,
              author: "Unknown Author",
              coverImageUrl: null
            };
          })
      );
      
      await Promise.all(bookPromises);
      setBookDetails(bookDetailsMap);
    } catch (err) {
      console.error("Error fetching book details:", err);
    }
  };

  // Generate cover colors for books without cover images
  const getBookCoverColor = (bookId) => {
    const colors = ["#7C3AED", "#2563EB", "#DC2626", "#0891B2", "#059669", "#D97706", "#7C2D12", "#4338CA"];
    return colors[bookId % colors.length];
  };

  const shelves = [
    { id: "all", name: "All Books" },
    { id: "reading", name: "Currently Reading" },
    { id: "completed", name: "Completed" },
    { id: "saved", name: "Saved for Later" },
    { id: "history", name: "Reading History" }
  ];

  const filteredBooks = userLibrary.filter(book => {
    // Only show books that match the current shelf filter
    if (selectedShelf === "all") return true;
    if (selectedShelf === "reading") return book.status === "READING";
    if (selectedShelf === "completed") return book.status === "COMPLETED";
    if (selectedShelf === "saved") return book.status === "SAVED";
    if (selectedShelf === "history") return false; // Don't show books in the history section
    
    return true;
  }).filter(book => {
    // Apply search query if any
    if (!searchQuery) return true;
    
    const bookInfo = bookDetails[book.bookId];
    if (!bookInfo) return false;
    
    // Search by title, author, or book ID
    return (
      bookInfo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookInfo.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookId.toString().includes(searchQuery)
    );
  });

  // Get unique book IDs from reading history that aren't in the library
  const historyBookIds = selectedShelf === "history" 
    ? [...new Set(readingHistory.map(item => item.bookId))]
        .filter(bookId => !userLibrary.some(book => book.bookId === bookId))
    : [];

  const Bookshelf = ({ books, title }) => (
    <div className="relative mb-12">
      <h2 className={`text-xl font-bold mb-4 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}>{title}</h2>
      
      {/* Bookshelf container */}
      <div className={`relative rounded-lg ${
        isDarkMode ? "bg-gray-800/50" : "bg-white"
      } shadow-lg`}>
        {/* Books container */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-8">
          {books.length > 0 ? books.map((book, index) => {
            const bookInfo = bookDetails[book.bookId] || {};
            return (
              <motion.div
                key={book.bookId}
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
                  onClick={() => setSelectedBook({...book, bookInfo})}
                >
                  {bookInfo.coverImageUrl ? (
                    <div className="w-full h-full bg-gray-100">
                      <img 
                        src={bookInfo.coverImageUrl} 
                        alt={bookInfo.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div 
                      className="p-3 h-full flex flex-col text-white"
                      style={{ backgroundColor: getBookCoverColor(book.bookId) }}
                    >
                      <h3 className="text-sm font-bold mb-1 line-clamp-2">{bookInfo.title || `Book #${book.bookId}`}</h3>
                      <p className="text-xs opacity-80 mb-2">{bookInfo.author || "Unknown Author"}</p>
                      <div className="mt-auto">
                        <div className="w-full bg-white/20 h-1 rounded-full">
                          <div 
                            className="h-full bg-white rounded-full"
                            style={{ width: `${book.progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1 opacity-80">
                          {book.progressPercentage}% completed
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Book title on hover */}
                <div className="absolute -bottom-16 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className={`p-2 rounded text-center text-sm ${
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  } shadow-lg`}>
                    <p className="font-semibold line-clamp-1">{bookInfo.title || `Book #${book.bookId}`}</p>
                    <p className="text-xs opacity-80 line-clamp-1">{bookInfo.author || "Unknown Author"}</p>
                  </div>
                </div>

                {/* Book bottom shadow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-black/10 rounded-full blur-sm" />
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <p>Loading your books...</p>
              ) : (
                <p>No books found in this shelf</p>
              )}
            </div>
          )}
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

  const ReadingHistorySection = () => (
    <div className={`mt-8 p-6 rounded-lg ${
      isDarkMode ? "bg-gray-800/50" : "bg-white"
    } shadow-lg`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock size={20} />
        Reading History
      </h2>
      
      {readingHistory.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {readingHistory.map((session, index) => {
            const bookInfo = bookDetails[session.bookId] || {};
            return (
              <div key={session.historyId || index} className="py-4 flex items-start gap-4">
                {bookInfo.coverImageUrl ? (
                  <div className="w-12 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                    <img 
                      src={bookInfo.coverImageUrl} 
                      alt={bookInfo.title}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: getBookCoverColor(session.bookId) }}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-1">{bookInfo.title || `Book #${session.bookId}`}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By {bookInfo.author || "Unknown Author"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Read {session.pagesRead} pages on {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Duration: {calculateDuration(session.startTime, session.endTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          {isLoading ? (
            <p>Loading your reading history...</p>
          ) : (
            <p>No reading history found</p>
          )}
        </div>
      )}
    </div>
  );

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
  };

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
                  placeholder="Search by title, author or book ID"
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
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg dark:bg-red-900/30 dark:text-red-300">
                {error}
              </div>
            )}
            
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

            {selectedShelf === "history" ? (
              <ReadingHistorySection />
            ) : (
              <Bookshelf 
                books={filteredBooks} 
                title={shelves.find(s => s.id === selectedShelf)?.name || "Books"} 
              />
            )}
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
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Book Details</h2>
              <button 
                onClick={() => setSelectedBook(null)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-[2/3] rounded-xl mb-6 overflow-hidden">
              {selectedBook.bookInfo?.coverImageUrl ? (
                <img 
                  src={selectedBook.bookInfo.coverImageUrl} 
                  alt={selectedBook.bookInfo.title}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div 
                  className="p-4 h-full flex flex-col text-white"
                  style={{ backgroundColor: getBookCoverColor(selectedBook.bookId) }}
                >
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedBook.bookInfo?.title || `Book #${selectedBook.bookId}`}
                  </h2>
                  <p className="opacity-80">
                    By {selectedBook.bookInfo?.author || "Unknown Author"}
                  </p>
                  <p className="opacity-80 mt-4">
                    Added on {new Date(selectedBook.addedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold">
                {selectedBook.bookInfo?.title || `Book #${selectedBook.bookId}`}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By {selectedBook.bookInfo?.author || "Unknown Author"}
              </p>
              {selectedBook.bookInfo?.pageCount && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBook.bookInfo.pageCount} pages
                </p>
              )}
              {selectedBook.bookInfo?.description && (
                <div className="mt-2 text-sm">
                  <h4 className="font-medium mb-1">Description:</h4>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-4">
                    {selectedBook.bookInfo.description}
                  </p>
                </div>
              )}
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
            }`}>
              <h3 className="font-medium mb-2">Reading Progress</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${selectedBook.progressPercentage}%` }}
                />
              </div>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                Last read on {new Date(selectedBook.lastReadDate).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <p className="text-sm font-medium">Status: <span className="font-normal">{selectedBook.status}</span></p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
                  onClick={() => {
                    // Here we would update book status to READING
                    usersService.updateBookStatus(selectedBook.bookId, { 
                      status: "READING" 
                    }).then((updatedBook) => {
                      // Update the library with the updated book
                      setUserLibrary(library => 
                        library.map(book => 
                          book.bookId === updatedBook.bookId ? updatedBook : book
                        )
                      );
                      setSelectedBook({...updatedBook, bookInfo: selectedBook.bookInfo});
                    }).catch(err => {
                      console.error("Error updating book status:", err);
                    });
                  }}
                >
                  Continue Reading
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl ${
                    isDarkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                  onClick={() => {
                    // Record a reading session
                    const now = new Date();
                    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
                    
                    const readingSession = {
                      userId: 0, // This will be replaced by the backend
                      bookId: selectedBook.bookId,
                      startTime: fiveMinutesAgo.toISOString(),
                      endTime: now.toISOString(),
                      pagesRead: 5,
                      currentPage: Math.floor(selectedBook.progressPercentage / 100 * 
                        (selectedBook.bookInfo?.pageCount || 300)) // Use actual page count if available
                    };
                    
                    usersService.recordReadingSession(readingSession)
                      .then(newSession => {
                        setReadingHistory(prev => [newSession, ...prev]);
                      })
                      .catch(err => {
                        console.error("Error recording reading session:", err);
                      });
                  }}
                >
                  Record Session
                </motion.button>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    isDarkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => {
                    // Mark as completed
                    usersService.updateBookStatus(selectedBook.bookId, { 
                      status: "COMPLETED",
                      progress: 100 
                    }).then((updatedBook) => {
                      setUserLibrary(library => 
                        library.map(book => 
                          book.bookId === updatedBook.bookId ? updatedBook : book
                        )
                      );
                      setSelectedBook({...updatedBook, bookInfo: selectedBook.bookInfo});
                    }).catch(err => {
                      console.error("Error updating book status:", err);
                    });
                  }}
                >
                  Mark Complete
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    isDarkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => {
                    // Mark as abandoned
                    usersService.updateBookStatus(selectedBook.bookId, { 
                      status: "ABANDONED" 
                    }).then((updatedBook) => {
                      setUserLibrary(library => 
                        library.map(book => 
                          book.bookId === updatedBook.bookId ? updatedBook : book
                        )
                      );
                      setSelectedBook({...updatedBook, bookInfo: selectedBook.bookInfo});
                    }).catch(err => {
                      console.error("Error updating book status:", err);
                    });
                  }}
                >
                  Abandon
                </motion.button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </div>
  );
};

export default MyLibrary;