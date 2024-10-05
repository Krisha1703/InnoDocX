import { Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // Import Firebase instance
import useAppState from './useAppState';
import VoiceCreate from './VoiceCreate';
import { useContext, useEffect, useState } from 'react';
import  ThemeContext  from './ThemeContext'; // Import your ThemeContext

const CreateDocument = ({ showModal, setShowModal }) => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value
  const [docName, setDocName] = useState('');
  
  const {
    session,
    input,
    setInput,
    category,
    setCategory,
    customCategory,
    setCustomCategory,
    isCustomCategory,
    setIsCustomCategory,
    description,
    setDescription,
    resetDocumentFields,
  } = useAppState();

  const docCategories = [
    "Educational",
    "Business",
    "Health and Beauty",
    "Food and Spice",
    "Travel and Adventure",
    "Personal",
  ];

  // Close the modal and reset the fields
  const handleClose = () => {
    setShowModal(false);
    resetDocumentFields();
  };

  useEffect(() => {
    if (docName) {
      setInput(docName); // Set the filename based on voice input
    }
  }, [docName, setInput]);

  // Handle document creation
  const createDocument = async () => {
    if (!session) {
      toast.error("You must be logged in.");
      return;
    }
    if (!input) {
      toast.error("Document name is required.");
      return;
    }
    if (!category && !isCustomCategory) {
      toast.error("Category is required.");
      return;
    }
    if (!description) {
      toast.error("Description is required.");
      return;
    }

    const selectedCategory = isCustomCategory ? customCategory : category;

    try {
      const docRef = doc(collection(db, 'userDocs', session.user.email, 'docs'));
      await setDoc(docRef, {
        fileName: input,
        Category: selectedCategory,
        Description: description,
        createdAt: serverTimestamp(),
        openedAt: serverTimestamp(),
      });
      toast.success("Document created successfully!");
      handleClose(); // Close modal after creation
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Error creating document. Please try again.");
    }
  };

  return (
    <Modal open={showModal} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }} style={{ backgroundColor: isDarkMode ? '#333' : '#F8F9FA', opacity: 1 }}>
        <Typography variant="h6" component="h2">
          Enter name of the document
        </Typography>
        
        {/* Document name input */}
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Document name"
          InputProps={{
            style: {
              color: isDarkMode ? '#fff' : '#000', // Changes input text color
            },
          }}
        />

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ color: isDarkMode ? 'white' : 'black' }}>Category</InputLabel>
        <Select
          value={isCustomCategory ? '' : category}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setIsCustomCategory(true);
              setCustomCategory('');
            } else {
              setCategory(e.target.value);
              setIsCustomCategory(false);
            }
          }}
          slotProps={{
            input: {
              style: { color: isDarkMode ? 'white' : 'black' }, // Text color for select input
            },
          }}
          sx={{
            backgroundColor: isDarkMode ? '#333' : '#fff', // Dark theme bg color for select
            color: isDarkMode ? 'white' : 'black',         // Text color for selected option
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? 'gray' : 'black',  // Border color for select
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? 'gray' : 'black',  // Border color on hover
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: isDarkMode ? '#333' : '#fff',  // Background color for dropdown
                color: isDarkMode ? 'white' : 'black',          // Text color in dropdown
              },
            },
          }}
        >
          {docCategories.map((cat) => (
            <MenuItem
              key={cat}
              value={cat}
              sx={{
                backgroundColor: isDarkMode ? '#333' : 'white',   // Background for each item
                color: isDarkMode ? 'white' : 'black',            // Text color for each item
                '&:hover': {
                  backgroundColor: '#4B5563',                    // Hover background color (gray-700)
                },
                '&.Mui-selected': {
                  backgroundColor: '#4B5563',                    // Selected background color
                  color: 'white',                                // Selected text color
                  '&:hover': {
                    backgroundColor: '#4B5563',                  // Maintain hover bg even when selected
                  },
                },
              }}
            >
              {cat}
            </MenuItem>
          ))}
          <MenuItem
            value="custom"
            sx={{
              backgroundColor: isDarkMode ? '#333' : 'white',
              color: isDarkMode ? 'white' : 'black',
              '&:hover': {
                backgroundColor: '#4B5563',
              },
              '&.Mui-selected': {
                backgroundColor: '#4B5563',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#4B5563',
                },
              },
            }}
          >
            Custom Category
          </MenuItem>
        </Select>
      </FormControl>



        {/* Custom category input */}
        {isCustomCategory && (
          <TextField
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="Enter custom category"
            InputProps={{
              style: {
                color: isDarkMode ? '#fff' : '#000', // Changes input text color
              },
            }}
          />
        )}

        {/* Document description input */}
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Document description"
          multiline
          rows={3}
          InputProps={{
            style: {
              color: isDarkMode ? '#fff' : '#000', // Changes input text color
            },
          }}
        />

        {/* Action buttons */}
        <Box className="flex justify-between items-center" mt={2}>
        <VoiceCreate setDocName={setDocName} />
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button onClick={createDocument} variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateDocument;
