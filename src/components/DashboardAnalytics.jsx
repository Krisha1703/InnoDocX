import { Modal, Box, Typography, Button } from "@mui/material"

const DashboardAnalytics = ({ modalOpen, handleModalClose }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
    <Box sx={style}>
      <Typography variant="h6" component="h2">
        Analytics Dashboard
      </Typography>
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="card">
          <Typography>Total Words</Typography>
        </div>
        <div className="card">
          <Typography>Unique Words</Typography>
        </div>
        <div className="card">
          <Typography>Total Sentences</Typography>
        </div>
        <div className="card">
          <Typography>Average Time to Read</Typography>
        </div>
        <div className="card">
          <Typography>Bar Chart</Typography>
        </div>
        <div className="card">
          <Typography>POS Tagging</Typography>
        </div>
        <div className="card">
          <Typography>NER</Typography>
        </div>
        <div className="card">
          <Typography>Text Sentiment</Typography>
        </div>
      </div>
      <Button variant="contained" onClick={handleModalClose}>
        Close
      </Button>
    </Box>
  </Modal>
  )
}

export default DashboardAnalytics