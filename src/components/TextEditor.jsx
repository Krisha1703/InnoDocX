import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState, useContext } from "react";
import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { setWordCount, setSentenceCount, setCharacterCount } from "./WordCount";
import Chat from "../components/Chat"
import DeveloperConsole from "./DeveloperConsole"
import FindAndReplaceModal from "./FindAndReplaceModal"
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
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  const [snapshot] = useDocumentOnce(
    session?.user?.email
      ? doc(collection(db, "userDocs", session?.user?.email, "docs"), id)
      : null
  );


  //Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [wordCountState, setWordCountState] = useState(0);
  const [sentenceCountState, setSentenceCountState] = useState(0);
  const [characterCountState, setCharacterCountState] = useState(0);

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
    const charCount = plainText.length;
    setCharacterCountState(charCount);
    setCharacterCount(charCount);

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
          // Handle image uploads
          resolve({ data: { link: reader.result } });
        } else if (fileType.startsWith('video/')) {
          // Handle video uploads
          resolve({ data: { link: reader.result } });
        } else if (fileType.startsWith('audio/')) {
          // Handle audio uploads
          resolve({ data: { link: reader.result } });
        } else if (fileType === 'application/vnd.ms-excel' || fileType === 'text/csv') {
          // Handle CSV or Excel uploads
          resolve({ data: { link: reader.result } }); // Modify this to handle Excel files if needed
        } else {
          reject(new Error('Unsupported file type'));
        }
      };
  
      reader.readAsDataURL(file);
    });
  };
  

  return (
    <div className={`min-h-screen pb-16`}>

      {/* Find And Replace Modal */}
      <FindAndReplaceModal editorState={editorState} setEditorState={setEditorState} session={session} id={id}/>
      
      {/* Text Editor And Toolbar Menus */}
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
              inDropdown: true, // Use dropdown for text alignment
              options: ['left', 'center', 'right', 'justify'], // Text alignment options
            },
            list: {
              inDropdown: true, // Use dropdown for list options
              options: ['unordered', 'ordered'], // List options
            },
            image: {
              uploadCallback: uploadMediaCallback, // Image upload function
            },
            video: {
              uploadCallback: uploadMediaCallback, // Video upload function
            },
            audio: {
              uploadCallback: uploadMediaCallback, // Audio upload function
            },
          }}
        />
        {/* Developer Console */}
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


      {/*<div className="z-50">
        <Chat />
      </div>*/}

    </div>
  );
}
