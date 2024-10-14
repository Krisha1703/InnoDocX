import React, { useContext } from "react";
import { sentimentData } from "../Text Editor/TextEditor"; 
import GaugeChart from "react-gauge-chart";
import { SentimentSatisfied, SentimentSatisfiedAlt, SentimentNeutral, SentimentDissatisfied, SentimentVeryDissatisfied } from "@mui/icons-material";
import ThemeContext from "../../Developer Mode/ThemeContext";

const SentimentAnalyzer = () => {
  const { sentimentCategory, sentimentScore } = sentimentData;

  // Use the sentiment score directly as a percentage
  const percentageScore = Math.max(0, Math.min(sentimentScore ?? 0, 100)); 

  // Access dark mode value from ThemeContext
  const { isDarkMode } = useContext(ThemeContext); 

  // Determine text color based on dark mode
  const percentageTextColor = isDarkMode ? 'text-white' : 'text-black';

  // Determine the color and icon based on sentimentScore
  const getSentimentInfo = (score) => {
    if (score >= 90) {
      return { category: "Very Positive", icon: <SentimentSatisfied className="text-green-600" /> };
    } else if (score >= 70) {
      return { category: "Positive", icon: <SentimentSatisfiedAlt className="text-green-500" /> };
    } else if (score >= 50) {
      return { category: "Neutral", icon: <SentimentNeutral className="text-yellow-700" /> };
    } else if (score >= 30) {
      return { category: "Negative", icon: <SentimentDissatisfied className="text-red-500" /> };
    } else {
      return { category: "Very Negative", icon: <SentimentVeryDissatisfied className="text-red-600" /> };
    }
  };

  const sentimentInfo = getSentimentInfo(percentageScore);

  return (
    <div className="p-4">
      {/* Gauge Visualization */}
      <div className="flex flex-col items-center mt-4">
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={3} // Number of color segments
          colors={["#FF0000", "#FFA500", "#00FF00"]} // Red, Orange, Green colors
          arcWidth={0.3} // Width of the gauge arc
          percent={percentageScore / 100} // Percentage as a decimal
          style={{ width: "200px", height: "100px" }} 
          hideText
        />

        <h1 className="text-md">
          <strong style={{ color: percentageTextColor }}>{percentageScore.toFixed(2)}%</strong>
        </h1>

        <h1 className="text-md">
          <strong style={{ color: percentageTextColor }}>{sentimentInfo.category}</strong>
        </h1>

        <div className="mt-2">{sentimentInfo.icon}</div>

      </div>
    </div>
  );
};

export default SentimentAnalyzer;
