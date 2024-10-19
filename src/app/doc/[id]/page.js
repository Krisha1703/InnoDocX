"use client";

//Firebase
import { db } from "../../../components/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { collection, doc, updateDoc } from "firebase/firestore";

//React Hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Image from "next/image";

//UI Components
import Login from "@/components/Login";
import AccountModal from "@/components/AccountModal";
import { ThemeProvider } from "@/components/Developer Mode/ThemeContext";
import TextEditor from "@/components/Document Editor/Text Editor/TextEditor";
import ShareDoc from "@/components/Document Editor/Text Editor/ShareDocument";
import ChartModal from "@/components/Document Editor/Text Editor/ChartModal";
import DashboardAnalytics from "@/components/Document Editor/Dashboard/DashboardAnalytics";
import WordCountModal from "@/components/Document Editor/Text Editor/WordCountModal";
import ToolBarMenu from "@/components/Document Editor/Text Editor/ToolbarMenu";
import DeveloperModeButton from "@/components/Developer Mode/DeveloperModeButton";
import DarkMode from "@/components/Developer Mode/DarkMode"


export default function Page({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const id = params.id; //Retrieve document id from the url path

  const docRef = session?.user?.email
  ? doc(collection(db, "userDocs", session?.user?.email, "docs"), id)
  : null;

  const [snapshot, loading] = useDocumentOnce(docRef);

  const [isRenaming, setIsRenaming] = useState(false); // Track rename state
  const [newFileName, setNewFileName] = useState(""); // New file name state

  // For Advanced Analytics Dashboard
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Page Orientation - Landscape or Portrait
  const [orientation, setOrientation] = useState("portrait");

  // For Handling Screen Size Percentages - 50%, 75%, 100%
  const [screenSize, setScreenSize] = useState("100%");

  // Word Count Modal
  const [countModalOpen, setCountModalOpen] = useState(false);

  // 3D Statistics Modal
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);

  // Toggling the Toolbar Menus
  const [openMenu, setOpenMenu] = useState(null);

  // User Profile Modal
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (snapshot && snapshot.data()?.fileName) {
      setNewFileName(snapshot.data().fileName); // Set the initial file name when data is fetched
    }
  }, [snapshot]);

  // Update editor style based on orientation
  useEffect(() => {
    const editorElement = document.querySelector(".custom-editor");

    if (editorElement) {
      if (orientation === "landscape") {
        editorElement.style.width = "100vw";
        editorElement.style.height = "50vh";
      } else {
        editorElement.style.width = "60vw";
      }
    }
  }, [orientation]);

  useEffect(() => {
    const editorElement = document.querySelector(".custom-editor");

    if (editorElement) {
      if (screenSize === "50%") {
        editorElement.style.width = "50vw";
        editorElement.style.height = "50vh";
      } else if (screenSize === "75%") {
        editorElement.style.width = "75vw";
        editorElement.style.height = "75vh";
      } else if (screenSize === "100%") {
        editorElement.style.width = "90vw";
      }
    }
  }, [screenSize]);

  // Function to handle renaming and updating Firebase
  const handleRename = async () => {
    if (!newFileName.trim()) {
      alert("File name cannot be empty");
      return;
    }

    try {
      // Update the file name in Firebase Firestore
      await updateDoc(doc(db, "userDocs", session.user.email, "docs", id), {
        fileName: newFileName,
      });
      setIsRenaming(false); // Exit renaming mode
    } catch (error) {
      console.error("Error renaming file: ", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRename(); // Call handleRename when Enter is pressed
    }
  };

  if (!loading && !snapshot?.data()?.fileName) {
    router.replace("/");
  }

  if (!session) return <Login />;

  const handleAnalyticsDashboard = () => {
    setIsDashboardModalOpen(true);
  };

  const closeModal = () => {
    setIsDashboardModalOpen(false);
  };

  const toggleOrientation = () => {
    setOrientation((prev) =>
      prev === "portrait" ? "landscape" : "portrait"
    );
  };

  const handleScreenSizeChange = (size) => {
    if (size === "Fit") {
      setScreenSize("100%");
    } else {
      setScreenSize(size);
    }
  };

  const handleWordCountClick = () => {
    setCountModalOpen(true);
  };

  const handleWordCountClose = () => {
    setCountModalOpen(false);
  };

  const handle3DStatisticsClick = () => {
    setStatisticsModalOpen(true);
  };

  const handle3DStatisticsClose = () => {
    setStatisticsModalOpen(false);
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <ThemeProvider>
      <DarkMode>
      <header className={`flex justify-between items-center p-3 pb-1 `}>
        {/*Google Docs Icon to return to home page again*/}
        <span onClick={() => router.push("/")} className="cursor-pointer">
          <Image src="/docs.png" width={30} height={30} alt="docs" />
        </span>

        <div className="flex-grow px-2">
          {!loading && snapshot ? (
            <div className="flex items-center">
              {isRenaming ? (
                <input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={handleRename} // Update on blur
                  onKeyDown={handleKeyDown} // Update on pressing Enter
                  className="text-[1.2rem] border-b-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-[1.2rem] cursor-text"
                  onClick={() => setIsRenaming(true)}
                >
                  {newFileName}
                </h1>
              )}
            </div>
          ) : (
            <h1>Loading...</h1>
          )}

          {/* Toolbar Menu Component */}
          <ToolBarMenu
            handleScreenSizeChange={handleScreenSizeChange}
            toggleOrientation={toggleOrientation}
            handleWordCountClick={handleWordCountClick}
            handle3DStatisticsClick={handle3DStatisticsClick}
            handleAnalyticsDashboard={handleAnalyticsDashboard}
          />
        </div>

        <div className="mx-5">
          <DeveloperModeButton />
        </div>
       

        <ShareDoc id={id} userEmail={session?.user?.email}/> {/* Sharing Document */}

        {/* User Profile Icon*/}
        <Image
          onClick={handleModalOpen}
          src={session.user.image}
          alt={session.user.name}
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
          style={{ transform: "scale(0.8)" }}
        />
      </header>

      </DarkMode>

      {/* Text Editor */}
      <TextEditor id={params.id} fileName={snapshot?.data()?.fileName} />

      {/* Account Modal */}
      <AccountModal modalOpen={modalOpen} handleModalClose={handleModalClose} />

      {/* Word Count Modal */}
      {countModalOpen && (
        <WordCountModal
          modalOpen={countModalOpen}
          handleModalClose={handleWordCountClose}
        />
      )}

      {/* Dashboard Analytics Modal */}
      <DashboardAnalytics
        modalOpen={isDashboardModalOpen}
        handleModalClose={closeModal}
      />

      {/* 3D Statistics Modal */}
      <ChartModal
        modalOpen={statisticsModalOpen}
        handleModalClose={handle3DStatisticsClose}
      />
    </ThemeProvider>
  );
}
