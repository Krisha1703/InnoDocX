import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { doc, setDoc, collection } from "firebase/firestore";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { db } from "./firebase"; // Adjust this import to match your project structure

const findAndReplace = (text, findWord, replaceWord) => {
  const regex = new RegExp(findWord, "g");
  return text.replace(regex, replaceWord);
};

const FindAndReplaceModal = ({ editorState, setEditorState, id, session }) => {
  const [findWord, setFindWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);

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
    <Box sx={{ padding: 1, backgroundColor: "#f9f9f9", borderRadius: 1, marginBottom: 2 }}>
      <Typography variant="body1" gutterBottom>
        Find and Replace
        <IconButton onClick={toggleModalVisibility} sx={{ ml: 1 }}>
          <ArrowDropDownIcon />
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
          />
          <TextField
            label="Replace with"
            variant="outlined"
            value={replaceWord}
            onChange={(e) => setReplaceWord(e.target.value)}
            fullWidth
            margin="normal"
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
