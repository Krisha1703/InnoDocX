import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useAppState from '../../useAppState';
import CreateDocument from "./CreateDocument"
import ListDocuments from "../List Documents/ListDocuments"
import ScrollTrigger from "./ScrollTrigger"
import { useContext } from 'react';
import  ThemeContext  from '@/components/Developer Mode/ThemeContext'; 

//Import draggable components
const DraggablePencil = dynamic(() => import('./DraggablePencil'), { ssr: false });
const DraggableFiles = dynamic(() => import('./DraggableFiles'), { ssr: false });
const DraggableFolder = dynamic(() => import('./DraggableFolder'), { ssr: false });
const DraggableReport = dynamic(() => import('./DraggableReport'), { ssr: false });

const VoiceAssistant = dynamic(() => import('./VoiceAssisstant'), { ssr: false });

export default function CreateDoc() {
  const { isDarkMode } = useContext(ThemeContext);

  const {
    showModal,
    setShowModal,
  } = useAppState();

  return (
    <>
      <div className={`${isDarkMode ? 'bg-[#333]' : 'bg-[#F8F9FA]'} pb-10 px-10`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700">Start a new document</h2>
            <MoreVertIcon />
          </div>
         
          <div className="flex md:flex-row flex-col justify-between items-center">
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

            <DraggablePencil />
            <DraggableFiles />
            <DraggableFolder />
            <DraggableReport />

            <div className="flex-grow mx-4"> 
              <ScrollTrigger />
            </div>

          </div>
        
        </div>

      </div>

      <ListDocuments />

    </>
  );
}
