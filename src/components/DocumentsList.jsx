import React, { useEffect, useState, useContext } from 'react'; // Import useContext
import { collection, getDocs } from "firebase/firestore";
import { List, ListItem, ListItemText } from '@mui/material';
import { useSession } from "next-auth/react";
import { db } from "./firebase";
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ThemeContext from './ThemeContext'; // Import your ThemeContext

const DocumentsList = ({ searchQuery }) => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState([]);
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!session?.user?.email || !searchQuery) return;

      const docsCollection = collection(db, "userDocs", session.user.email, "docs");

      try {
        const querySnapshot = await getDocs(docsCollection);
        const allDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter documents based on the search term (case insensitive)
        const filteredDocs = allDocs.filter(doc => doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

        setDocuments(filteredDocs);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        toast.error("The file is not found, please try again!");
      }
    };

    fetchDocuments();
  }, [session?.user?.email, searchQuery]);

  return (
    <>
      {searchQuery && (
        <List className='max-w-3xl'>
          <ListItemText primary="Search query results: " className='mx-20 my-5' />
          {documents.length > 0 ? (
            documents.map(doc => (
              <Link href={`/doc/${doc.id}`} passHref key={doc.id}>
                <ListItem 
                  className={`mx-40 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-[#E8F0FE]'} p-4 shadow-md cursor-pointer`}
                >
                  <Image src="/docs.png" width={20} height={20} alt="docs" className='mx-5' />
                  <ListItemText primary={doc.fileName} />
                  <ListItemText primary={doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toLocaleString() : 'N/A'} />
                </ListItem>
              </Link>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No documents found" className={isDarkMode ? 'text-white' : ''} />
            </ListItem>
          )}
        </List>
      )}
    </>
  );
};

export default DocumentsList;
