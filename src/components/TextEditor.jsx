import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState, useContext } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import {useSummary} from 'use-react-summary';
import { setWordCount, setSentenceCount, setCharacterCount, setUniqueCount, setAverageReadingTime, averageReadingTime } from "./WordCount";
import DeveloperConsole from "./DeveloperConsole";
import FindAndReplaceModal from "./FindAndReplaceModal";
import ThemeContext from "@/components/ThemeContext";

// Dynamic import of the editor component
const Editor = dynamic(() =>
  import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

// Exported array for word frequencies
let wordFrequencyArray = []; 

export const useWordFrequencyArray = () => {
  return wordFrequencyArray; // Custom hook to access word frequency array
};

// Exported array for POS data
let posDataArray = []; 

export const usePosDataArray = () => {
  return posDataArray; // Custom hook to access POS data array
};

// Object to hold the sentiment values
export const sentimentData = {
  sentimentCategory: "",
  sentimentScore: 0,
};

// Function to update the sentiment values
export const updateSentiment = (category, score) => {
  sentimentData.sentimentCategory = category;
  sentimentData.sentimentScore = score;
};

//Exporting text summary
let summarizedText = "";
// Function to update the summarized text
export const setSummarizedText = (text) => {
  summarizedText = text;
};

// Function to get the summarized text
export const getSummarizedText = () => {
  return summarizedText;
};


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
  const [averageReadingTimeState, setAverageReadingTimeState] = useState(0);


  const plainText = editorState.getCurrentContent().getPlainText();
  const { summarizeText } = useSummary({ text: plainText, words: 50 });

  useEffect(() => {
    if (summarizeText) {
      setSummarizedText(summarizeText);
    }
  }, [summarizeText]);

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);
  
  //Handling Sentiment Analyzing API
  const handleSentiment = async (currentText) => {
    try {
      const responseSentiment = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: currentText }),
      });
  
      const sentimentData = await responseSentiment.json();
      const { score, sentimentType } = sentimentData;
      updateSentiment(sentimentType, score);

    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    }
  };
  

  const onEditorStateChange = async (editorState) => {
    setEditorState(editorState);

    //Summarizing text
    const summary = summarizeText 
    setSummarizedText(summary); 
    
    handleSentiment(plainText); // Trigger sentiment analysis

    // Calculate sentences count
    const sentences = plainText.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
    setSentenceCountState(sentences.length);
    setSentenceCount(sentences.length);

    // Calculate characters count
    const charCount = plainText.length;
    setCharacterCountState(charCount);
    setCharacterCount(charCount);

    //Handling Text Preprocessing API - Tokenization, Stopwords Removal, and Filtering
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
        const { tokens, wordCount, uniqueWordCount } = data;

        setWordCountState(wordCount);
        setWordCount(wordCount);

        setUniqueCountState(uniqueWordCount);
        setUniqueCount(uniqueWordCount);

        setAverageReadingTimeState(averageReadingTime);
        setAverageReadingTime(averageReadingTime);

        // Create a word frequency array
        const wordFrequencyMap = new Map();

        tokens.forEach((token) => {
          const lowerWord = token.toLowerCase();
          wordFrequencyMap.set(lowerWord, (wordFrequencyMap.get(lowerWord) || 0) + 1);
        });

        wordFrequencyArray = Array.from(wordFrequencyMap.entries())
          .map(([token, count]) => ({ token, frequency: count })) // Convert to array of objects
          .sort((a, b) => b.frequency - a.frequency) // Sort by frequency descending
          .slice(0, 10); // Get the top 10 entries

      } catch (error) {
          console.error('Error parsing JSON:', error);
        }
    } else {
      console.error('Fetch error:', response.status, response.statusText);
    }

    //Handling Part-of-Speech Tagging API - Noun, Pronoun, Adjective, Verb, and more
    const responsePOS = await fetch('/api/pos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: plainText }),
    });

    if (responsePOS.ok) {
      try {
        const posData = await responsePOS.json();

        // Convert the count object to an array of objects
        posDataArray = Object.entries(posData).map(([pos, count]) => ({
          pos,
          count,
        }));

      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('Fetch error:', responsePOS.status, responsePOS.statusText);
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
        resolve({ data: { link: reader.result } });
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
          editorClassName={`custom-editor p-10 shadow-lg w-11/12 max-w-full mx-auto mb-2 border min-h-[70vh] relative`}
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
          }}
        />

        {isDarkMode && (
          <div className="developer-console-container fixed bottom-0 left-0 right-0 w-11/12 mx-auto bg-[#1e1e1e] text-green-400 p-2 overflow-y-auto max-h-[25vh]">
            <DeveloperConsole
              filename={filename}
              wordCount={wordCountState}
              sentenceCount={sentenceCountState}
              characterCount={characterCountState}
              uniqueCount={uniqueCountState}
              averageReadingTime={averageReadingTimeState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
