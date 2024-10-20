import { motion } from 'framer-motion';
import Image from 'next/image'; 
import { useState, useEffect } from 'react'; 

const DraggableReport = () => {
  const [dragConstraints, setDragConstraints] = useState({ left: -100, right: 900, top: -150, bottom: 200 });

  // Function to update constraints based on screen size
  const updateDragConstraints = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) { // lg screens
      setDragConstraints({ left: -100, right: 900, top: -150, bottom: 200 });
    } else if (screenWidth >= 768) { // md screens
      setDragConstraints({ left: -300, right: 300, top: -250, bottom: 100 });
    } else { // small screens
      setDragConstraints({ left: -300, right: 50, top: -300, bottom: 50 });
    }
  };

  useEffect(() => {
    updateDragConstraints();
    window.addEventListener('resize', updateDragConstraints);
    return () => {
      window.removeEventListener('resize', updateDragConstraints);
    };
  }, []);

  return (
    <motion.div
      className='absolute lg:top-[40%] lg:left-[10%] md:top-[40%] md:left-[40%] top-[70%] right-[5%] cursor-pointer'
      drag // Enables dragging
      dragConstraints={dragConstraints} // Limit drag boundaries
      dragElastic={0.5} 
      whileHover={{ scale: 1.1 }} // Scale up slightly on hover
      whileTap={{ scale: 0.95 }} // Slightly scale down on click/drag
    >
       <Image src="/report.webp" width={100} height={100} alt="Draggable Files" draggable="false" loading='lazy' className='md:scale-100 scale-50'/>
    </motion.div>
  );
};

export default DraggableReport;
