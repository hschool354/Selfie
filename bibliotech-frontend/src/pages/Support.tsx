import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  Send,
  Moon,
  Sun,
  User,
  CreditCard,
  BookOpen,
  Settings
} from 'lucide-react';

interface FAQItem {
  category: string;
  icon: React.ReactNode;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Support = () => {
  // ... giữ nguyên các state và data như cũ ...
  const [darkMode, setDarkMode] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // ... giữ nguyên các hàm xử lý và data khác ...
  const faqData: FAQItem[] = [
    {
      category: "Account Issues",
      icon: <User className="w-6 h-6" />,
      questions: [
        {
          question: "How do I reset my password?",
          answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password."
        },
        {
          question: "How can I update my profile information?",
          answer: "Go to your account settings, click on 'Edit Profile', make your changes, and click 'Save' to update your information."
        }
      ]
    },
    {
      category: "Payment & Subscription",
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and Apple Pay for subscription payments."
        },
        {
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription anytime from your account settings under 'Subscription Management'."
        }
      ]
    },
    {
      category: "Reading Progress",
      icon: <BookOpen className="w-6 h-6" />,
      questions: [
        {
          question: "How is my reading progress tracked?",
          answer: "Your progress is automatically saved as you read. You can view your reading statistics in your profile dashboard."
        },
        {
          question: "Can I sync my progress across devices?",
          answer: "Yes! Your reading progress automatically syncs across all your devices when you're signed into your account."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: <Settings className="w-6 h-6" />,
      questions: [
        {
          question: "Why won't my book download?",
          answer: "Check your internet connection and storage space. If the issue persists, try logging out and back in, or clear your app cache."
        },
        {
          question: "How do I report a technical issue?",
          answer: "Use the contact form below or click the live chat button to speak with our technical support team directly."
        }
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowConfirmation(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 scroll-smooth" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
    }}>
      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes iconSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .icon-hover:hover svg {
          animation: iconSpin 1s ease-in-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(155, 155, 155, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-lg z-50"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`relative pt-20 pb-16 text-center ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1 
            {...fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Need Help? We're Here for You!
          </motion.h1>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className={`text-xl mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Find answers to common questions or reach out to our support team
          </motion.p>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="py-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-4">
              {faqData.map((category) => (
                <motion.div
                  key={category.category}
                  variants={fadeInUp}
                  className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}
                >
                  <button
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.category ? null : category.category
                    )}
                    className="w-full p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {category.icon}
                      </div>
                      <span className="font-semibold text-lg">{category.category}</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform duration-300 ${
                        expandedCategory === category.category ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedCategory === category.category && (
                    <div className="px-6 pb-6">
                      {category.questions.map((item) => (
                        <div key={item.question} className="border-t first:border-t-0 py-4">
                          <button
                            onClick={() => setExpandedQuestion(
                              expandedQuestion === item.question ? null : item.question
                            )}
                            className="w-full text-left font-medium mb-2 flex justify-between items-center"
                          >
                            <span>{item.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                expandedQuestion === item.question ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {expandedQuestion === item.question && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              {item.answer}
                            </motion.p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="py-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            >
              Contact Support
            </motion.h2>

            <div className={`grid md:grid-cols-2 gap-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p>support@bookreader.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p>1-800-READER1</p>
                  </div>
                </div>
              </motion.div>

              <motion.form
                variants={fadeInUp}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                  required
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full p-3 rounded-xl border h-32 resize-none ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
                >{isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
                
                {showConfirmation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 text-center font-medium"
                  >
                    Message sent successfully!
                  </motion.div>
                )}
              </motion.form>
            </div>
          </div>
        </motion.section>

        {/* Live Chat Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default Support;