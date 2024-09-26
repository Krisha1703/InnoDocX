import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { setWordCount, setSentenceCount, setCharacterCount } from "./WordCount";
import { findAndReplace } from "./FindAndReplaceModal"; // Import findAndReplace 
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material"; // Dropdown icon

const Editor = dynamic(() =>
  import("react-draft-wysiwyg").then((mod) => mod.Editor),
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

  const [consoleInput, setConsoleInput] = useState("");
  const [pathStack, setPathStack] = useState([]); // Tracks directory structure
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableAudiences, setAvailableAudiences] = useState([]);
  const [consoleLines, setConsoleLines] = useState(["All rights reserved by Krisha 2024"]);

  const router = useRouter();
  const id = props.id;
  const filename = props.fileName;
  const { data: session } = useSession();

  // Initialize console with user's name and file path
  useEffect(() => {
    if (session?.user?.name && filename) {
      setConsoleLines([
        "All rights reserved by Krisha 2024",
        `C:\\${session.user.name}\\${filename}>`
      ]);
      setPathStack([`C:\\${session.user.name}\\${filename}`]); // Initialize path stack
    }
  }, [session?.user?.name, filename]);

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

  // Handle directory navigation based on user input
  const handleConsoleEnter = (e) => {
    if (e.key === "Enter") {
      const inputText = consoleInput.trim().toLowerCase();
      let newLines = [...consoleLines];
      let currentPath = pathStack[pathStack.length - 1];

      if (inputText === "cd ..") {
        // Go up one directory level
        if (pathStack.length > 1) {
          setPathStack((prev) => prev.slice(0, -1));
          currentPath = pathStack[pathStack.length - 2];
        }
        newLines.push(`> ${inputText}`, currentPath + ">");
      } else if (inputText.startsWith("cd ")) {
        // Handle navigation into new directories
        const newDir = inputText.replace("cd ", "");
        if (newDir === "story") {
          setAvailableGenres(["horror", "mystery", "fantasy"]);
          newLines.push(`Available genres: horror, mystery, fantasy`);
          setPathStack((prev) => [...prev, `${currentPath}\\${newDir}`]);
        } else if (availableGenres.includes(newDir)) {
          const genre = newDir;
          setAvailableAudiences(["kids", "children", "teens", "adults"]);
          newLines.push(`Available audiences for ${genre}: kids, children, teens, adults`);
          setPathStack((prev) => [...prev, `${currentPath}\\${genre}`]);
        } else if (availableAudiences.includes(newDir)) {
          const audience = newDir;
          const genre = pathStack[pathStack.length - 1].split("\\").pop(); // Get last selected genre
          const message = `The ${genre} story for the target audience ${audience} has been selected.`;
          const contentState = editorState.getCurrentContent();
          const newContentState = ContentState.createFromText(contentState.getPlainText() + '\n' + message);
          setEditorState(EditorState.createWithContent(newContentState));
          newLines.push(message);
          setPathStack((prev) => [...prev, `${currentPath}\\${audience}`]);
        } else {
          newLines.push(`Unknown directory: ${newDir}`);
        }
        currentPath = pathStack[pathStack.length - 1];
        newLines.push(`> ${inputText}`, `${currentPath}>`);
      } else if (inputText === "clear") {
        newLines = ["All rights reserved by Krisha 2024", `C:\\${session?.user?.name}\\${filename}>`];
        setPathStack([`C:\\${session?.user?.name}\\${filename}`]); // Reset path
      } else if (inputText === "ls") {
        const content = editorState.getCurrentContent().getPlainText();
        newLines.push(`> ${inputText}`, `Content in editor: ${content}`);
      } else if (inputText.startsWith("cat ")) {
        const contentToAdd = inputText.replace("cat ", "");
        const newContent = editorState.getCurrentContent().getPlainText() + "\n" + contentToAdd;
        const newContentState = ContentState.createFromText(newContent);
        setEditorState(EditorState.createWithContent(newContentState));
        newLines.push(`> ${inputText}`, `Added to editor: ${contentToAdd}`);
      } else {
        newLines.push(`> ${inputText}`, `Unknown command: ${inputText}`);
      }

      setConsoleLines(newLines);
      setConsoleInput(""); // Clear the input after pressing Enter
    }
  };

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
        toolbarClassName="custom-toolbar flex sticky top-0 !justify-center mx-5 px-4 py-2 !rounded-full !bg-[#E8F0FE]"
        editorClassName="custom-editor fixed left-10 right-10 mt-6 p-10 bg-white shadow-lg w-11/12 max-w-full mx-auto mb-12 border min-h-screen"
      />

      {/* Console Structure */}
      <div className="console-container absolute top-[200vh]  z-20 w-10/12 left-20" style={{ backgroundColor: "#1e1e1e", color: "#00ff00", padding: "10px", borderRadius: "5px", marginTop: "20px", fontFamily: "monospace" }}>
        {consoleLines.map((line, index) => (
          <div key={index} className="text-white">{line}</div>
        ))}
        <div className="text-green-400">{`${pathStack[pathStack.length - 1]}>`} <span className="text-yellow-400">{consoleInput.includes("cd ") ? "cd" : ""}</span>{consoleInput.replace(/^cd\s/, '')}</div>
        <input
          type="text"
          value={consoleInput}
          onChange={(e) => setConsoleInput(e.target.value)}
          onKeyDown={handleConsoleEnter}
          style={{
            backgroundColor: "transparent",
            color: "#00ff00",
            border: "none",
            outline: "none",
            width: "90%",
          }}
        />
      </div>
    </div>
  );
}
