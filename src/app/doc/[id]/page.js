"use client";
import { useRouter } from "next/navigation";
import { db } from "../../../components/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useSession } from "next-auth/react";
import Login from "@/components/Login";
import { collection, doc } from "firebase/firestore";
import AccountModal from "@/components/AccountModal";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import TextEditor from "../../../components/TextEditor";
import ShareDoc from "../../../components/ShareDocument"
import ChartModal from "../../../components/ChartModal"
import DashboardAnalytics from "../../../components/DashboardAnalytics"
import WordCountModal from "../../../components/WordCountModal"
import ToolBarMenu from "../../../components/ToolbarMenu"

export default function Page({ params }) {
  const { data: session } = useSession();

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


  if (!session) return <Login />;


  ////////////////////////////////////////////////////////////////////////////////////////////

  //For Advanced Analytics Dashboard
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  const handleAnalyticsDashboard = () => {
    setIsDashboardModalOpen(true);
  };

  const closeModal = () => {
    setIsDashboardModalOpen(false);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////

  //Page Orientation - Landscape or Portrait
  const [orientation, setOrientation] = useState('portrait');

  const toggleOrientation = () => {
    setOrientation(prev => (prev === 'portrait' ? 'landscape' : 'portrait'));
  };

  // Update editor style based on orientation
  useEffect(() => {
    const editorElement = document.querySelector('.custom-editor');
    
    if (editorElement) {
      if (orientation === 'landscape') {
        editorElement.style.width = '100vw';
        editorElement.style.height = '50vh'; 
      } else {
        editorElement.style.width = '60vw'; 
      }
    }
  }, [orientation]);

  //////////////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////

  //For Handling Screen Size Percentages - 50%, 75%, 100%
  const [screenSize, setScreenSize] = useState('100%'); // Default screen size is 100%

  const handleScreenSizeChange = (size) => {
    if (size === 'Fit') {
      setScreenSize('100%');
    } else {
      setScreenSize(size); // Set the screen size based on the selected percentage
    }
  };

  useEffect(() => {
    const editorElement = document.querySelector('.custom-editor');
    
    if (editorElement) {
      if (screenSize === '50%') {
        editorElement.style.width = '50vw'; 
        editorElement.style.height = '50vh'; 
      } else if (screenSize === '75%') {
        editorElement.style.width = '75vw';
        editorElement.style.height = '75vh';
      } else if (screenSize === '100%') {
        editorElement.style.width = '90vw';
        
      }
    }
  }, [screenSize]); 

  //////////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////////////////////////////////////

  //Word Count Modal - word count, sentence count, and character count
  const [countModalOpen, setCountModalOpen] = useState(false);

  const handleWordCountClick = () => {
    setCountModalOpen(true);
    console.log(countModalOpen)
  };

  const handleWordCountClose = () => {
    setCountModalOpen(false);
    console.log(countModalOpen)
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////////////////

  //3D Statistics Modal to Display Word Count, Character Count, and Sentence Count
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);

  const handle3DStatisticsClick = () => {
    setStatisticsModalOpen(true);
  };

  const handle3DStatisticsClose = () => {
    setStatisticsModalOpen(false);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////////////////

  //Toggling the Toolbar Menus and Opening Dropdown Menus - File, Edit, View, Insert, Format, Tools, Extension, and Help
  const [openMenu, setOpenMenu] = useState(null); // Track the open menu

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu); // Toggle the clicked menu
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////////////////

  //User Profile to Open Account Management Modal
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////


  return (
    <ThemeProvider>
      <header className="flex justify-between items-center p-3 pb-1">
        
        {/*Google Docs Icon to return to home page again*/}
        <span onClick={() => router.push("/")} className="cursor-pointer">
          <Image src="/docs.png" width={30} height={30} alt="docs" />
        </span>

        <div className="flex-grow px-2">

          <h1 className="text-[1.2rem]">{snapshot?.data()?.fileName}</h1>{/*Document Name*/}

          {/* Toolbar Menu Component */}
          <ToolBarMenu
            handleScreenSizeChange={handleScreenSizeChange}
            toggleOrientation={toggleOrientation}
            handleWordCountClick={handleWordCountClick}
            handle3DStatisticsClick={handle3DStatisticsClick}
            handleAnalyticsDashboard={handleAnalyticsDashboard}
          />

        </div>

      <ShareDoc id={id}/>{/* Sharing Document*/}

      {/* User Profile Icon*/}
      <Image onClick={handleModalOpen} src={session.user.image} alt={session.user.name} width={50} height={50} className='rounded-full cursor-pointer' style={{ transform: 'scale(0.8)' }} />
      
      </header>

       {/* Text Editor */} 
      <TextEditor  id={params.id} fileName={snapshot?.data()?.fileName}/>

      {/* Account Modal */}
      <AccountModal modalOpen={modalOpen} handleModalClose={handleModalClose} />

      {/* Word Count Modal */}
      {countModalOpen && (
        <WordCountModal modalOpen={countModalOpen} handleModalClose={handleWordCountClose}/>
      )}
      
      {/* Dashboard Analytics Modal */}
      <DashboardAnalytics modalOpen={isDashboardModalOpen} handleModalClose={closeModal}/>

      {/* 3D Statistics Modal */}
      <ChartModal modalOpen={statisticsModalOpen} handleModalClose={handle3DStatisticsClose}/>
      
             
    </ThemeProvider>
  );
}
