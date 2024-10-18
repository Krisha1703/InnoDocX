# InnoDocX

## Overview

**InnoDocX** is a full-featured document management application inspired by Google Docs with advanced developer tools, voice-enabled interactions, and rich text analytics. Users can create, manage, and edit documents effortlessly while leveraging user authentication, developer mode with terminal commands, voice-assisted document creation, and more.

## Features

### 1. Developer Mode (Dark Mode)
- Activates a developer console panel with commands for file navigation and management, including:
  - `cd`: Navigate file directories.
  - `look`: Search for a word/phrase in the document and retrieve its position.
  - `clear`: Clear the console screen.
  - `cat`: Display the document content in the terminal.
  - `wc`: Display word, sentence, and character count.
  - `echo`: Add text to the document content.
  - `rm`: Delete document content.
  - `head`: Display the first 10 lines of the document.
  - `tail`: Display the last 10 lines of the document.
  - `date`: Show the current date.
  - `time`: Show the current time.
  - `day`: Show the current day.

### 2. User Authentication and Account Management
- Secure user login and account management to provide personalized document storage and retrieval.

### 3. Voice-Enabled Search and Document Management
- Use voice commands to search for documents, create new documents, and perform other actions.
- A search query in the header allows users to quickly search for documents, including using voice input.

### 4. Voice Assistant for Document Creation
- The voice assistant helps create new documents by guiding users through the process of:
  - Entering a filename.
  - Selecting predefined categories from a dropdown or creating custom categories.
  - Adding a brief description of the document.

### 5. Interactive Hero Section
- Includes a text-scrolling effect to enhance the user experience and make the landing page more dynamic and engaging.

### 6. Document Management
- Create, rename, delete, and share documents with other users.
- Share documents via email for real-time collaboration.

### 7. Document Sorting and Filtering
- Sort documents based on filename, creation date, and last updated date.
- Filter documents by category for easy organization.

### 8. File Preview and Hover Effects
- Hovering over a document in the document list displays a brief description of the document.

### 9. File Renaming
- Allows renaming files directly from the header of the document editor.

### 10. Toolbar Menus
- **View**: Control the editor screen size with fit, 50%, 75%, and 100% view options.
- **Format**: Set the page orientation to portrait or landscape.
- **Tool**: View word, sentence, and character counts.
- **Extension**: 3D bar chart and advanced analytics dashboard that includes:
  - **Total Words**: Count of total words in the document.
  - **Unique Words**: Unique word count after tokenization, lowercasing, and removal of stop words.
  - **Total Sentences**: Count of sentences in the document.
  - **Average Reading Time**: Estimated based on 250 words per minute.
  - **Word Frequency Chart**: A bar chart displaying the top 10 unique words with the highest frequency.
  - **POS Tagging Pie Chart**: Part-of-speech tagging pie chart showing distribution of nouns, verbs, and other parts of speech.
  - **Text Sentiment Analysis**: A gauge chart showing the sentiment score of the text.
  - **Text Summary**: An automatically generated summary of the document content.

### 11. Find and Replace
- A powerful find and replace feature that allows users to search for specific words/phrases in the document and replace them as needed.

### 12. Notifications
- **Toast Notifications**: Users receive notifications on important actions like file renaming, deletion, and sharing.

## Installation

1. Clone the repository:
   ```bash
   https://github.com/Krisha1703/InnoDocX.git
2. Navigate to the project directory:
    ```bash
    cd InnoDocX
3. Install the dependencies:
    ```bash
    npm install
4. Start the application:
    ```bash
    npm run dev

