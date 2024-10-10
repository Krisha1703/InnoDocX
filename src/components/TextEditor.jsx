import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState, useContext } from "react";
import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { setWordCount, setSentenceCount, setCharacterCount, setUniqueCount } from "./WordCount";
import Chat from "../components/Chat";
import DeveloperConsole from "./DeveloperConsole";
import FindAndReplaceModal from "./FindAndReplaceModal";
import ThemeContext from "@/components/ThemeContext";

const Editor = dynamic(() =>
  import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function TextEditor(props) {
  const router = useRouter();
  const id = props.id;
  const filename = props.fileName;
  const { data: session } = useSession();
  const { isDarkMode } = useContext(ThemeContext);

  const [snapshot] = useDocumentOnce(
    session?.user?.email
      ? doc(collection(db, "userDocs", session?.user?.email, "docs"), id)
      : null
  );

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [wordCountState, setWordCountState] = useState(0);
  const [sentenceCountState, setSentenceCountState] = useState(0);
  const [characterCountState, setCharacterCountState] = useState(0);
  const [uniqueCountState, setUniqueCountState] = useState(0);
  const [averageReadingTime, setAverageReadingTime] = useState(0);

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  const onEditorStateChange = async (editorState) => {
    setEditorState(editorState);
    const plainText = editorState.getCurrentContent().getPlainText();

    // Calculate word count and sentences count
    const sentences = plainText.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
    setSentenceCountState(sentences.length);
    setSentenceCount(sentences.length);

    const charCount = plainText.length;
    setCharacterCountState(charCount);
    setCharacterCount(charCount);

    // Fetch tokens from API for word count
const response = await fetch('/api/preprocess', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: plainText }),
});

    
if (response.ok) {
  try {
    const data = await response.json();
    const { tokens, wordCount, uniqueWordCount, uniqueTokens } = data;

    // Console logging for debugging
    console.log('Tokenized Words:', tokens); // Log tokenized words
    console.log('Word Count:', wordCount); // Log total word count
    console.log('Unique Word Count:', uniqueWordCount); // Log unique word count
    console.log('Unique Tokens:', uniqueTokens); // Log unique tokens

    // Update state with fetched values
    setWordCountState(wordCount); // Set word count state
    setWordCount(wordCount); // Save word count

    setUniqueCountState(uniqueWordCount);
    console.log('Unique Count State updated to:', uniqueCountState);
    setUniqueCount(uniqueWordCount);

  } catch (error) {
    console.error('Error parsing JSON:', error); // Debug JSON parsing errors
  }
} else {
  // Handle non-200 responses
  console.error('Fetch error:', response.status, response.statusText); // Log fetch errors
}

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

  const uploadMediaCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = file.type;
        if (fileType.startsWith('image/')) {
          resolve({ data: { link: reader.result } });
        } else if (fileType.startsWith('video/')) {
          resolve({ data: { link: reader.result } });
        } else if (fileType.startsWith('audio/')) {
          resolve({ data: { link: reader.result } });
        } else if (fileType === 'application/vnd.ms-excel' || fileType === 'text/csv') {
          resolve({ data: { link: reader.result } });
        } else {
          reject(new Error('Unsupported file type'));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={`min-h-screen pb-16`}>
      <FindAndReplaceModal editorState={editorState} setEditorState={setEditorState} session={session} id={id} />
      
      <div className={`flex flex-col relative`}>
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbarClassName={`custom-toolbar z-10 sticky top-0 !justify-center mx-5 px-4 py-2 !rounded-full ${isDarkMode ? '!bg-black' : '!bg-[#E8F0FE]'} `}
          editorClassName={`custom-editor p-10  shadow-lg w-11/12 max-w-full mx-auto mb-2 border min-h-[70vh] relative`}
          toolbar={{
            options: [
              'inline', 
              'blockType', 
              'fontSize', 
              'fontFamily', 
              'colorPicker', 
              'link', 
              'image', 
              'list', 
              'textAlign', 
              'remove', 
              'history'
            ],
            textAlign: {
              inDropdown: true,
              options: ['left', 'center', 'right', 'justify'],
            },
            list: {
              inDropdown: true,
              options: ['unordered', 'ordered'],
            },
            image: {
              uploadCallback: uploadMediaCallback,
            },
            video: {
              uploadCallback: uploadMediaCallback,
            },
            audio: {
              uploadCallback: uploadMediaCallback,
            },
          }}
        />
        
        {isDarkMode && (
          <div className="developer-console-container fixed bottom-0 left-0 right-0 w-11/12 mx-auto bg-[#1e1e1e] text-green-400 p-2 overflow-y-auto max-h-[25vh]">
            <DeveloperConsole
              filename={filename}
              editorState={editorState}
              setEditorState={setEditorState}
              wordCountState={wordCountState}
              sentenceCountState={sentenceCountState}
              characterCountState={characterCountState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
