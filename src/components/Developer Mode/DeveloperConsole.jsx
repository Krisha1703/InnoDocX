import { useState, useEffect } from 'react';
import { EditorState, ContentState } from "draft-js";
import { useSession } from "next-auth/react";

const DeveloperConsole = ({ filename, editorState, setEditorState, wordCountState, sentenceCountState, characterCountState }) => {
  const { data: session } = useSession();

  const [consoleInput, setConsoleInput] = useState("");
  const [pathStack, setPathStack] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableAudiences, setAvailableAudiences] = useState([]);
  const [consoleLines, setConsoleLines] = useState(["All rights reserved by Krisha 2024"]);

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

  // Handle the "cd" command
  const handleCDCommand = (inputText, currentPath, newLines) => {
    const newDir = inputText.replace("cd ", "");

    if (newDir === "..") {
      if (pathStack.length > 1) {
        setPathStack((prev) => prev.slice(0, -1)); // Move to the previous directory
        currentPath = pathStack[pathStack.length - 2];
        newLines.push(`Moved up to directory: ${currentPath}`);
      } else {
        newLines.push("You are already at the root directory.");
      }
    } else if (newDir === "story") {
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
      const genre = pathStack[pathStack.length - 1].split("\\").pop();
      const message = `The ${genre} story for the target audience ${audience} has been selected.`;
      const contentState = editorState.getCurrentContent();
      const newContentState = ContentState.createFromText(contentState.getPlainText() + '\n' + message);
      setEditorState(EditorState.createWithContent(newContentState));
      newLines.push(message);
      setPathStack((prev) => [...prev, `${currentPath}\\${audience}`]);
    } else {
      newLines.push(`Unknown directory: ${newDir}`);
    }
    newLines.push(`${currentPath}>`);
  };

  // Handle the "cat" command 
  const handleCatCommand = (newLines) => {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText(); // Get plain text from the editor
    newLines.push(text ? text : "No content available in the editor."); // Push the content or a message if empty
  };

  // Handle the "look" command
  const handleLookCommand = (inputText, newLines) => {
    const searchWord = inputText.replace("look ", "").trim().toLowerCase();
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText().toLowerCase();
    const words = plainText.split(/\s+/).filter((word) => word.length > 0);

    const wordPositions = [];
    words.forEach((word, index) => {
      if (word === searchWord) {
        wordPositions.push(index + 1);
      }
    });

    if (wordPositions.length > 0) {
      newLines.push(`Found "${searchWord}" at word positions: ${wordPositions.join(", ")}`);
    } else {
      newLines.push(`"${searchWord}" could not be found in the text.`);
    }
  };

  // Handle the "wc" command (word count, sentence count, character count)
  const handleWCCommand = (newLines) => {
    newLines.push(`Word count: ${wordCountState}`, `Sentence count: ${sentenceCountState}`, `Character count: ${characterCountState}`);
  };

  // Handle the "clear" command
  const handleClearCommand = (setConsoleLines, setPathStack) => {
    const defaultState = [
      "All rights reserved by Krisha 2024",
      `C:\\${session.user.name}\\latest>`,
    ];

    setConsoleLines(defaultState);  // Reset console lines to default state
    setPathStack([`C:\\${session.user.name}\\latest`]); // Reset the pathStack to the initial path
  };

  // Handle the "echo" command
  const handleEchoCommand = (inputText, newLines) => {
    const contentToAdd = inputText.replace("echo ", "").trim(); // Remove "echo" and trim whitespace
    if (contentToAdd) {
      const newContent = editorState.getCurrentContent().getPlainText() + "\n" + contentToAdd;
      const newContentState = ContentState.createFromText(newContent);
      setEditorState(EditorState.createWithContent(newContentState));
      newLines.push(`Added to editor: ${contentToAdd}`); // Echo added content
    } else {
      newLines.push("No content to add.");
    }
  };

  // Handle the "rm" command to clear the editor (delete file content)
  const handleRMCommand = (newLines) => {
    const newContentState = ContentState.createFromText("");
    setEditorState(EditorState.createWithContent(newContentState));
    newLines.push("File content deleted.");
  };

  // Handle the "head" command to print the first 10 lines
  const handleHeadCommand = (newLines) => {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();
    const lines = text.split("\n").slice(0, 10);  // Get first 10 lines
    newLines.push(...lines, `Displayed first 10 lines of the file.`);
  };

  // Handle the "tail" command to print the last 10 lines
  const handleTailCommand = (newLines) => {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();
    const lines = text.split("\n").slice(-10);  // Get last 10 lines
    newLines.push(...lines, `Displayed last 10 lines of the file.`);
  };

  // Handle the "date" command to show current date
  const handleDateCommand = (newLines) => {
    const currentDate = new Date().toLocaleDateString();
    newLines.push(`Current date: ${currentDate}`);
  };

  // Handle the "time" command to show current time
  const handleTimeCommand = (newLines) => {
    const currentTime = new Date().toLocaleTimeString();
    newLines.push(`Current time: ${currentTime}`);
  };

  // Handle the "day" command to show current day of the week
  const handleDayCommand = (newLines) => {
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    newLines.push(`Today is: ${currentDay}`);
  };

  // Handle unknown command
  const handleUnknownCommand = (inputText, newLines) => {
    newLines.push(`Unknown command: ${inputText}`);
  };

  // Main command handler (updated to pass setPathStack)
  const handleEnterKey = (inputText, newLines, currentPath) => {
    if (inputText.startsWith("cd ")) {
      handleCDCommand(inputText, currentPath, newLines);
    } else if (inputText === "cat") {
      handleCatCommand(newLines); // Update here to use newLines
    } else if (inputText.startsWith("look ")) {
      handleLookCommand(inputText, newLines);
    } else if (inputText === "wc") {
      handleWCCommand(newLines);
    } else if (inputText === "rm") {
      handleRMCommand(newLines);
    } else if (inputText === "head") {
      handleHeadCommand(newLines);
    } else if (inputText === "tail") {
      handleTailCommand(newLines);
    } else if (inputText === "date") {
      handleDateCommand(newLines);
    } else if (inputText === "time") {
      handleTimeCommand(newLines);
    } else if (inputText === "day") {
      handleDayCommand(newLines);
    } else if (inputText === "clear") {
      handleClearCommand(setConsoleLines, setPathStack);  // Call clear function here
    } else if (inputText.startsWith("echo ")) {
      handleEchoCommand(inputText, newLines);
    } else {
      handleUnknownCommand(inputText, newLines);
    }

    return { newLines, currentPath };
  };

  // Handle input command in console
  const handleConsoleEnter = (e) => {
    if (e.key === "Enter") {
      const inputText = consoleInput.trim().toLowerCase();
      let newLines = [...consoleLines];
      let currentPath = pathStack[pathStack.length - 1];

      const updatedValues = handleEnterKey(inputText, newLines, currentPath);
      // Only set new console lines if the input was not "clear"
      if (inputText !== "clear") {
        setConsoleLines(updatedValues.newLines);
      }
      setConsoleInput(""); // Clear the input after pressing Enter
    }
  };

  return (
    <div className='text-sm p-4' style={{fontFamily: "monospace"}}>
      {consoleLines.map((line, index) => (
        <div key={index} className="text-white">{line}</div>
      ))}
      <div className="text-green-400">{`${pathStack[pathStack.length - 1]}>`} <span className="text-yellow-400">{consoleInput.includes("cd ") ? "cd " : ""}</span>{consoleInput.replace(/^cd\s/, '')}</div>
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
  );
};

export default DeveloperConsole;
