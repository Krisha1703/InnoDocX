import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import ThemeContext from './ThemeContext'; // Ensure to import your ThemeContext

const DeveloperModeButton = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Using theme context
  const [isDeveloperMode, setDeveloperMode] = useState(false);

  const handleDeveloperModeToggle = () => {
    setDeveloperMode(!isDeveloperMode);
    toggleTheme(); // Optionally toggle theme when switching modes
  };

  return (
    <div className="flex flex-col items-center justify-center">
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
        Developer Mode
      </motion.button>

      {/* Glimpse of Developer Mode */}
      {isDeveloperMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }} // Initial state for the logs
          animate={{ opacity: 1, scale: 1 }}   // Final state for the logs
          transition={{ duration: 0.5 }}        // Animation duration
          style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#222',
            color: '#00ff00',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
            textAlign: 'left',
            width: '80%',
            maxWidth: '500px',
          }}
        >
          <p>// Developer Logs</p>
          <p>console.log("Developer Mode Enabled");</p>
          <p>function debugMode() {"{"}</p>
          <p style={{ paddingLeft: '20px' }}> // Debugging tools enabled </p>
          <p>{"}"}</p>
        </motion.div>
      )}
    </div>
  );
};

export default DeveloperModeButton;
