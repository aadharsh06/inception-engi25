import React from 'react';
import { Button } from "../components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"; // Re-import motion

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background elements/animations (replace with Magic UI/Aceternity UI components later) */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Example: <MagicParticles count={500} className="absolute inset-0" /> */}
        {/* Example: <AceternityGrid className="absolute inset-0" /> */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="relative z-10 text-center space-y-6 px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none"
          variants={itemVariants}
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Your AI Assistant
          </span>
          <span className="block mt-4 text-gray-100">for Smarter Portfolios</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Agentic AI crafts personalized mutual fund portfolios, blending your goals with market dynamics for smarter returns.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            className="mt-8 px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            onClick={handleClick}
          >
            Get Started <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Simple CSS animations for blobs */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default LandingPage;
