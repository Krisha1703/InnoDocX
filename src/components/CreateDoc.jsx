import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';
import useAppState from './useAppState';
import CreateDocument from "./CreateDocument"
import ListDocuments from "./ListDocuments"
import ScrollTrigger from "./ScrollTrigger"
import { useContext } from 'react';
import { useState } from 'react';
import VoiceAssistant from "./VoiceAssisstant"
import  ThemeContext  from './ThemeContext'; // Import your ThemeContext

export default function CreateDoc() {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  const {
    showModal,
    setShowModal,
  } = useAppState();

  return (
    <section className=''>
      <div className={`${isDarkMode ? 'bg-[#333]' : 'bg-[#F8F9FA]'} pb-10 px-10`}>
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
              {showModal && (
                <CreateDocument showModal={showModal} setShowModal={setShowModal}/>
              )}
              
              <p className="font-medium py-3 text-md">Blank document</p>
              <VoiceAssistant />
            </div>

            <div className="flex-grow mx-4"> {/* Add a wrapper with flex-grow to make space for ScrollTrigger */}
              <ScrollTrigger />
            </div>

          </div>
        
        </div>

      </div>

      <ListDocuments />

    </section>
  );
}
