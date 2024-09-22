import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import SettingsIcon from "@mui/icons-material/Settings"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Modal,
  Box,
  Grid2,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close'
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import Image from 'next/image';
import GmailIcon from '@mui/icons-material/Email';
import DriveIcon from '@mui/icons-material/Cloud';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MapIcon from '@mui/icons-material/Map';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoIcon from '@mui/icons-material/Photo';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ContactsIcon from '@mui/icons-material/Contacts';

// Styling for the search bar
const Search = styled('div')(({ theme, focused }) => ({
  position: 'relative',
  boxShadow: focused ? '0px 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
  marginLeft: 0,
  backgroundColor: focused ? 'white' : '',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

// Styling for the search icon wrapper
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Styling for the input base in the search bar
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const DotMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const services = [
    { name: 'Gmail', icon: <GmailIcon /> },
    { name: 'Drive', icon: <DriveIcon /> },
    { name: 'Calendar', icon: <CalendarTodayIcon /> },
    { name: 'Maps', icon: <MapIcon /> },
    { name: 'YouTube', icon: <YouTubeIcon /> },
    { name: 'Docs', icon: <DescriptionIcon /> },
    { name: 'Photos', icon: <PhotoIcon /> },
    { name: 'Meet', icon: <VideoCallIcon /> },
    { name: 'Contacts', icon: <ContactsIcon /> },
  ];

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleClick}
      >
        <Image src="/dotmenu.png" width={30} height={30} alt="menu" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Grid2 container spacing={1} style={{ padding: 8, width: 200 }}>
          {services.map((service, index) => (
            <Grid2 item xs={4} key={index}>
              <MenuItem onClick={handleClose}>
                {service.icon}
              </MenuItem>
            </Grid2>
          ))}
        </Grid2>
      </Menu>
    </>
  );
};

export default function HeaderNavbar() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSignOut = () => signOut({ callbackUrl: '/' });

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    fetchDocuments(value);
  };

  const fetchDocuments = async (searchTerm) => {
    if (!session?.user?.email) return;

    const docsCollection = collection(db, "userDocs", session.user.email, "docs");

    // If searchTerm is empty, reset documents
    if (!searchTerm) {
        setDocuments([]);
        return;
    }

    // Use startAt and endAt for better matching
    const q = query(
        docsCollection, 
        where("fileName", ">=", searchTerm), 
        where("fileName", "<=", searchTerm + '\uf8ff')
    );

    try {
        const querySnapshot = await getDocs(q);
        const fetchedDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Debugging: Log the fetched documents
        console.log(fetchedDocs);

        setDocuments(fetchedDocs);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
};



  return (
    <>
      <AppBar position="static">
        <Toolbar className="flex justify-between bg-white text-black shadow-sm">
          <div className="flex">
            <IconButton edge="start" color="inherit" onClick={handleDrawerOpen} className="mr-3">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className="flex items-center gap-3 text-gray-700">
              <Image src="/docs.png" width={30} height={30} alt="docs" />
              Docs
            </Typography>
          </div>

          <div className="w-1/2">
            <Search focused={focused} className="rounded-full bg-[#F0F4F9] py-1">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleSearchChange}
              />
            </Search>
          </div>

          <div className="flex space-x-3">
            <DotMenu />
            <Image onClick={handleModalOpen} src={session.user.image} alt={session.user.name} width={50} height={50} className='rounded-full cursor-pointer' style={{ transform: 'scale(0.8)' }} />
          </div>
        </Toolbar>
      </AppBar>

      {/* Document List */}
      {searchQuery && (
        <List className='max-w-3xl'>
           <ListItemText primary="Search query results: " className='mx-20 my-5'/>
          {documents.length > 0 ? (
            documents.map(doc => (
              <Link href={`/doc/${doc.id}`} passHref>
              <ListItem key={doc.id} className='mx-40 bg-white hover:bg-[#E8F0FE] p-4 shadow-md cursor-pointer'>
                 <Image src="/docs.png" width={20} height={20} alt="docs" className='mx-5'/>
                <ListItemText primary={doc.fileName} />
                <ListItemText primary={doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toLocaleString() : 'N/A'} />
              </ListItem>
              </Link>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No documents found" />
            </ListItem>
          )}
        </List>
      )}

      {/* Account Management Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
      >
        <Box className="absolute rounded-xl top-[20%] right-[2%] w-1/4 shadow-md p-4 bg-white flex flex-col items-center">
          <CloseIcon className='cursor-pointer absolute right-5 my-2' onClick={handleModalClose}/>
          <Typography variant="h6" className='mt-10'>Account Management</Typography>
          <Box className="mt-2 flex flex-col items-center">
            <Image src={session.user.image} alt={session.user.name} width={50} height={50} className='rounded-full' />
            <Typography variant="body1" sx={{ mt: 1 }}>{session.user.name}</Typography>
            <Typography variant="body2" color="textSecondary">{session.user.email}</Typography>

            <Box className="mt-4 flex flex-col">
              <div className='flex items-center rounded-md cursor-pointer hover:bg-gray-300 justify-between w-full space-x-7 bg-gray-100 p-4'>
                <AddCircleIcon />
                <div className='cursor-pointer' onClick={signIn}>
                  <h6 className='text-md'>Sign in with another account</h6>
                </div>
              </div>
              <div className='flex justify-between my-2'>
                <div className='flex items-center rounded-md cursor-pointer hover:bg-gray-300 justify-between w-full space-x-7 bg-gray-100 p-4'>
                  <LogoutIcon />
                  <div className='cursor-pointer' onClick={handleSignOut}>
                    <h6 className='text-md'>Logout</h6>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>

       {/* Side Navbar */}
       <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{
          onBackdropClick: handleDrawerClose, // Close drawer when clicking outside
        }}
      >
        <div
          style={{ width: 300 }}
          onMouseLeave={handleDrawerClose} // Close drawer when hovering outside
        >
          {/* Navbar Items */}
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

          <div className="px-8 py-4 flex flex-col space-y-4 scale-90">
            {[
              { name: 'Docs', icon: '/docs.png' },
              { name: 'Sheets', icon: '/sheets.png' },
              { name: 'Slides', icon: '/slides.png' },
              { name: 'Form', icon: '/forms.png' },
            ].map((item, index) => (
              <div key={index} className="flex space-x-5 items-center">
                <Image src={item.icon} width={25} height={25} alt={item.name} />
                <Typography className="font-medium">{item.name}</Typography>
              </div>
            ))}
          </div>

          <hr className="w-full -mt-4" />

          <div className="px-8 py-4 flex flex-col space-y-4 scale-90">
            <div className="flex space-x-4 items-center">
              <SettingsIcon />
              <Typography className="font-medium">Settings</Typography>
            </div>
            <div className="flex space-x-4 items-center">
              <HelpOutlineIcon />
              <Typography className="font-medium">Help & Feedback</Typography>
            </div>
          </div>

          <hr className="w-full" />

          <div className="flex space-x-4 px-8 py-4 items-center scale-90">
            <Image src="/drive.webp" width={25} height={25} alt="drive" />
            <Typography className="font-medium">Drive</Typography>
          </div>

          <hr className="w-full" />

          <div className="p-8 mt-10 float-right flex space-x-2">
            <p className="text-xs text-gray-700 font-medium cursor-pointer hover:text-black">
              Privacy Policy
            </p>
            <p className="text-xs">.</p>
            <p className="text-xs text-gray-700 font-medium cursor-pointer hover:text-black">
              Terms of Service
            </p>
          </div>
        </div>
      </Drawer>

    </>
  );
}
