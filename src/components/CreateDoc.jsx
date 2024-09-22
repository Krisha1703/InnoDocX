import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { db } from './firebase';
import Link from 'next/link';
import { Folder } from '@mui/icons-material';
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

  const createDocument = async () => {
    if (!input || !session) return;

    try {
      const docRef = doc(collection(db, 'userDocs', session.user.email, 'docs'));
      await setDoc(docRef, {
        fileName: input,
        createdAt: serverTimestamp(),
        openedAt: serverTimestamp(),
      });
      setShowModal(false);
      setInput('');
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const fetchDocuments = async (orderField = 'createdAt', sortOrder = 'desc') => {
    if (session) {
      try {
        const q = query(
          collection(db, 'userDocs', session.user.email, 'docs'),
          orderBy(orderField, sortOrder)
        );
        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
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
  };

  const handleOptionsClick = (doc) => {
    setSelectedDoc(doc);
    setNewFileName(doc.fileName);
    setShowOptionsModal(true);
  };

  const renameDocument = async () => {
    if (selectedDoc) {
      try {
        const docRef = doc(db, 'userDocs', session.user.email, 'docs', selectedDoc.id);
        await setDoc(docRef, {
          ...selectedDoc,
          fileName: newFileName,
        }, { merge: true });
        setShowOptionsModal(false);
        fetchDocuments();
      } catch (error) {
        console.error("Error renaming document:", error);
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
      } catch (error) {
        console.error("Error deleting document:", error);
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
    }
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
          <Button onClick={deleteDocument} variant="contained" sx={{backgroundColor: "red"}} className='bg-red-500'>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <section>
      <div className="bg-[#F8F9FA] pb-10 px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h4 className="text-gray-700">Start a new document</h4>
            <MoreVertIcon />
          </div>
          <div>
            <Image
              src="/createdoc.png"
              width={150}
              height={150}
              alt="createdoc"
              className='cursor-pointer border-0 hover:border-2 hover:border-blue-500'
              onClick={() => setShowModal(true)}
            />
          </div>
          {modal}
          <p className="font-medium py-3 text-sm">Blank document</p>
        </div>
      </div>

      <div className="ml-[15vw] p-8">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 w-full px-4 mb-4">
          <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('fileName', 'asc')}>My Documents</p>
          <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('createdAt', 'asc')}>Date Created</p>
          <p className="font-medium cursor-pointer" onClick={() => fetchDocuments('updatedAt', 'asc')}>Last Opened</p>
          <p className="font-medium cursor-pointer"><Folder /></p>
        </div>

        {/* Document Rows */}
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-4 gap-4 w-full p-4 py-2 rounded-full hover:bg-[#E8F0FE] cursor-pointer"
              onClick={() => updateDocumentTimestamp(doc.id)}
            >
              <Link href={`/doc/${doc.id}`} passHref>
                <div className="flex items-center space-x-4">
                  <Image src="/docs.png" width={20} height={20} alt="Document Icon" className='scale-75' />
                  <p className="text-md">{doc.fileName}</p>
                </div>
              </Link>
              <p className="text-md">{formatDate(doc.createdAt?.toDate())}</p>
              <p className="text-md">{formatDate(doc.updatedAt?.toDate())}</p>
              <MoreVertIcon onClick={() => handleOptionsClick(doc)} />
            </div>
          ))}
        </div>
        {optionsModal}
      </div>
    </section>
  );
}
