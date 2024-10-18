import { useState, useContext, useEffect } from "react";
import ThemeContext from "@/components/Developer Mode/ThemeContext";

const ToolBarMenu = ({ handleScreenSizeChange, toggleOrientation, handleWordCountClick, handle3DStatisticsClick, handleAnalyticsDashboard }) => {
  const [openMenu, setOpenMenu] = useState(null); // Track the open menu
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track screen size
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Control visibility of the menu for small screens

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu); // Toggle the clicked menu
  };

  const { isDarkMode } = useContext(ThemeContext); 
  
  // Handle screen resizing to toggle menu for small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) { // Screen width for 'sm' size
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
        setIsMenuVisible(false); // Hide menu when the screen size changes
      }
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center text-sm space-x-2 h-8">
      {/* For small screens: Toggle button for the toolbar */}
      {isSmallScreen && (
        <div>
          <button
            className={`p-1 px-2 hover:rounded-md cursor-pointer ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          >
            {isMenuVisible ? 'Close Menu' : 'Open Menu'}
          </button>
        </div>
      )}

      {/* Show the toolbar menus only if it's not a small screen or the menu is visible */}
      {(!isSmallScreen || isMenuVisible) && (
        <div className="flex md:flex-row md:mt-0 mt-60 flex-col">
          {/* "File" Menu */}
          <div className="relative">
            <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`} onClick={() => toggleMenu('file')}>
              File
            </p>
            {openMenu === 'file' && (
              <div className={`absolute z-50 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-lg mt-2 p-5 px-0 rounded-md`}>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => router.push("/")}>New</p>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => router.push("/")}>Open</p>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => router.push("/")}>Rename</p>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => router.push("/")}>Delete</p>
              </div>
            )}
          </div>

          {/* "Edit" Menu */}
          <div className="relative">
            <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`} onClick={() => toggleMenu('edit')}>
              Edit
            </p>
          </div>

          {/* "View" Menu */}
          <div className="relative">
            <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`} onClick={() => toggleMenu('view')}>
              View
            </p>
            {openMenu === 'view' && (
              <div className={`absolute z-50 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-lg mt-2 p-5 px-0 rounded-md`}>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => handleScreenSizeChange('Fit')}>Fit</p>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => handleScreenSizeChange('50%')}>50%</p>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => handleScreenSizeChange('75%')}>75%</p>
                <p className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={() => handleScreenSizeChange('100%')}>100%</p>
              </div>
            )}
          </div>

          {/* "Format" Menu */}
          <div className="relative">
            <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`} onClick={() => toggleMenu('format')}>
              Format
            </p>
            {openMenu === 'format' && (
              <div className={`absolute z-50 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-lg mt-2 p-5 px-0 rounded-md`}>
                <p className={`p-2 cursor-pointer  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={toggleOrientation}>Page Orientation</p>
              </div>
            )}
          </div>

          {/* "Tools" Menu */}
          <div className="relative">
            <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`} onClick={() => toggleMenu('tools')}>
              Tools
            </p>
            {openMenu === 'tools' && (
              <div className={`absolute z-50 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-lg mt-2 p-5 px-0 rounded-md`}>
                <p className={`p-2 cursor-pointer  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={handleWordCountClick}>Word Count</p>
                <p className={`p-2 cursor-pointer  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={handleWordCountClick}>Sentence Count</p>
                <p className={`p-2 cursor-pointer  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={handleWordCountClick}>Total Characters</p>
              </div>
            )}
          </div>

          {/* "Extension" Menu */}
          <div className="relative">
            <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`} onClick={() => toggleMenu('extension')}>
              Extension
            </p>
            {openMenu === 'extension' && (
              <div className={`absolute z-50 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-lg mt-2 p-5 px-0 rounded-md`}>
                <p className={`p-2 cursor-pointer  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={handle3DStatisticsClick}>3D Statistics</p>
                <p className={`p-2 cursor-pointer  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} px-20`} onClick={handleAnalyticsDashboard}>Advanced Analytics Dashboard</p>
              </div>
            )}
          </div>

          {/* "Help" Menu */}
          <p className={`${isDarkMode ? 'bg-black text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'} p-1 px-2 hover:rounded-md cursor-pointer`}>Help</p>
        </div>
      )}
    </div>
  );
};

export default ToolBarMenu;
