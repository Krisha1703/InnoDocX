import { motion } from 'framer-motion';
import Image from 'next/image'; 
import { useState, useEffect } from 'react'; 

const DraggableFiles = () => {
  const [dragConstraints, setDragConstraints] = useState({  left: -1000, right: -100, top: -150, bottom: 100 });

  // Function to update constraints based on screen size
  const updateDragConstraints = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) { // lg screens
      setDragConstraints({ left: -1000, right: -100, top: -150, bottom: 100  });
    } else if (screenWidth >= 768) { // md screens
      setDragConstraints({ left: -700, right: 0, top: 0, bottom: 300 });
    } else { // small screens
      setDragConstraints({ left: -300, right: 50, top: 0, bottom: 350 });
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
      className='absolute md:top-[10%] md:right-[2%] lg:top-[40%] lg:right-[10%] top-[15%] right-[4%] cursor-pointer'
      drag // Enables dragging
      dragConstraints={dragConstraints}  // Limit drag boundaries
      dragElastic={0.5} 
      whileHover={{ scale: 1.1 }} // Scale up slightly on hover
      whileTap={{ scale: 0.95 }} // Slightly scale down on click/drag
    >
       <Image src="/files.webp" width={100} height={100} alt="Draggable Files" draggable="false" className='md:scale-100 scale-50'/>
    </motion.div>
  );
};

export default DraggableFiles;
