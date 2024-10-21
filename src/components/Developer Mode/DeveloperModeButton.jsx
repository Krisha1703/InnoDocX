import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import ThemeContext from './ThemeContext'; 
import { CodeRounded } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const DeveloperModeButton = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isDeveloperMode, setDeveloperMode] = useState(false);

  const handleDeveloperModeToggle = () => {
    setDeveloperMode(!isDeveloperMode);
    toggleTheme(); // Optionally toggle theme when switching modes
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ToastContainer />
      {/* 3D Developer Mode Button */}
      <motion.button
        onClick={handleDeveloperModeToggle}
        whileHover={{ scale: 1.1 }} // Scale up on hover
        whileTap={{ scale: 0.9 }}   // Scale down on tap
        initial={{ y: 0 }}          // Initial position
        animate={{
          y: [-10, 0],               // Animate Y position
          transition: { duration: 0.6, repeat: Infinity, repeatType: 'reverse' } // Smooth animation
        }}
        style={{
          perspective: '500px',
          backgroundColor: isDeveloperMode ? '#1a1a1a' : '#333', // Background color based on mode
          color: 'white',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          padding: '10px 20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          fontSize: '15px',
          fontWeight: 'bold',
        }}
        
      >
         {/* Responsive text and icon display */}
         <span className="hidden lg:inline">Developer Mode</span>
          <span className="lg:hidden">
          <CodeRounded size={30} /> {/* Developer light icon */}
        </span>
      </motion.button>

    </div>
  );
};

export default DeveloperModeButton;
