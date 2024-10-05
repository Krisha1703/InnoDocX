import { Drawer as MuiDrawer, Typography } from "@mui/material";
import Image from "next/image";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState, useContext } from "react";
import ThemeContext from './ThemeContext'; // Import your ThemeContext

const SidebarDrawer = ({ open, handleDrawerClose }) => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  return (
    <MuiDrawer
      anchor="left"
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{ onBackdropClick: handleDrawerClose }}
    >
      <div
        style={{
          width: 300,
          backgroundColor: isDarkMode ? '#424242' : '#ffffff', // Set background color based on dark mode
          color: isDarkMode ? '#ffffff' : '#000000', // Set text color based on dark mode
        }}
        onMouseLeave={handleDrawerClose}
      >
        <Typography variant="h5" className="p-8 pb-4">
          <span className="text-blue-500 font-medium">G</span>
          <span className="text-red-500 font-medium">o</span>
          <span className="text-yellow-500 font-medium">o</span>
          <span className="text-blue-500 font-medium">g</span>
          <span className="text-green-500 font-medium">l</span>
          <span className="text-red-500 font-medium">e</span>
          <span className="mx-2">Docs</span>
        </Typography>
        <hr className="w-full" />

        {/* Navbar Items */}
        <div className="px-8 py-4 flex flex-col space-y-4 scale-90">
          {[
            { name: "Docs", icon: "/docs.png" },
            { name: "Sheets", icon: "/sheets.png" },
            { name: "Slides", icon: "/slides.png" },
            { name: "Form", icon: "/forms.png" },
          ].map((item, index) => (
            <div key={index} className="flex space-x-5 items-center">
              <Image src={item.icon} width={25} height={25} alt={item.name} />
              <Typography className="font-medium">{item.name}</Typography>
            </div>
          ))}
        </div>

        <hr className="w-full -mt-4" />

        {/* Settings & Help */}
        <div className="px-8 py-4 flex flex-col space-y-4 scale-90">
          <div className="flex space-x-4 items-center">
            <SettingsIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            <Typography className="font-medium">{isDarkMode ? <span style={{ color: '#ffffff' }}>Settings</span> : 'Settings'}</Typography>
          </div>
          
          <div className="flex space-x-4 items-center">
            <HelpOutlineIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            <Typography className="font-medium">{isDarkMode ? <span style={{ color: '#ffffff' }}>Help & Feedback</span> : 'Help & Feedback'}</Typography>
          </div>
        </div>

        <hr className="w-full" />

        {/* Drive */}
        <div className="flex space-x-4 px-8 py-4 items-center scale-90">
          <Image src="/drive.webp" width={25} height={25} alt="drive" />
          <Typography className="font-medium">Drive</Typography>
        </div>

        <hr className="w-full" />

        {/* Footer */}
        <div className="p-8 mt-10 float-right flex space-x-2">
          <p className="text-xs font-medium cursor-pointer hover:text-black" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            Privacy Policy
          </p>
          <p className="text-xs">.</p>
          <p className="text-xs font-medium cursor-pointer hover:text-black" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            Terms of Service
          </p>
        </div>
      </div>
    </MuiDrawer>
  );
};

export default SidebarDrawer;
