"use client";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { db } from "../../../components/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { getSession, signOut, useSession } from "next-auth/react";
import Login from "@/components/Login";
import DescriptionIcon from "@mui/icons-material/Description";
import { collection, doc } from "firebase/firestore";
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from "@mui/icons-material/People";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Lock } from "@mui/icons-material";
import TextEditor from "../../../components/TextEditor";
import { wordCount } from '../../../components/WordCount';
import { sentenceCount } from '../../../components/WordCount';
import { characterCount } from '../../../components/WordCount';
import ThreeDChart from "../../../components/3DCharts"

export default function Page({ params }) {
  const { data: session, status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // Track the open menu
  const [shareDoc, setShareDoc] = useState(false);
  const [countModalOpen, setCountModalOpen] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [screenSize, setScreenSize] = useState('100%'); // Default screen size is 100%
  

  const handleScreenSizeChange = (size) => {
    if (size === 'Fit') {
      // Logic for "Fit", could be custom logic to fit content. Setting it to 100% for now.
      setScreenSize('100%');
    } else {
      setScreenSize(size); // Set the screen size based on the selected percentage
    }
  };

   // Function to toggle page orientation
   const toggleOrientation = () => {
    setOrientation(prev => (prev === 'portrait' ? 'landscape' : 'portrait'));
  };

  // Update editor style based on orientation
  useEffect(() => {
    const editorElement = document.querySelector('.custom-editor');
    
    if (editorElement) {
      if (orientation === 'landscape') {
        editorElement.style.width = '100vw';  // Full width
        editorElement.style.height = '50vh'; // Half height
      } else {
        editorElement.style.width = '60vw';  // Full width for portrait too
         // Full height for portrait
      }
    }
  }, [orientation]);

  useEffect(() => {
    // Apply the screen size to the element with the class "custom-editor"
    const editorElement = document.querySelector('.custom-editor');
    
    if (editorElement) {
      if (screenSize === '50%') {
        editorElement.style.width = '50vw'; // Set the width to 50% of viewport width
        editorElement.style.height = '50vh'; // Set the height to 50% of viewport height
      } else if (screenSize === '75%') {
        editorElement.style.width = '75vw';
        editorElement.style.height = '75vh';
      } else if (screenSize === '100%') {
        editorElement.style.width = '90vw';
        
      }
    }
  }, [screenSize]); // Effect depends on screenSize state

  const router = useRouter();
  const id = params.id;

  const [snapshot, loading] = useDocumentOnce(
    session?.user?.email
      ? doc(collection(db, "userDocs", session?.user?.email, "docs"), id)
      : null
  );

  if (!loading && !snapshot?.data()?.fileName) {
    router.replace("/");
  }

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handle3DStatisticsClick = () => {
    setStatisticsModalOpen(true);
  };

  const handleWordCountClick = () => {
    setCountModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCountModalOpen(false);
    setStatisticsModalOpen(false);
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu); // Toggle the clicked menu
  };

  if (!session) return <Login />;

  return (
    <div>
      <header className="flex justify-between items-center p-3 pb-1">
        <span onClick={() => router.push("/")} className="cursor-pointer">
          <Image src="/docs.png" width={30} height={30} alt="docs" />
        </span>

        <div className="flex-grow px-2">
          <h1 className="text-[1.2rem]">{snapshot?.data()?.fileName}</h1>
          <div className="flex items-center text-sm space-x-2 h-8 text-gray-800">
            <div className="relative">
              <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => toggleMenu('file')}>
                File
              </p>
              {openMenu === 'file' && (
                <div className="absolute z-50 bg-white shadow-lg mt-2 p-5 px-0 rounded-md">
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => router.push("/")}>New</p>
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => router.push("/")}>Open</p>
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => router.push("/")}>Rename</p>
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => router.push("/")}>Delete</p>
                </div>
              )}
            </div>
            <div className="relative">
              <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => toggleMenu('edit')}>
                Edit
              </p>
            </div>
            <div className="relative">
              <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => toggleMenu('view')}>
                View
              </p>
              {openMenu === 'view' && (
                <div className="absolute z-50 bg-white shadow-lg mt-2 p-5 px-0 rounded-md">
                    <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleScreenSizeChange('Fit')}>Fit</p>
                    <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleScreenSizeChange('50%')}>50%</p>
                    <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleScreenSizeChange('75%')}>75%</p>
                    <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleScreenSizeChange('100%')}>100%</p>
                </div>
              )}
            </div>
            <div className="relative">
              <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => toggleMenu('insert')}>
                Insert
              </p>
            </div>
            <div className="relative">
              <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => toggleMenu('format')}>
                Format
              </p>
              {openMenu === 'format' && (
                <div className="absolute z-50 bg-white shadow-lg mt-10 p-5 px-0 rounded-md">
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={toggleOrientation}>Page Orientation</p>
                </div>
              )}
            </div>
            <div className="relative">
              <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => toggleMenu('tools')}>
                Tools
              </p>
              {openMenu === 'tools' && (
                <div className="absolute z-50 bg-white shadow-lg mt-10 p-5 px-0 rounded-md">
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleWordCountClick()}>Word Count</p>
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleWordCountClick()}>Sentence Count</p>
                  <p className="p-2 cursor-pointer hover:bg-gray-100 px-20" onClick={() => handleWordCountClick()}>Total Characters</p>
                </div>
              )}

               {/* Word Count Modal */}
            <Modal
              open={countModalOpen}
              onClose={handleModalClose}
              aria-labelledby="word-count-title"
              aria-describedby="word-count-description"
            >
              <Box className="absolute rounded-xl top-[20%] left-[35%] w-1/4 shadow-md p-4 bg-white flex flex-col items-center">
                <CloseIcon className="cursor-pointer absolute right-5 my-2" onClick={handleModalClose} />
                <Typography variant="h6" className="mt-10">
                  Document Statistics
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Words: {wordCount}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Sentences: {sentenceCount}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Characters: {characterCount}
                </Typography>
                
              </Box>
            </Modal>

            </div>
            <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer" onClick={() => handle3DStatisticsClick()}>Extensions</p>

              {/* 3D Chart Modal */}
              <Modal
              open={statisticsModalOpen}
              onClose={handleModalClose}
              aria-labelledby="word-count-title"
              aria-describedby="word-count-description"
            >
              <Box className="absolute rounded-xl top-[20%] left-[35%] w-1/2 shadow-md p-4 pb-10 bg-white flex flex-col items-center">
                <CloseIcon className="cursor-pointer absolute right-5 mt-0 mb-10" onClick={() => handleModalClose()} />
                <Typography variant="h6" className="my-10">
                  3D Statistics
                </Typography>

                <ThreeDChart />
                
              </Box>
            </Modal>

            <p className="bg-white hover:bg-gray-200 p-1 px-2 hover:rounded-md cursor-pointer">Help</p>
          </div>
        </div>

        <div className="mr-1 flex space-x-2 w-1/7 p-4 py-2 rounded-full bg-[#bbdcf2] cursor-pointer">
          <Lock />
          <h2 onClick={() => {
            console.log('Share button clicked');
            setShareDoc(true);
          }}>
            Share
          </h2>

        </div>

        {shareDoc && (
          <div className="absolute top-20 right-10  bg-gray-100 p-4 rounded-md shadow-md">
            <p>Share this document link:</p>
            <input type="text" value={`https://yourapp.com/doc/${id}`} readOnly className="border p-2 w-full" />
            <Button onClick={() => setShareDoc(false)} className="mt-2 bg-[#2F85F5]">
              Close
            </Button>
          </div>
        )}


        <Image onClick={handleModalOpen} src={session.user.image} alt={session.user.name} width={50} height={50} className='rounded-full cursor-pointer' style={{ transform: 'scale(0.8)' }} />
      </header>


      <TextEditor  id={params.id} fileName={snapshot?.data()?.fileName}/>

      {/* Account Management Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="account-management-title"
        aria-describedby="account-management-description"
      >
        <Box className="absolute rounded-xl top-[20%] right-[2%] w-1/4 shadow-md p-4 bg-white flex flex-col items-center justify-items-center">
          <CloseIcon className='cursor-pointer absolute right-5 my-2' onClick={handleModalClose} />
          <Typography variant="h6" className='mt-10'>
            Account Management
          </Typography>
          <Box className="mt-2 flex flex-col items-center ">
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={50}
              height={50}
              className='rounded-full'
            />
            <Typography variant="body1" sx={{ mt: 1 }}>
              {session.user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {session.user.email}
            </Typography>

            <Box className="mt-4 flex flex-col">
              <div className='flex items-center rounded-md cursor-pointer hover:bg-gray-300 justify-between w-full space-x-7 bg-gray-100 p-4'>
                <AddCircleIcon />
                <div className='cursor-pointer' onClick={signIn}>
                  <h6 className='text-md'>Sign in with another account</h6>
                </div>
              </div>

              <div className='flex justify-between my-2'>
                <div className='flex items-center rounded-md cursor-pointer hover:bg-gray-300 justify-between space-x-7 w-full bg-gray-100 p-4'>
                  <LogoutIcon />
                  <div className='cursor-pointer' onClick={signOut}>
                    <h6 className='text-md'>Sign out of this account</h6>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
