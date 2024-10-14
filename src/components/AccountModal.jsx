//MUI Components
import { Modal, Box, Typography } from '@mui/material';
import { Close as CloseIcon, AddCircle as AddCircleIcon, Logout as LogoutIcon } from '@mui/icons-material';

//React Hooks and UI Components
import { useSession, signIn, signOut } from "next-auth/react";
import { useContext } from 'react';
import Image from 'next/image';
import ThemeContext from './Developer Mode/ThemeContext'; 

const AccountModal = ({ modalOpen, handleModalClose }) => {
  const { data: session, status } = useSession();
  const { isDarkMode } = useContext(ThemeContext); 

  // Ensure the modal doesn't break if the session is not loaded
  if (status === "loading") return null;

  // Handle cases where there is no session data
  if (!session) return null;

  const handleSignOut = () => signOut({ callbackUrl: '/' });

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box 
        className="absolute rounded-xl top-[20%] right-[2%] w-1/4 shadow-md p-4 flex flex-col items-center"
        style={{
          backgroundColor: isDarkMode ? '#424242' : '#ffffff', // Background color based on dark mode
          color: isDarkMode ? '#ffffff' : '#000000', // Text color based on dark mode
        }}
      >
        <CloseIcon 
          className='cursor-pointer absolute right-5 my-2' 
          onClick={handleModalClose} 
          style={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Icon color based on dark mode
        />
        <Typography variant="h6" className='mt-10'>{isDarkMode ? <span style={{ color: '#ffffff' }}>Account Management</span> : 'Account Management'}</Typography>

        <Box className="mt-2 flex flex-col items-center">
          {session?.user?.image && (
            <Image src={session.user.image} alt={session.user.name} width={50} height={50} className='rounded-full' />
          )}
          <Typography variant="body1" sx={{ mt: 1, color: isDarkMode ? '#ffffff' : '#000000' }}>{session?.user?.name}</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ color: isDarkMode ? '#ffffff' : 'textSecondary' }}>{session?.user?.email}</Typography>

          <Box className="mt-4 flex flex-col">
            <div className='flex items-center rounded-md cursor-pointer hover:bg-gray-300 justify-between w-full space-x-7 bg-gray-100 p-4'
              style={{ backgroundColor: isDarkMode ? '#616161' : '#f5f5f5', color: isDarkMode ? '#ffffff' : '#000000' }}>
              <AddCircleIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
              <div className='cursor-pointer' onClick={signIn}>
                <h6 className='text-md'>{isDarkMode ? <span style={{ color: '#ffffff' }}>Sign in with another account</span> : 'Sign in with another account'}</h6>
              </div>
            </div>

            <div className='flex justify-between my-2'>
              <div className={`flex items-center rounded-md cursor-pointer hover:bg-gray-300 justify-between w-full space-x-7 bg-gray-100 p-4`}
                style={{ backgroundColor: isDarkMode ? '#616161' : '#f5f5f5', color: isDarkMode ? '#ffffff' : '#000000' }}>
                <LogoutIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
                <div className='cursor-pointer' onClick={handleSignOut}>
                  <h6 className='text-md'>{isDarkMode ? <span style={{ color: '#ffffff' }}>Logout</span> : 'Logout'}</h6>
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountModal;
