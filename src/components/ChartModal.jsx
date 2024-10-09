import { Modal, Box, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import ThreeDChart from "./3DCharts"

const ChartModal = ({ modalOpen, handleModalClose }) => {
  return (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      aria-labelledby="word-count-title"
      aria-describedby="word-count-description"
    >
      <Box className="absolute rounded-xl top-[20%] left-[35%] w-1/2 shadow-md p-4 pb-10 bg-white flex flex-col items-center">
        <CloseIcon className="cursor-pointer absolute right-5 mt-0 mb-10" onClick={handleModalClose} />
        <Typography variant="h6" className="my-10">
          3D Statistics
        </Typography>

        <ThreeDChart />
        
      </Box>
    </Modal>
  )
}

export default ChartModal