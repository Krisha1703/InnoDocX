import { MenuItem, Button, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ArrowDropDown, Folder } from '@mui/icons-material';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useContext, useEffect, useCallback } from 'react';

import { db } from '../../firebase';
import { onSnapshot } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css'; 
import { doc, setDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';

import useAppState from '../../useAppState';
import  ThemeContext  from '../../Developer Mode/ThemeContext';

const EditDocument = dynamic(() => import('./EditDocument'), { ssr: false });

const ListDocuments = () => {
    const { isDarkMode } = useContext(ThemeContext); // Access dark mode value
    const {
        session,
        showModal,
        setShowModal,
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
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        anchorEl,
        setAnchorEl,
        open,
    } = useAppState();

    const [sortField, setSortField] = useState('createdAt'); // Track current sorting field
    const [sortDirection, setSortDirection] = useState('desc'); // Track current sorting order (asc/desc)
  
     // Handle sorting by field (toggle between ascending and descending)
    const handleSortClick = useCallback((field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        // Call fetchDocuments with the updated sort field and direction
        fetchDocuments(selectedCategory, field, newDirection);
    }, []);


    // Handle category selection and filter documents
    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        fetchDocuments(category, sortField, sortDirection); // Fetch documents filtered by category and sorted
    }, []);

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

    const handleMouseEnter = (doc) => {
        setHoveredDocId(doc.id);
        setHoveredDocPreview(doc.Description); 
      };
    
      const handleMouseLeave = () => {
        setHoveredDocId(null);
        setHoveredDocPreview('');
      };

      const handleCategoryClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
      }, []);
    
      

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

      const fetchDocuments = (filterCategory = '', sortField = 'createdAt', sortDirection = 'desc') => {
        toast.dismiss();
        if (session) {
          try {
            const q = query(
              collection(db, 'userDocs', session.user.email, 'docs'),
              orderBy(sortField, sortDirection) // Fetch documents sorted by the initial field (e.g., createdAt)
            );
      
            // Real-time listener for document updates
            onSnapshot(q, (querySnapshot) => {
              let documents = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
      
              // Apply category filter if selected
              if (filterCategory) {
                documents = documents.filter((doc) => doc.Category === filterCategory);
              }
      
              // Handle case-insensitive sorting for fileName
              if (sortField === 'fileName') {
                documents = documents.sort((a, b) => {
                  const nameA = a.fileName.toLowerCase();
                  const nameB = b.fileName.toLowerCase();
      
                  // Compare filenames for ascending or descending order
                  if (sortDirection === 'asc') {
                    return nameA.localeCompare(nameB); // Sort ascending
                  } else {
                    return nameB.localeCompare(nameA); // Sort descending
                  }
                });
                toast.success(`Documents sorted by ${sortField} in ${sortDirection} order.`);
              }
              
      
              // Set the documents in state
              setDocs(documents);
      
              // Extract unique categories from documents for the category filter dropdown
              const uniqueCategories = [...new Set(documents.map((doc) => doc.Category))];
              setCategories(uniqueCategories);

              // Show toast notifications for sorting and filtering
              if (filterCategory) {
                toast.success(`Filtered documents by category: ${filterCategory}`);
              }
            });
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

      // Helper function to format the date
    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    };

  return (
    <div className="lg:ml-[10vw] md:ml-[5vw] p-8">
        <ToastContainer />
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 w-full px-4 mb-4">
          <p className="font-medium cursor-pointer md:mr-0 mr-5"  onClick={() => handleSortClick('fileName')}>My Documents</p>
          <div className='flex'>
            <p className="font-medium cursor-pointer lg:ml-0 md:md:ml-10 md:block hidden" onClick={() => fetchDocuments('Category', 'asc')}>Category</p>
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

          <p className="font-medium cursor-pointer lg:ml-0 md:ml-10 md:block hidden" onClick={() => handleSortClick('createdAt')}>Date Created</p>
          <p className="font-medium cursor-pointer text-nowrap lg:ml-0 md:ml-20 md:block hidden" onClick={() => handleSortClick('updatedAt')}>Last Opened</p>
          <p className="font-medium cursor-pointer lg:ml-0 md:ml-[11vw] ml-[35vw]"><Folder /></p>
        </div>

        {/* Document Rows */}
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              onMouseEnter={() => handleMouseEnter(doc)}
              onMouseLeave={handleMouseLeave}
              className={`grid grid-cols-5 gap-4 lg:w-10/12 w-full p-4 py-2 lg:rounded-full rounded-md
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-[#E8F0FE]'} 
                cursor-pointer`}
              onClick={() => updateDocumentTimestamp(doc.id)}
            >
              <Link href={`/doc/${doc.id}`} passHref>
                <div className="flex items-center space-x-4">
                  <Image src="/docs.png" width={20} height={20} alt="Document Icon" className='scale-75 w-auto h-auto' />
                  <p className="text-md">{doc.fileName}</p>
                </div>
              </Link>

              <p className="text-md ml-10 text-nowrap md:block hidden">{doc.Category}</p>
              
              <p className="text-md  ml-[6vw] text-nowrap md:block hidden">{formatDate(doc.createdAt?.toDate())}</p>
              <p className="text-md  ml-[8.5vw] text-nowrap md:block hidden">{formatDate(doc.updatedAt?.toDate())}</p>
              <MoreVertIcon onClick={() => handleOptionsClick(doc)} className="md:ml-[11vw] ml-[50vw]"/>
            </div>
          ))}
        </div>

        {showOptionsModal && (
          <EditDocument showOptionsModal={showOptionsModal} setShowOptionsModal={setShowOptionsModal}  selectedDoc={selectedDoc}/>
        )}

        {hoveredDocId && (
        <div className={`absolute lg:top-[85vh] z-50 md:top-[50vh]  top-[100vh] ${isDarkMode ? 'bg-gray-700' : 'bg-white'}  p-3 border-blue-500 border rounded-xl rounded-bl-none shadow-lg`}>
          {hoveredDocPreview}
        </div>
      )}

      </div>
    )
}

export default ListDocuments