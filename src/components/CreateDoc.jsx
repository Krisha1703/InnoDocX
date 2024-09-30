import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';
import { Button, Modal, Box, Typography, TextField, Select, MenuItem, Menu, InputLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { useSession } from "next-auth/react";
import { db } from './firebase';
import Link from 'next/link';
import { Folder } from '@mui/icons-material';
import {Canvas} from '@react-three/fiber'
import ScrollTrigger from "./ScrollTrigger"
import { OrbitControls } from '@react-three/drei';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; 
import { doc, setDoc, collection, getDocs, orderBy, query, serverTimestamp, deleteDoc } from 'firebase/firestore';

// Helper function to format the date
const formatDate = (date) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options);
};


export default function CreateDoc() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [hoveredDocId, setHoveredDocId] = useState(null); // State for hovered document
  const [hoveredDocPreview, setHoveredDocPreview] = useState(''); // State for hover preview
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const [showCategoryModal, setShowCategoryModal] = useState(false); // For modal
  const open = Boolean(anchorEl);


  const doc_categories = [
    "Educational",
    "Business",
    "Health and Beauty",
    "Food and Spice",
    "Travel and Adventure",
    "Personal"
  ];

  const createDocument = async () => {
    if (!session) {
    toast.error("You must be logged in.");
    return;
  }
  if (!input) {
    toast.error("Document name is required.");
    return;
  }
  if (!category) {
    toast.error("Category is required.");
    return;
  }
  if (!description) {
    toast.error("Description is required.");
    return;
  }
    const selectedCategory = isCustomCategory ? customCategory : category;

    try {
      const docRef = doc(collection(db, 'userDocs', session.user.email, 'docs'));
      await setDoc(docRef, {
        fileName: input,
        Category: selectedCategory,
        Description: description, 
        createdAt: serverTimestamp(),
        openedAt: serverTimestamp(),
      });
      setShowModal(false);
      setInput('');
      setCategory('');
      setCustomCategory('');
      setIsCustomCategory(false);
      fetchDocuments();
      toast.success("Document created successfully!");
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Error creating document. Please try again."); 
    }
  };

  const fetchDocuments = async (filterCategory = '') => {
    if (session) {
      try {
        const q = query(
          collection(db, 'userDocs', session.user.email, 'docs'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(filterCategory ? documents.filter(doc => doc.Category === filterCategory) : documents);

        // Extract unique categories from documents
        const uniqueCategories = [...new Set(documents.map(doc => doc.Category))];
        setCategories(uniqueCategories);
        if (filterCategory) {
          toast.success(`Filtered documents by category: ${filterCategory}`);
        } 
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Error fetching documents");
      }
    }
  };
  

  useEffect(() => {
    if (session) {
      fetchDocuments();
    }
  }, [session]);

  const handleClose = () => {
    setShowModal(false);
    setShowOptionsModal(false);
    setCategory('');
    setCustomCategory('');
    setIsCustomCategory(false);
    setHoveredDocId(null);
    setHoveredDocPreview('');
    setAnchorEl(false);
  };

  const handleOptionsClick = (doc) => {
    setSelectedDoc(doc);
    setNewFileName(doc.fileName);
    setShowOptionsModal(true);
  };

  const renameDocument = async () => {
    if (selectedDoc) {
      if (!newFileName) {
        toast.error("File name cannot be empty.");
        return;
      }
      try {
        const docRef = doc(db, 'userDocs', session.user.email, 'docs', selectedDoc.id);
        await setDoc(docRef, {
          ...selectedDoc,
          fileName: newFileName,
        }, { merge: true });
        setShowOptionsModal(false);
        fetchDocuments();
        toast.success("Successfuly renamed the document");
      } catch (error) {
        console.error("Error renaming document:", error);
        toast.error("Error renaming document");
      }
    }
  };

  const deleteDocument = async () => {
    if (selectedDoc) {
      try {
        const docRef = doc(db, 'userDocs', session.user.email, 'docs', selectedDoc.id);
        await deleteDoc(docRef);
        setShowOptionsModal(false);
        fetchDocuments();
        toast.success("Successfuly deleted the document");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Error deleting document");
      }
    }
  };

  const updateDocumentTimestamp = async (docId) => {
    try {
      const docRef = doc(db, 'userDocs', session.user.email, 'docs', docId);
      await setDoc(docRef, {
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating document timestamp:", error);
      toast.error("Error updating document");
    }
  };

  const handleCategoryClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

    // Handle selecting a category
    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
      fetchDocuments(category); // Fetch only documents with the selected category
      handleClose(); // Close the dropdown
    };

  // Modal to display categories
  const categoryModal = (
    <Modal open={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}>
        <Typography variant="h6" component="h2">Select Category</Typography>
        {categories.map((cat) => (
          <MenuItem key={cat} onClick={() => handleCategorySelect(cat)}>
            {cat}
          </MenuItem>
        ))}
      </Box>
    </Modal>
  );

  const handleMouseEnter = (doc) => {
    setHoveredDocId(doc.id);
    setHoveredDocPreview(doc.Description); 
  };

  const handleMouseLeave = () => {
    setHoveredDocId(null);
    setHoveredDocPreview('');
  };

  const modal = (
    <Modal open={showModal} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}>
        <Typography variant="h6" component="h2">
          Enter name of the document
        </Typography>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Document name"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={isCustomCategory ? '' : category}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setIsCustomCategory(true);
                setCustomCategory('');
              } else {
                setCategory(e.target.value);
                setIsCustomCategory(false);
              }
            }}
          >
            {doc_categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
            <MenuItem value="custom">Custom Category</MenuItem>
          </Select>
        </FormControl>

        {isCustomCategory && (
          <TextField
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="Enter custom category"
          />
        )}

        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Document description"
          multiline
          rows={3}
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={handleClose} variant="contained" color="white" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={createDocument} variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const optionsModal = (
    <Modal open={showOptionsModal} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}>
        <Typography variant="h6" component="h2">
          Options for {selectedDoc?.fileName}
        </Typography>
        <TextField
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="New file name"
        />
        <Box display="flex" flexDirection="column" mt={2}>
          <Button onClick={renameDocument} variant="contained" color="primary" sx={{ mb: 1 }}>
            Rename
          </Button>
          <Button onClick={deleteDocument} variant="contained" sx={{backgroundColor: "red"}}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <section className=''>
      <ToastContainer />
      <div className="bg-[#F8F9FA] pb-10 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700">Start a new document</h2>
            <MoreVertIcon />
          </div>
         
          <div className="flex justify-between items-center">
            <div>
              <Image
                src="/createdoc.png"
                width={200}
                height={200}
                alt="createdoc"
                className='cursor-pointer border-0 hover:border-2 hover:border-blue-500'
                onClick={() => setShowModal(true)}
              />
              {modal}
              <p className="font-medium py-3 text-md">Blank document</p>
             </div>
            <div className="flex-grow mx-4"> {/* Add a wrapper with flex-grow to make space for ScrollTrigger */}
              <ScrollTrigger />
            </div>
          </div>

        
        </div>

      </div>

      <div className="ml-[10vw] p-8">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 w-full px-4 mb-4">
          <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('fileName', 'asc')}>My Documents</p>
          <div className='flex'>
            <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('Category', 'asc')}>Category</p>
            <Button
              onClick={handleCategoryClick}
              endIcon={<ArrowDropDown />}
              style={{ minWidth: 0, padding: 0, color: "black"}}
            />
          </div>
          {/* Dropdown Menu for Categories */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleCategorySelect('')}>All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} onClick={() => handleCategorySelect(category)}>
                {category}
              </MenuItem>
            ))}
          </Menu>
          <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('createdAt', 'asc')}>Date Created</p>
          <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('updatedAt', 'asc')}>Last Opened</p>
          <p className="font-medium cursor-pointer"><Folder /></p>
        </div>

        {/* Document Rows */}
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              onMouseEnter={() => handleMouseEnter(doc)}
              onMouseLeave={handleMouseLeave}
              className="grid grid-cols-5 gap-4 w-10/12 p-4 py-2 rounded-full hover:bg-[#E8F0FE] cursor-pointer"
              onClick={() => updateDocumentTimestamp(doc.id)}
            >
              <Link href={`/doc/${doc.id}`} passHref>
                <div className="flex items-center space-x-4">
                  <Image src="/docs.png" width={20} height={20} alt="Document Icon" className='scale-75' />
                  <p className="text-md">{doc.fileName}</p>
                </div>
              </Link>
              <p className="text-md ml-10 text-nowrap">{doc.Category}</p>
              
              <p className="text-md  ml-[6vw] text-nowrap">{formatDate(doc.createdAt?.toDate())}</p>
              <p className="text-md  ml-[8.5vw] text-nowrap">{formatDate(doc.updatedAt?.toDate())}</p>
              <MoreVertIcon onClick={() => handleOptionsClick(doc)} className="ml-[11vw]"/>
            </div>
          ))}
        </div>
        {optionsModal}

        {hoveredDocId && (
        <div className="absolute bottom-10 z-50 bg-white p-3 border-blue-500 border rounded-xl rounded-bl-none shadow-lg">
          {hoveredDocPreview}
        </div>
      )}

      </div>
    </section>
  );
}
