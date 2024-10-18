import { motion } from 'framer-motion';
import Image from 'next/image'; 
import { useState, useEffect } from 'react'; 

const DraggableFolder = () => {
  const [dragConstraints, setDragConstraints] = useState({ left: -900, right: -100, top: -200, bottom: 100 });

  // Function to update constraints based on screen size
  const updateDragConstraints = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) { // lg screens
      setDragConstraints({ left: -900, right: -100, top: -200, bottom: 100 });
    } else if (screenWidth >= 768) { // md screens
      setDragConstraints({ left: -750, right: 0, top: -300, bottom: 100 });
    } else { // small screens
      setDragConstraints({ left: 0, right: 300, top: 0, bottom: 300 });
    }
  };

  useEffect(() => {
    // Set initial drag constraints based on screen size
    updateDragConstraints();

    // Add event listener to update constraints on window resize
    window.addEventListener('resize', updateDragConstraints);

    return () => {
      window.removeEventListener('resize', updateDragConstraints);
    };
  }, []);
  return (
    <motion.div
      className='absolute lg:top-[60%] lg:right-[20%] md:top-[40%] md:right-[5%] top-[25%] right-[75%] cursor-pointer'
      drag // Enables dragging
      dragConstraints={dragConstraints} // Limit drag boundaries
      dragElastic={0.5} 
      whileHover={{ scale: 1.1 }} // Scale up slightly on hover
      whileTap={{ scale: 0.95 }} // Slightly scale down on click/drag
    >
       <Image src="/folder.png" width={100} height={100} alt="Draggable Files" draggable="false" className='md:scale-100 scale-50'/>
    </motion.div>
  );
};

export default DraggableFolder;
