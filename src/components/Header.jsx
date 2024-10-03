import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import DotMenu from "./DotMenu";
import AccountModal from "./AccountModal";
import SidebarDrawer from './Drawer';
import { ToastContainer, toast } from 'react-toastify';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { Search, SearchIconWrapper, StyledInputBase } from './Search';
import MicIcon from '@mui/icons-material/Mic';
import DocumentsList from './DocumentsList'; // Import the DocumentsList component

// Voice Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

export default function HeaderNavbar() {
  const { data: session } = useSession();

  const [state, setState] = useState({
    modalOpen: false,
    drawerOpen: false,
    focused: false,
    searchQuery: '',
    isListening: false,
  });

  const { modalOpen, drawerOpen, focused, searchQuery, isListening } = state;

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
    <>
      <AppBar position="sticky">
        <ToastContainer />
        <Toolbar className="flex justify-between bg-white text-black">

          <div className="flex">
            <IconButton edge="start" color="inherit" onClick={() => toggleState('drawerOpen')} className="mr-3">
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap className="flex items-center gap-3 text-gray-700">
              <Image src="/docs.png" width={30} height={30} alt="docs" />
              Docs
            </Typography>
          </div>

          <div className="w-1/2">
            <Search focused={focused} className="rounded-full bg-[#F0F4F9] py-1 flex justify-between">
              
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
      <DocumentsList searchQuery={searchQuery} /> {/* Pass searchQuery as prop */}

      {/* Account Modal */}
      <AccountModal modalOpen={modalOpen} handleModalClose={() => toggleState('modalOpen')} />

      {/* Sidebar Drawer */}
      <SidebarDrawer open={drawerOpen} handleDrawerClose={() => toggleState('drawerOpen')} />
    </>
  );
}
