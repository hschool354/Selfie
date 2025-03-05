import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Book,
  Search,
  Library,
  Star,
  MessageCircle,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  X,
} from "lucide-react";
import { MainPage } from "../components/components/MainPage";

// Types
interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const navVariants = {
  top: { height: "5rem", backgroundColor: "rgba(255, 255, 255, 0.9)" },
  scrolled: { height: "4rem", backgroundColor: "rgba(255, 255, 255, 0.95)" },
};

// Featured books data
const featuredBooks = [
  {
    id: 1,
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    image: "/api/placeholder/200/300",
  },
  {
    id: 2,
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    image: "/api/placeholder/200/300",
  },
  {
    id: 3,
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    author: "Rosie Nguyễn",
    image: "/api/placeholder/200/300",
  },
  {
    id: 4,
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    image: "/api/placeholder/200/300",
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/api/placeholder/50/50",
    comment:
      "Thư viện online tuyệt vời, giúp tôi tiết kiệm thời gian và chi phí!",
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "/api/placeholder/50/50",
    comment: "Giao diện đẹp, dễ sử dụng và nhiều sách hay!",
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "/api/placeholder/50/50",
    comment: "Tính năng đọc sách trực tuyến rất tiện lợi!",
  },
];

const Welcome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((y) => {
      setIsScrolled(y > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Parallax effect for hero section
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navbar */}
      <motion.nav
        className="fixed top-0 w-full h-16 z-50 backdrop-blur-sm flex items-center"
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={navVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <img
                    src="/backgrounds/background_logo1.png"
                    alt="Small Logo"
                    className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Selfie
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {["Trang chủ", "Thư viện", "Pricing", "Help Center"].map(
                (item) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </Link>
                    <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                  </motion.div>
                )
              )}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/splash"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Đăng nhập
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/splash"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t mt-2"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {["Trang chủ", "Thư viện", "Pricing", "Help Center"].map(
                  (item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase()}`}
                      className="block text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </Link>
                  )
                )}
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-16"
      >
        {/* Lớp nền lưới */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Container chính */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto"
          >
            {/* Phần nội dung văn bản */}
            <motion.div className="text-center lg:text-left space-y-8 order-2 lg:order-1">
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Khám phá kho sách trực tuyến khổng lồ
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
              >
                Truy cập hàng nghìn cuốn sách chất lượng mọi lúc, mọi nơi. Đọc,
                học hỏi và phát triển cùng cộng đồng độc giả.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              >
                <Link to="/splash">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 15px rgba(37, 99, 235, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    Bắt đầu ngay
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Tìm kiếm sách
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Phần Canvas 3D */}
            <motion.div
              variants={fadeInUp}
              className="relative w-full h-[600px] lg:h-[700px] order-1 lg:order-2"
            >
              <MainPage />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Search className="w-12 h-12 text-blue-600" />,
                title: "Tìm kiếm thông minh",
                description:
                  "Tìm sách nhanh chóng với công cụ tìm kiếm thông minh.",
              },
              {
                icon: <Book className="w-12 h-12 text-blue-600" />,
                title: "Đọc sách trực tuyến",
                description:
                  "Trải nghiệm đọc sách mượt mà với giao diện thân thiện.",
              },
              {
                icon: <Library className="w-12 h-12 text-blue-600" />,
                title: "Quản lý thư viện",
                description: "Sắp xếp và quản lý sách yêu thích của bạn.",
              },
              {
                icon: <MessageCircle className="w-12 h-12 text-blue-600" />,
                title: "Đánh giá & bình luận",
                description: "Chia sẻ cảm nhận với cộng đồng độc giả.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Featured Books Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Sách nổi bật
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                variants={fadeInUp}
                whileHover={{
                  y: -20,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-4">{book.author}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Đọc ngay
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Đánh giá từ độc giả
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-4 border-blue-100"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 360, 180],
            opacity: [1, 0, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -left-20 -bottom-20 w-64 h-64 bg-white opacity-10 rounded-full"
        />
        <div className="container mx-auto text-center relative z-10">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Sẵn sàng bắt đầu hành trình đọc sách?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn độc giả và khám phá thế giới tri thức
              ngay hôm nay.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition-colors"
            >
              Đăng ký ngay
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="grid md:grid-cols-4 gap-12">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative group">
                  {/* White background circle behind the logo */}
                  <div className="absolute inset-0 bg-white rounded-full" />
                  {/* Hover effect circle */}
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  {/* Logo with padding to avoid edge touching circle */}
                  <div className="relative p-1">
                    <img
                      src="/backgrounds/background_logo1.png"
                      alt="Small Logo"
                      className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">Selfie</span>
              </div>
              <p className="mb-6">Thư viện trực tuyến hàng đầu Việt Nam</p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: "Liên kết",
                links: ["Về chúng tôi", "Blog", "Điều khoản"],
              },
              {
                title: "Hỗ trợ",
                links: ["FAQ", "Liên hệ", "Hướng dẫn"],
              },
              {
                title: "Liên hệ",
                content: [
                  "Email: contact@mylibrary.com",
                  "Điện thoại: (84) 123-456-789",
                  "Địa chỉ: Hà Nội, Việt Nam",
                ],
              },
            ].map((section, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <h4 className="text-white font-semibold text-lg mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links
                    ? section.links.map((link, i) => (
                        <li key={i}>
                          <motion.a
                            href="#"
                            whileHover={{ x: 5 }}
                            className="hover:text-white transition-colors"
                          >
                            {link}
                          </motion.a>
                        </li>
                      ))
                    : section.content?.map((item, i) => (
                        <li key={i} className="text-gray-400">
                          {item}
                        </li>
                      ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 pt-8 border-t border-gray-800 text-center"
          >
            <p>
              &copy; {new Date().getFullYear()} MyLibrary. Tất cả các quyền được
              bảo lưu.
            </p>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Welcome;
