// useAppState.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useAppState = () => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false); // Controls visibility of the create document modal
  const [input, setInput] = useState(''); // Document name input
  const [docs, setDocs] = useState([]); // List of documents
  const [selectedDoc, setSelectedDoc] = useState(null); // Currently selected document
  const [showOptionsModal, setShowOptionsModal] = useState(false); // Controls options modal
  const [newFileName, setNewFileName] = useState(''); // New file name input
  const [category, setCategory] = useState(''); // Selected category
  const [customCategory, setCustomCategory] = useState(''); // Custom category input
  const [isCustomCategory, setIsCustomCategory] = useState(false); // Flag for custom category
  const [hoveredDocId, setHoveredDocId] = useState(null); // ID of hovered document
  const [hoveredDocPreview, setHoveredDocPreview] = useState(''); // Preview text of hovered document
  const [description, setDescription] = useState(''); // Document description
  const [categories, setCategories] = useState([]); // List of available categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Currently selected category
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menus
  const [showCategoryModal, setShowCategoryModal] = useState(false); // Controls category selection modal
  
  const open = Boolean(anchorEl); // Checks if anchor element is open

  // Reset document input fields
  const resetDocumentFields = () => {
    setInput('');
    setCategory('');
    setCustomCategory('');
    setIsCustomCategory(false);
    setDescription('');
  };

  return {
    session,
    showModal,
    setShowModal,
    input,
    setInput,
    docs,
    setDocs,
    selectedDoc,
    setSelectedDoc,
    showOptionsModal,
    setShowOptionsModal,
    newFileName,
    setNewFileName,
    category,
    setCategory,
    customCategory,
    setCustomCategory,
    isCustomCategory,
    setIsCustomCategory,
    hoveredDocId,
    setHoveredDocId,
    hoveredDocPreview,
    setHoveredDocPreview,
    description,
    setDescription,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    anchorEl,
    setAnchorEl,
    showCategoryModal,
    setShowCategoryModal,
    open,
    resetDocumentFields, // Expose reset function
  };
};

export default useAppState;
