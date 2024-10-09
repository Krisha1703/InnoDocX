import { Modal, Box, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { wordCount, sentenceCount, characterCount } from './WordCount';
import ThemeContext from "@/components/ThemeContext";
import { useContext } from "react";

const WordCountModal = ({ modalOpen, handleModalClose }) => {
    console.log("modal is open now")
    const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  return (
    <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="word-count-title"
        aria-describedby="word-count-description"
    >
        <Box className={`absolute rounded-xl top-[20%] left-[35%] w-1/4 shadow-md p-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white'}  z-50 flex flex-col items-center`}>
        <CloseIcon className="cursor-pointer absolute right-5 my-2" onClick={handleModalClose} />
        <Typography variant="h6" className="mt-10">
            Document Statistics
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
            Words: {wordCount}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
            Sentences: {sentenceCount}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
            Characters: {characterCount}
        </Typography>
        
        </Box>
    </Modal>
  )
}

export default WordCountModal