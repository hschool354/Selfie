import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { Book, Edit, Trash2, Save, X, AlertCircle, PlusCircle } from "lucide-react";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import bookService from "../services/bookService";
import categoryService from "../services/categoryService";

interface Book {
  bookId: number;
  title: string;
  author: string;
  isbn: string | null;
  originalPrice: number;
  discountedPrice: number | null;
  publicationYear: number | null;
  language: string;
  pageCount: number | null;
  stockQuantity: number;
  description: string | null;
  coverImageUrl: string | null;
  categoryIds: number[];
  averageRating?: number;
  ratingCount?: number;
  dealId?: number | null;
  readingDifficulty?: "EASY" | "MEDIUM" | "HARD";
  estimatedReadingTime?: number;
  contentRating?: "KIDS" | "TEEN" | "ADULT";
}

interface Category {
  categoryId: number;
  categoryName: string;
}

const ITEMS_PER_PAGE = 6;

const AdminBooks = () => {
  const { isDarkMode } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [editedBook, setEditedBook] = useState<Partial<Book> | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    categoryIds: [],
    title: "",
    author: "",
    isbn: "",
    originalPrice: 0,
    discountedPrice: null,
    publicationYear: new Date().getFullYear(),
    language: "English",
    pageCount: null,
    stockQuantity: 0,
    description: "",
    coverImageUrl: "",
    averageRating: 0,
    ratingCount: 0,
    dealId: null,
    readingDifficulty: "MEDIUM",
    estimatedReadingTime: 0,
    contentRating: "TEEN",
  });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const booksResponse = await bookService.getAllBooks();
      const booksData = booksResponse.data?.map(book => ({
        ...book,
        categoryIds: book.categoryIds || []
      })) || [];
      // Thêm dữ liệu giả lập để kiểm tra thanh cuộn
      const mockBooks = Array.from({ length: 20 }, (_, i) => ({
        bookId: i + 1,
        title: `Book ${i + 1}`,
        author: `Author ${i + 1}`,
        isbn: `97860412${i}007`,
        originalPrice: 200000 + i * 1000,
        discountedPrice: 100000 + i * 500,
        publicationYear: 2020 + (i % 5),
        language: "Vietnamese",
        pageCount: 300 + i * 10,
        stockQuantity: 25 + i,
        description: `Description for book ${i + 1}`,
        coverImageUrl: `https://example.com/covers/book${i + 1}.jpg`,
        categoryIds: [1, 2],
        averageRating: 4.5 + i * 0.1,
        ratingCount: 200 + i * 10,
        dealId: i % 3,
        readingDifficulty: "MEDIUM" as const,
        estimatedReadingTime: 350 + i * 5,
        contentRating: "TEEN" as const,
      }));
      setBooks([...booksData, ...mockBooks]);
      
      const categoriesResponse = await categoryService.getAllCategories();
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      setError(err.message || "Failed to load data.");
      setBooks([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBookId(book.bookId);
    setEditedBook({ ...book });
  };

  const handleSave = async (bookId: number) => {
    if (!editedBook) return;
    try {
      await bookService.updateBook(bookId, editedBook);
      setBooks(books.map(book => (book.bookId === bookId ? { ...book, ...editedBook } : book)));
      setEditingBookId(null);
      setEditedBook(null);
    } catch (err) {
      setError("Failed to save book.");
    }
  };

  const handleDelete = async (bookId: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId);
        setBooks(books.filter(book => book.bookId !== bookId));
      } catch (err) {
        setError("Failed to delete book.");
      }
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await bookService.addBook(newBook);
      setBooks([...books, response.data]);
      setShowAddModal(false);
      setNewBook({
        categoryIds: [],
        title: "",
        author: "",
        isbn: "",
        originalPrice: 0,
        discountedPrice: null,
        publicationYear: new Date().getFullYear(),
        language: "English",
        pageCount: null,
        stockQuantity: 0,
        description: "",
        coverImageUrl: "",
        averageRating: 0,
        ratingCount: 0,
        dealId: null,
        readingDifficulty: "MEDIUM",
        estimatedReadingTime: 0,
        contentRating: "TEEN",
      });
    } catch (err) {
      setError("Failed to add book.");
    }
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const paginatedBooks = books.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(books.length / ITEMS_PER_PAGE);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
      borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
      "&:hover": { borderColor: isDarkMode ? "#6b7280" : "#9ca3af" },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? "#374151" : "white",
      color: isDarkMode ? "white" : "black",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? isDarkMode ? "#5b21b6" : "#8b5cf6"
        : state.isFocused
        ? isDarkMode ? "#4b5563" : "#e5e7eb"
        : "transparent",
      color: isDarkMode ? "white" : "black",
      "&:active": { backgroundColor: isDarkMode ? "#7c3aed" : "#a78bfa" },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? "#5b21b6" : "#ddd6fe",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: isDarkMode ? "white" : "#6b7280",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: isDarkMode ? "white" : "#6b7280",
      "&:hover": { backgroundColor: "#7c3aed", color: "white" },
    }),
  };

  return (
    <div className="flex flex-col h-screen"> {/* Container chính với chiều cao cố định */}
      <header className={`sticky top-0 z-10 ${isDarkMode ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-200"} border-b backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="text-purple-500" size={28} />
            <h1 className="text-2xl font-bold">Book Management Dashboard</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md font-medium"
          >
            <PlusCircle size={20} />
            Add New Book
          </motion.button>
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg flex items-center gap-2 mb-6 ${isDarkMode ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-800"} shadow-md`}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
              />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <Book size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">No books available yet</p>
              <p className="text-sm text-gray-500">Click "Add New Book" to get started</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBooks.map((book) => (
                  <motion.div
                    key={book.bookId}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`rounded-xl p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div className="flex items-start gap-4">
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-24 h-32 object-cover rounded-md shadow-sm" />
                      ) : (
                        <div className="w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <Book size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        {editingBookId === book.bookId ? (
                          <>
                            <input
                              type="text"
                              value={editedBook?.title || ""}
                              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                              className={`w-full p-2 mb-2 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500`}
                            />
                            <input
                              type="text"
                              value={editedBook?.author || ""}
                              onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                              className={`w-full p-2 mb-2 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500`}
                            />
                          </>
                        ) : (
                          <>
                            <h3 className="font-semibold text-lg line-clamp-1" title={book.title}>{book.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1" title={book.author}>{book.author}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Price:</span>
                        {editingBookId === book.bookId ? (
                          <input
                            type="number"
                            value={editedBook?.originalPrice || ""}
                            onChange={(e) => setEditedBook({ ...editedBook, originalPrice: parseFloat(e.target.value) })}
                            className={`w-24 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500`}
                          />
                        ) : (
                          <span className="font-medium text-purple-600">${book.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Stock:</span>
                        {editingBookId === book.bookId ? (
                          <input
                            type="number"
                            value={editedBook?.stockQuantity || ""}
                            onChange={(e) => setEditedBook({ ...editedBook, stockQuantity: parseInt(e.target.value) })}
                            className={`w-24 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500`}
                          />
                        ) : (
                          <span className={book.stockQuantity < 5 ? "text-red-500" : "text-green-500"}>{book.stockQuantity}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Rating:</span>
                        {editingBookId === book.bookId ? (
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={editedBook?.averageRating || ""}
                            onChange={(e) => setEditedBook({ ...editedBook, averageRating: parseFloat(e.target.value) })}
                            className={`w-24 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500`}
                          />
                        ) : (
                          <span>{book.averageRating ? `${book.averageRating}/5 (${book.ratingCount} votes)` : "N/A"}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium">Categories:</span>
                        {editingBookId === book.bookId ? (
                          <Select
                            isMulti
                            options={categories.map(cat => ({ value: cat.categoryId, label: cat.categoryName }))}
                            value={editedBook?.categoryIds?.map(id => {
                              const cat = categories.find(c => c.categoryId === id);
                              return cat ? { value: cat.categoryId, label: cat.categoryName } : null;
                            })}
                            onChange={(selected) => setEditedBook({ ...editedBook, categoryIds: selected.map(s => s.value) })}
                            styles={selectStyles}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {(book.categoryIds || []).map(id => categories.find(cat => cat.categoryId === id)?.categoryName).filter(Boolean).join(", ") || "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Difficulty:</span>
                        {editingBookId === book.bookId ? (
                          <select
                            value={editedBook?.readingDifficulty || "MEDIUM"}
                            onChange={(e) => setEditedBook({ ...editedBook, readingDifficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" })}
                            className={`w-24 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                          </select>
                        ) : (
                          <span>{book.readingDifficulty || "N/A"}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 justify-end">
                      {editingBookId === book.bookId ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleSave(book.bookId)}
                            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md"
                          >
                            <Save size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setEditingBookId(null)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
                          >
                            <X size={18} />
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleEdit(book)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md"
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDelete(book.bookId)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-8 flex justify-center">
                  <ReactPaginate
                    previousLabel={<span className="px-3 py-1">Previous</span>}
                    nextLabel={<span className="px-3 py-1">Next</span>}
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName="flex items-center gap-2"
                    pageClassName={`px-3 py-1 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                    activeClassName={`bg-purple-600 text-white ${isDarkMode ? "hover:bg-purple-700" : "hover:bg-purple-500"}`}
                    previousClassName={`px-3 py-1 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                    nextClassName={`px-3 py-1 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-4xl rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl p-8 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Add New Book</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <form onSubmit={handleAddBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newBook.title || ""}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Author <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newBook.author || ""}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ISBN</label>
                      <input
                        type="text"
                        value={newBook.isbn || ""}
                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Original Price <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        value={newBook.originalPrice || ""}
                        onChange={(e) => setNewBook({ ...newBook, originalPrice: parseFloat(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discounted Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newBook.discountedPrice || ""}
                        onChange={(e) => setNewBook({ ...newBook, discountedPrice: parseFloat(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Publication Year</label>
                      <input
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={newBook.publicationYear || ""}
                        onChange={(e) => setNewBook({ ...newBook, publicationYear: parseInt(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Language</label>
                      <select
                        value={newBook.language || "English"}
                        onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="English">English</option>
                        <option value="Vietnamese">Vietnamese</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Page Count</label>
                      <input
                        type="number"
                        min="1"
                        value={newBook.pageCount || ""}
                        onChange={(e) => setNewBook({ ...newBook, pageCount: parseInt(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock Quantity <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="0"
                        value={newBook.stockQuantity || ""}
                        onChange={(e) => setNewBook({ ...newBook, stockQuantity: parseInt(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Average Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={newBook.averageRating || ""}
                        onChange={(e) => setNewBook({ ...newBook, averageRating: parseFloat(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating Count</label>
                      <input
                        type="number"
                        min="0"
                        value={newBook.ratingCount || ""}
                        onChange={(e) => setNewBook({ ...newBook, ratingCount: parseInt(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Deal ID</label>
                      <input
                        type="number"
                        value={newBook.dealId || ""}
                        onChange={(e) => setNewBook({ ...newBook, dealId: parseInt(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Reading Difficulty</label>
                      <select
                        value={newBook.readingDifficulty || "MEDIUM"}
                        onChange={(e) => setNewBook({ ...newBook, readingDifficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Reading Time (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        value={newBook.estimatedReadingTime || ""}
                        onChange={(e) => setNewBook({ ...newBook, estimatedReadingTime: parseInt(e.target.value) })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Content Rating</label>
                      <select
                        value={newBook.contentRating || "TEEN"}
                        onChange={(e) => setNewBook({ ...newBook, contentRating: e.target.value as "KIDS" | "TEEN" | "ADULT" })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="KIDS">Kids</option>
                        <option value="TEEN">Teen</option>
                        <option value="ADULT">Adult</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Categories <span className="text-red-500">*</span></label>
                    <Select
                      isMulti
                      options={categories.map(cat => ({ value: cat.categoryId, label: cat.categoryName }))}
                      value={newBook.categoryIds?.map(id => {
                        const cat = categories.find(c => c.categoryId === id);
                        return cat ? { value: cat.categoryId, label: cat.categoryName } : null;
                      })}
                      onChange={(selected) => setNewBook({ ...newBook, categoryIds: selected.map(s => s.value) })}
                      styles={selectStyles}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select categories..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={newBook.coverImageUrl || ""}
                      onChange={(e) => setNewBook({ ...newBook, coverImageUrl: e.target.value })}
                      className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newBook.description || ""}
                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                      className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]`}
                      placeholder="Enter book description..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={`px-6 py-2.5 rounded-lg font-medium ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md"
                  >
                    Add Book
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBooks;