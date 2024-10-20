//Displays statistics like word count, sentence count, and character count in 3D bar charts

import { Modal, Box, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { useContext } from "react";
import ThemeContext from "@/components/Developer Mode/ThemeContext";

import dynamic from "next/dynamic";
const ThreeDChart = dynamic(() => import('./3DCharts'), { ssr: false });

const ChartModal = ({ modalOpen, handleModalClose }) => {
  const { isDarkMode } = useContext(ThemeContext); 

  return (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      aria-labelledby="word-count-title"
      aria-describedby="word-count-description"
    >
      <Box className={`absolute rounded-xl top-[20%] md:left-[35%] left-[10%] md:w-1/2 w-3/4 shadow-md p-4 pb-10 ${isDarkMode ? 'bg-black text-white' : 'bg-white'} flex flex-col items-center`}>
        <CloseIcon className="cursor-pointer absolute right-5 mt-0 mb-10" onClick={handleModalClose} />
        <Typography variant="h6" className="my-10">3D Statistics </Typography>
        <ThreeDChart />
      </Box>

    </Modal>
  )
}

export default ChartModal