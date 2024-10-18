import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react'; 

const DraggablePencil = () => {
  const [dragConstraints, setDragConstraints] = useState({ left: -100, right: 1000, top: 0, bottom: 300 });

  // Function to update constraints based on screen size
  const updateDragConstraints = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) { // lg screens
      setDragConstraints({ left: -100, right: 1000, top: 0, bottom: 300 });
    } else if (screenWidth >= 768) { // md screens
      setDragConstraints({ left: 0, right: 700, top: -80, bottom: 300 });
    } else { // small screens
      setDragConstraints({ left: -50, right: 300, top: 0, bottom: 200 });
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
      className='absolute md:top-[15%] lg:top-[20%] lg:left-[10%] md:left-[2%] top-[70%] left-[5%] cursor-pointer'
      drag // Enables dragging
      dragConstraints={dragConstraints}  // Limit drag boundaries
      dragElastic={0.5} 
      whileHover={{ scale: 1.1 }} // Scale up slightly on hover
      whileTap={{ scale: 0.95 }} // Slightly scale down on click/drag
    >
       <Image src="/pencil.png" width={50} height={50} alt="Draggable Pencil" draggable="false" className='md:scale-100 scale-75'/>
    </motion.div>
  );
};

export default DraggablePencil;
