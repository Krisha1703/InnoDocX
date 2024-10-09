import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { doc, setDoc, collection } from "firebase/firestore";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { db } from "./firebase"; // Adjust this import to match your project structure
import ThemeContext from "@/components/ThemeContext";


const findAndReplace = (text, findWord, replaceWord) => {
  const regex = new RegExp(findWord, "g");
  return text.replace(regex, replaceWord);
};

const FindAndReplaceModal = ({ editorState, setEditorState, id, session }) => {
  const [findWord, setFindWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);

  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  const handleFindAndReplace = () => {
    const plainText = editorState.getCurrentContent().getPlainText();
    const newText = findAndReplace(plainText, findWord, replaceWord);

    // Convert the modified plain text back to ContentState
    const newContentState = ContentState.createFromText(newText);
    const newEditorState = EditorState.createWithContent(newContentState);
    setEditorState(newEditorState);

    // Save the updated editor state to Firestore
    setDoc(
      doc(collection(db, "userDocs", session?.user?.email, "docs"), id),
      {
        editorState: convertToRaw(newContentState), // Save the raw content state
      },
      {
        merge: true,
      }
    );
  };

  const toggleModalVisibility = () => {
    setShowFindReplaceModal(!showFindReplaceModal); // Toggle modal visibility
  };

  return (
    <Box sx={{ padding: 1, backgroundColor: isDarkMode ? "#333333" : "#f9f9f9", borderRadius: 1, marginBottom: 2 }}>
      <Typography variant="body1" gutterBottom>
        Find and Replace
        <IconButton onClick={toggleModalVisibility} sx={{ ml: 1 }}>
          <ArrowDropDownIcon sx={{color: isDarkMode ? "white" : "black"}}/>
        </IconButton>
      </Typography>

      {showFindReplaceModal && (
        <>
          <TextField
            label="Find"
            variant="outlined"
            value={findWord}
            onChange={(e) => setFindWord(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              sx: {
                color: isDarkMode ? "white" : "black", // Change input text color based on dark mode
              },
            }}
            InputLabelProps={{
              sx: {
                color: isDarkMode ? "white" : "black", // Change label color based on dark mode
              },
            }}

            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? "white" : "black", // Border color based on dark mode
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? "white" : "black", // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? "white" : "black", // Border color when focused
                },
              },
            }}
          />
          <TextField
            label="Replace with"
            variant="outlined"
            value={replaceWord}
            onChange={(e) => setReplaceWord(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              sx: {
                color: isDarkMode ? "white" : "black", // Change input text color based on dark mode
              },
            }}
            InputLabelProps={{
              sx: {
                color: isDarkMode ? "white" : "black", // Change label color based on dark mode
              },
            }}

            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? "white" : "black", // Border color based on dark mode
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? "white" : "black", // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? "white" : "black", // Border color when focused
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFindAndReplace}
            sx={{ marginTop: 2 }}
          >
            Find and Replace
          </Button>
        </>
      )}
    </Box>
  );
};

export default FindAndReplaceModal;
