import { Modal, Box, Typography, Button } from "@mui/material";
import { useContext } from "react";
import { wordCount, sentenceCount, uniqueCount, averageReadingTime } from '../Text Editor/WordCount';
import ThemeContext from "../../Developer Mode/ThemeContext";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import SentimentAnalyzer from "./SentimentAnalyzer";
import Summarize from "./Summarize";

const DashboardAnalytics = ({ modalOpen, handleModalClose }) => {
    const { isDarkMode } = useContext(ThemeContext); 

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxHeight: '90vh', 
        overflowY: 'auto', 
        boxShadow: 24,
        p: 4,
    };

    return (
      <Modal open={modalOpen} onClose={handleModalClose}>
          <Box sx={style} className={`${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
              {/*Header*/}
              <div className="flex justify-between">
                <Typography variant="h6" component="h2">Analytics Dashboard</Typography>
                <Button variant="contained" onClick={handleModalClose} sx={{ marginTop: "0vw" }}>Close</Button>
              </div>
              
              {/*Dashboard layout*/}
              <div className="md:grid md:grid-cols-4 md:gap-5 p-4 my-4 flex flex-col md:space-y-0 md:space-x-0 space-y-4 space-x-0">
                  {/*Total words*/}
                  <div className={`card pb-10 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>Total Words</Typography>
                      <Typography sx={{ fontSize: "3.5rem", marginTop: "2vw" }} className="text-center font-semibold text-blue-500">{wordCount}</Typography>
                  </div>

                  {/*Unique words*/}
                  <div className={`card pb-10 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>Unique Words</Typography>
                      <Typography sx={{ fontSize: "3.5rem", marginTop: "2vw" }} className="text-center font-semibold text-blue-500">{uniqueCount}</Typography>
                  </div>

                  {/*Total sentences*/}
                  <div className={`card pb-10 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>Total Sentences</Typography>
                      <Typography sx={{ fontSize: "3.5rem", marginTop: "2vw" }} className="text-center font-semibold text-blue-500">{sentenceCount}</Typography>
                  </div>

                  {/*Average reading time (250 words/min)*/}
                  <div className={`card pb-10 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>Average Time to Read(sec)</Typography>
                      <Typography sx={{ fontSize: "3.5rem", marginTop: "2vw" }} className="text-center font-semibold text-blue-500">{averageReadingTime.toFixed(2)}</Typography>
                  </div>

                  {/* Bar Chart for word frequency */}
                  <div className={`col-span-2 card p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>Word Frequency</Typography>
                      <BarChart />
                  </div>

                  {/* Pie Chart for Part-of-Speech Tagging */}
                  <div className={`card pb-10 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>POS Tagging</Typography>
                      <PieChart />
                  </div>
                
                  {/* Text Sentiment Analysis */}
                  <div className={`card pb-10 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Typography>Text Sentiment</Typography>
                      <SentimentAnalyzer />
                  </div>
              </div>

              {/* Summarized Text */}
              <div className={`card pb-10 p-8 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <Typography sx={{ marginBottom: "2vw"}}><b>Summarized Text</b></Typography>
                  <Summarize />
              </div>
      
          </Box>
      </Modal>
    );
};

export default DashboardAnalytics;
