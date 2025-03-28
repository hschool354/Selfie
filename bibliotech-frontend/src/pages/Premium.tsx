import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Star, Gift, Shield, Zap } from 'lucide-react';
import premiumPackageService, { PremiumPackageResponse } from '../services/premiumPackageService';

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [premiumPlans, setPremiumPlans] = useState<PremiumPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPremiumPackages();
  }, []);

  const fetchPremiumPackages = async () => {
    try {
      setLoading(true);
      const response = await premiumPackageService.getAllActivePackages();
      setPremiumPlans(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching premium packages:', err);
      setError('Unable to load premium packages. Please try again later.');
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const premiumFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Ad-Free Experience",
      description: "Enjoy uninterrupted browsing without any advertisements"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Priority Support",
      description: "Get instant access to our dedicated support team"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Exclusive Content",
      description: "Access premium-only content and early releases"
    }
  ];

  // Helper function to determine if a package is the most popular one
  const isPopularPlan = (plan: PremiumPackageResponse) => {
    if (premiumPlans.length === 0) return false;
    
    // You can implement your own logic here to determine which plan should be highlighted as popular
    // For example, the yearly plan is often considered the most popular
    return plan.billingCycle === 'YEARLY';
  };

  // Helper function to get the period display text based on billing cycle
  const getPeriodText = (billingCycle: string) => {
    switch (billingCycle) {
      case 'MONTHLY':
        return 'month';
      case 'YEARLY':
        return 'year';
      default:
        return 'period';
    }
  };

  // Helper function to parse features JSON string to array
  const parseFeatures = (featuresJson: string): string[] => {
    try {
      // Handle case where features might be null or undefined
      if (!featuresJson) return ['All Premium Features'];
      
      const parsed = JSON.parse(featuresJson);
      // Make sure we return an array even if parsing succeeds but gives a non-array
      return Array.isArray(parsed) ? parsed : ['All Premium Features'];
    } catch (e) {
      console.error('Error parsing features JSON:', e);
      return ['All Premium Features'];
    }
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

        .breathing-border {
          animation: breathe 3s infinite;
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

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-16 text-center bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1 
            {...fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Unlock Premium Experience
          </motion.h1>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-12"
          >
            Elevate your experience with exclusive features and premium content
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 icon-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Choose Your Premium Plan
          </motion.h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {premiumPlans.map((plan) => {
                const isPopular = isPopularPlan(plan);
                const features = parseFeatures(plan.features);
                
                return (
                  <motion.div 
                    key={plan.packageId}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-6 rounded-2xl bg-white shadow-xl
                      ${isPopular ? 'border-2 border-blue-500 breathing-border' : 'border border-gray-200'}
                      ${selectedPlan === plan.packageId ? 'ring-4 ring-blue-500 scale-105' : ''}
                    `}
                  >
                    {isPopular && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium"
                      >
                        Most Popular
                      </motion.div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        {plan.packageName}
                      </h3>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500">/{getPeriodText(plan.billingCycle)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPlan(plan.packageId)}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300
                        ${isPopular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                    >
                      Select Plan
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Premium;