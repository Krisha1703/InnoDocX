import { SentimentAnalyzer } from 'node-nlp';

// Initialize the sentiment analyzer for the English language
const sentiment = new SentimentAnalyzer({ language: 'en' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { input } = req.body;

    try {
      const result = await sentiment.getSentiment(input);
      const sentimentType = result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral';

      const normalizedScore = (result.score + 1) / 2; 

      // Convert to percentage
      const percentageScore = normalizedScore * 100;

      // Return the sentiment analysis result
      res.status(200).json({
        score: percentageScore, 
        comparative: result.comparative,
        numWords: result.numWords,
        sentimentType: sentimentType, // Positive, Negative, or Neutral
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      res.status(500).json({ error: 'Could not analyze sentiment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
