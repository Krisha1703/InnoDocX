import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase'; // Import Firebase instance
import { useState } from 'react';
import useAppState from './useAppState';
import { useContext } from 'react';
import  ThemeContext  from './ThemeContext'; // Import your ThemeContext

const EditDocument = ({ showOptionsModal, setShowOptionsModal, selectedDoc }) => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value
    const {
        session
    } = useAppState();

  const [newFileName, setNewFileName] = useState(selectedDoc?.fileName || '');

  // Close the modal and reset the fields
  const handleClose = () => {
    setShowOptionsModal(false);
    setNewFileName('');
  };

  const renameDocument = async () => {
    if (!newFileName) {
      toast.error("File name cannot be empty.");
      return;
    }
    try {
    const docRef = doc(db, 'userDocs', session.user.email, 'docs', selectedDoc.id);
      await setDoc(docRef, { ...selectedDoc, fileName: newFileName }, { merge: true });
      toast.success("Successfully renamed the document");
      handleClose(); // Close the modal after renaming
    } catch (error) {
      console.error("Error renaming document:", error);
      toast.error("Error renaming document");
    }
  };

  const deleteDocument = async () => {
    try {
      const docRef = doc(db, 'userDocs', session.user.email, 'docs', selectedDoc.id);
      await deleteDoc(docRef);
      toast.success("Successfully deleted the document");
      handleClose(); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error deleting document");
    }
  };

  return (
    <Modal open={showOptionsModal} onClose={handleClose}  >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }} style={{ backgroundColor: isDarkMode ? '#333' : '#F8F9FA', opacity: 1 }}>
        <Typography variant="h6" component="h2">
         Edit Document
        </Typography>
        
        {/* Input to rename document */}
        <TextField
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="New file name"
          InputProps={{
            style: {
              color: isDarkMode ? '#fff' : '#000', // Changes input text color
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDarkMode ? '#fff' : '#000', // Changes border color based on theme
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#fff' : '#000', // Changes border color on hover
              },
            },
          }}
        />

        <Box className="flex justify-end gap-4 items-center">
          <Button onClick={renameDocument} variant="contained" color="primary" >
            Rename
          </Button>
          <Button onClick={deleteDocument} variant="contained" sx={{ backgroundColor: "red" }}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditDocument;
