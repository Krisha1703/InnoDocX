import { Modal, Box, Typography, Button } from "@mui/material"
import { useContext } from "react";
import { wordCount, sentenceCount, uniqueCount, averageReadingTime } from './WordCount';
import ThemeContext from "./ThemeContext";
import BarChart from "./BarChart"
import PieChart from "./PieChart";
import SentimentAnalyzer from "./SentimentAnalyzer"
import Summarize from "./Summarize"

const DashboardAnalytics = ({ modalOpen, handleModalClose }) => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
    <Box sx={style} className={`${isDarkMode ? 'bg-black text-white' : 'bg-background.paper'}`}>
      <Typography variant="h6" component="h2">
        Analytics Dashboard
      </Typography>
      <div className="grid grid-cols-4 gap-10 p-4 ">
        <div className="card">
          <Typography>Total Words</Typography>
          <Typography>{wordCount}</Typography>
        </div>
        <div className="card">
          <Typography>Unique Words</Typography>
          <Typography>{uniqueCount}</Typography>
        </div>
        <div className="card">
          <Typography>Total Sentences</Typography>
          <Typography>{sentenceCount}</Typography>
        </div>
        <div className="card">
          <Typography>Average Time to Read</Typography>
          <Typography>{averageReadingTime}</Typography>
        </div>
        <div className="card">
          <Typography>Bar Chart</Typography>
          <BarChart />
        </div>
        <div className="card">
          <Typography>POS Tagging</Typography>
          <PieChart />
        </div>
        <div className="card">
          <Typography>Summarized Text</Typography>
          <Summarize />
        </div>
        <div className="card">
          <Typography>Text Sentiment</Typography>
          <SentimentAnalyzer />
        </div>
      </div>
      <Button variant="contained" onClick={handleModalClose} sx={{marginTop: "2vw"}} >
        Close
      </Button>
    </Box>
  </Modal>
  )
}

export default DashboardAnalytics