import { Modal, Box, Typography } from '@mui/material';
import { Close as CloseIcon, AddCircle as AddCircleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";

const AccountModal = ({ modalOpen, handleModalClose }) => {
  const { data: session, status } = useSession();

  // Ensure the modal doesn't break if the session is not loaded
  if (status === "loading") return null;

  // Handle cases where there is no session data
  if (!session) return null;

  const handleSignOut = () => signOut({ callbackUrl: '/' });

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box className="absolute rounded-xl top-[20%] right-[2%] w-1/4 shadow-md p-4 bg-white flex flex-col items-center">
        <CloseIcon className='cursor-pointer absolute right-5 my-2' onClick={handleModalClose} />
        <Typography variant="h6" className='mt-10'>Account Management</Typography>

        <Box className="mt-2 flex flex-col items-center">
          {session?.user?.image && (
            <Image src={session.user.image} alt={session.user.name} width={50} height={50} className='rounded-full' />
          )}
          <Typography variant="body1" sx={{ mt: 1 }}>{session?.user?.name}</Typography>
          <Typography variant="body2" color="textSecondary">{session?.user?.email}</Typography>

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
  );
};

export default AccountModal;
