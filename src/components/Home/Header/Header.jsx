//React Hooks
import React, { useState, useContext } from 'react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';

//MUI Components
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';

//UI Components
import DotMenu from "./DotMenu";
import AccountModal from "../../AccountModal";
import SidebarDrawer from './Drawer';
import DeveloperModeButton from "../../Developer Mode/DeveloperModeButton"
import { Search, SearchIconWrapper, StyledInputBase } from './Search';
import DocumentsList from './DocumentsList'; 
import ThemeContext  from '@/components/Developer Mode/ThemeContext'; 

import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';



// Voice Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

export default function HeaderNavbar() {
  const { data: session } = useSession();
  const { isDarkMode } = useContext(ThemeContext); 

  const [state, setState] = useState({
    modalOpen: false,
    drawerOpen: false,
    focused: false,
    searchQuery: '',
    isListening: false,
  });

  const { modalOpen, drawerOpen, searchQuery, isListening } = state;

  // Toggle Modal, Drawer, Focus
  const toggleState = (field) => setState((prevState) => ({ ...prevState, [field]: !prevState[field] }));

  // Voice search feature
  const handleVoiceSearchToggle = () => {
    if (isListening) {
      recognition.stop();
      toast.info("Voice activation disabled");
    } else {
      recognition.start();
      toast.success("Voice activation enabled");
    }
    toggleState('isListening');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setState((prevState) => ({ ...prevState, searchQuery: transcript }));
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setState((prevState) => ({ ...prevState, searchQuery: value }));
  };

  return (
    <div>
      <AppBar position="sticky">
        <ToastContainer />
        <Toolbar className={`flex justify-between ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} `}>

          <div className="flex">
            <IconButton edge="start" color="inherit" onClick={() => toggleState('drawerOpen')} className="mr-3">
              <MenuIcon />
            </IconButton>
            
            <div className={`flex text-nowrap cursor-pointer items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-700'} `}>
              <Image src="/docs.png" width={30} height={30} alt="docs" className='md:block hidden'/>
              
              <motion.h6 whileHover={{scale: 1.05, color: "#2F85F4"}} className='md:block hidden'>InnoDocX</motion.h6>
              
            </div>
          </div>

          <div className="w-1/2">
            <Search  className={`rounded-full ${isDarkMode? 'bg-gray-700': 'bg-[#F0F4F9]'}  py-1 flex justify-between`}>
              
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onFocus={() => toggleState('focused')}
                onBlur={() => toggleState('focused')}
                onChange={handleSearchChange}
                value={searchQuery}
              />

              <IconButton onClick={handleVoiceSearchToggle} className="absolute right-0">
                <MicIcon color={isListening ? "primary" : "action"} />
              </IconButton>

            </Search>
          </div>

          <DeveloperModeButton />

          <div className="flex space-x-3">
            <DotMenu />
            <Image
              onClick={() => toggleState('modalOpen')}
              src={session.user.image}
              alt={session.user.name}
              width={50}
              height={50}
              className='rounded-full cursor-pointer'
              style={{ transform: 'scale(0.8)' }}
            />
          </div>
        </Toolbar>
      </AppBar>

      {/* Document List */}
      <DocumentsList searchQuery={searchQuery} /> 

      {/* Account Modal */}
      <AccountModal modalOpen={modalOpen} handleModalClose={() => toggleState('modalOpen')} />

      {/* Sidebar Drawer */}
      <SidebarDrawer open={drawerOpen} handleDrawerClose={() => toggleState('drawerOpen')} />
    </div>
  );
}
