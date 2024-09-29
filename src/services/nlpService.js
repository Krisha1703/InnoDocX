import { SentimentAnalyzer } from 'node-nlp';

const sentiment = new SentimentAnalyzer({ language: 'en' });

export async function analyzeSentiment(input) {
  try {
    const result = await sentiment.getSentiment(input);
    return {
      score: result.score,
      comparative: result.comparative,
      numWords: result.numWords,
      sentimentType: result.score >= 0 ? 'Positive' : 'Negative', // Simple sentiment type based on score
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { error: 'Could not analyze sentiment' };
  }
}
