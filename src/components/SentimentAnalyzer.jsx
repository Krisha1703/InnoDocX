import React from "react";
import { sentimentData } from "./TextEditor"; // Ensure this path is correct
import GaugeChart from "react-gauge-chart";
import { SentimentSatisfied, SentimentNeutral, SentimentDissatisfied } from "@mui/icons-material";

const SentimentAnalyzer = () => {
  const { sentimentCategory, sentimentScore } = sentimentData;

  // Use the sentiment score directly as a percentage
  const percentageScore = Math.max(0, Math.min(sentimentScore ?? 0, 100)) / 100; // Convert to a 0-1 scale for the gauge chart

  // Determine the color and icon based on sentimentCategory
  const getSentimentInfo = (category) => {
    switch (category) {
      case "Positive":
        return {
          color: "green",
          icon: <SentimentSatisfied className="text-green-600" />,
        };
      case "Neutral":
        return {
          color: "orange",
          icon: <SentimentNeutral className="text-yellow-500" />,
        };
      case "Negative":
        return {
          color: "red",
          icon: <SentimentDissatisfied className="text-red-600" />,
        };
      default:
        return {
          color: "gray",
          icon: null,
        };
    }
  };

  return (
    <div className="p-4">

      {/* Gauge Visualization */}
      <div className="flex flex-col items-center mt-4">
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={3} // Number of color segments
          colors={["#FF0000", "#FFA500", "#00FF00"]} // Red, Orange, Green colors
          arcWidth={0.3} // Width of the gauge arc
          percent={percentageScore} // Use the percentage score for the gauge
          style={{ width: "200px", height: "100px" }} // Adjust size as needed
        />
        {/* Displaying the percentage score without 'out of 5' */}
        
        <h1 className="text-md">
          <strong>{sentimentCategory}</strong>
        </h1>
        <div className="mt-2">{getSentimentInfo(sentimentCategory).icon}</div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
