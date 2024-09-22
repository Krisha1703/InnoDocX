import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { setWordCount, setSentenceCount, setCharacterCount } from "./WordCount";
import { findAndReplace } from "./FindAndReplaceModal"; // Import findAndReplace function
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material"; // Dropdown icon

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function TextEditor(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [wordCountState, setWordCountState] = useState(0);
  const [sentenceCountState, setSentenceCountState] = useState(0);
  const [characterCountState, setCharacterCountState] = useState(0);
  const [findWord, setFindWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false); // State for modal visibility

  const router = useRouter();
  const id = props.id;
  const { data: session } = useSession();

  const [snapshot] = useDocumentOnce(
    session?.user?.email
      ? doc(collection(db, "userDocs", session?.user?.email, "docs"), id)
      : null
  );

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    // Extract text from the editor state
    const plainText = editorState.getCurrentContent().getPlainText();

    // Calculate word count
    const words = plainText.trim().split(/\s+/).filter((word) => word.length > 0);
    setWordCountState(words.length);
    setWordCount(words.length);

    // Calculate sentence count
    const sentences = plainText.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
    setSentenceCountState(sentences.length);
    setSentenceCount(sentences.length);

    // Calculate character count (including spaces)
    setCharacterCount(plainText.length);

    // Save editor state to Firestore
    setDoc(
      doc(collection(db, "userDocs", session?.user?.email, "docs"), id),
      {
        editorState: convertToRaw(editorState.getCurrentContent()),
      },
      {
        merge: true,
      }
    );
  };

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
    <div className="min-h-screen pb-16">
      <Box sx={{ padding: 1, backgroundColor: '#f9f9f9', borderRadius: 1, marginBottom: 2 }}>
        <Typography variant="p" gutterBottom>
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

      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="custom-toolbar flex sticky top-0 -z-10  !justify-center mx-5 px-4 py-2 !rounded-full !bg-[#E8F0FE]"
        editorClassName="custom-editor mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border min-h-screen"
      />
    </div>
  );
}
