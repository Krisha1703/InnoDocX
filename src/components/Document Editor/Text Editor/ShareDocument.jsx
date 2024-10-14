import { useState, useContext } from "react";
import { db } from "../../firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import ThemeContext from "../../Developer Mode/ThemeContext";
import { Button } from '@mui/material'; 
import Lock from '@mui/icons-material/Lock'; 

const ShareDoc = ({ id, userEmail }) => {
  const [emailToShare, setEmailToShare] = useState("");
  const [shareDoc, setShareDoc] = useState(false);
  const { isDarkMode } = useContext(ThemeContext); 

  const handleShareDocument = async () => {
    // Check if the emailToShare is not empty
    if (!emailToShare) {
      toast.error("Please enter an email to share the document.");
      return;
    }

    try {
      // Check if the user to share with exists
      const userDocRef = doc(db, "userDocs", emailToShare);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        toast.error("User does not exist. Please enter a valid email.");
        return;
      }

      // Get the document that you want to share from user1's Firestore
      const docRef = doc(db, "userDocs", userEmail, "docs", id);
      const docSnapshot = await getDoc(docRef);

      // If the document exists, proceed
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();

        // Create the document for user2 with the same ID
        const user2DocRef = doc(db, "userDocs", emailToShare, "docs", id);

        // Set the document data for user2, with the sharedWith field updated
        await setDoc(user2DocRef, {
          ...docData,
          sharedWith: userEmail, // Indicate that user1 shared this document
          sharedAt: new Date(),
        });

        // Update user1's sharedWith field for the original document
        await setDoc(docRef, {
          ...docData,
          sharedWith: emailToShare, // Indicate that the document was shared with user2
          sharedAt: new Date(),
        }, { merge: true });

        toast.success(`Document shared successfully with ${emailToShare}`);
        setEmailToShare(""); // Clear input field
        setShareDoc(false);
      } else {
        toast.error("Document does not exist.");
      }
    } catch (error) {
      console.error("Error sharing document: ", error);
      toast.error("Error sharing document. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={`mr-1 flex space-x-2 w-1/7 p-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#bbdcf2]'} cursor-pointer z-20`}>
        <Lock />
        <h2 onClick={() => { console.log('Share button clicked'); setShareDoc(true); }}> Share</h2>

        {shareDoc && (
          <div className={`absolute top-20 right-10 w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-md shadow-md`}>
            <p>Share this document:</p>

            <input
              type="email"
              value={emailToShare}
              onChange={(e) => setEmailToShare(e.target.value)}
              placeholder="Enter email to share"
              className={`border ${isDarkMode ? 'bg-gray-700' : ''} p-2 w-full mt-[1vw]`}
            />
        
            <div className="flex justify-between">
              <Button variant="contained" color="primary" onClick={handleShareDocument} sx={{ marginTop: "1vw" }}>Share</Button>
              <Button variant="contained" color="primary" onClick={() => setShareDoc(false)} sx={{ marginTop: "1vw" }}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShareDoc;
