import { Drawer as MuiDrawer, Typography } from "@mui/material";
import Image from "next/image";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useContext } from "react";
import ThemeContext from '@/components/Developer Mode/ThemeContext'; 
import {motion} from "framer-motion"

const SidebarDrawer = ({ open, handleDrawerClose }) => {
  const { isDarkMode } = useContext(ThemeContext); 

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
          backgroundColor: isDarkMode ? '#424242' : '#ffffff', // background color based on dark mode
          color: isDarkMode ? '#ffffff' : '#000000', // text color based on dark mode
        }}
        onMouseLeave={handleDrawerClose}
        
      >
        <Typography variant="h5" className="p-8 pb-4">
          <Typography variant="h6" noWrap className={`flex cursor-pointer items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-700'} `}>
            <Image src="/docs.png" width={30} height={30} alt="docs" loading="lazy"/>
            <motion.h6 whileHover={{scale: 1.05, color: "#2F85F4"}}>InnoDocX</motion.h6>
          </Typography>
        </Typography>

        <hr className="w-full" />

        {/* Navbar Items */}
        <div className="px-8 py-4 flex flex-col space-y-4 scale-90">
          {[
            { name: "GitHub Profile", icon: "/github.png", link: "https://github.com/Krisha1703" },
            { name: "LinkedIn Proflie", icon: "/linkedin.png", link: "https://www.linkedin.com/in/krishabotadara/" },
            { name: "Personal Portfolio", icon: "/portfolio.png", link: "https://krishabotadara.vercel.app/" },
          ].map((item, index) => (
            <motion.a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="flex cursor-pointer space-x-5 items-center" whileHover={{x: 20}} transition={{duration: 0.5}}>
              <Image src={item.icon} width={25} height={25} alt={item.name} loading="lazy"/>
              <Typography className="font-medium">{item.name}</Typography>
            </motion.a>
          ))}
        </div>

        <hr className="w-full -mt-4" />

        {/* Settings & Help */}
        <div className="px-8 py-4 flex flex-col space-y-4 scale-90">
          <motion.div className="flex space-x-4 items-center cursor-pointer" whileHover={{x: 20}} transition={{duration: 0.5}}>
            <SettingsIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            <Typography className="font-medium">{isDarkMode ? <span style={{ color: '#ffffff' }}>Settings</span> : 'Settings'}</Typography>
          </motion.div>
          
          <motion.div className="flex space-x-4 items-center cursor-pointer" whileHover={{x: 20}} transition={{duration: 0.5}}>
            <HelpOutlineIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            <Typography className="font-medium">{isDarkMode ? <span style={{ color: '#ffffff' }}>Help & Feedback</span> : 'Help & Feedback'}</Typography>
          </motion.div>
        </div>

        <hr className="w-full" />

        {/* Drive */}
        <motion.a href="https://drive.google.com/file/d/1jgwHv0YPuyqvEr0hCr0xKJjLHIJzMggG/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex space-x-4 px-8 py-4 items-center scale-90" whileHover={{x: 20}} transition={{duration: 0.5}}>
          <Image src="/drive.webp" width={25} height={25} alt="drive" loading="lazy"/>
          <Typography className="font-medium">Resume</Typography>
        </motion.a>

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
