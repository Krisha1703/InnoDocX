import natural from 'natural';

// Tokenization function
const tokenizeText = (text) => {
  const tokenizer = new natural.WordTokenizer();
  return tokenizer.tokenize(text);
};

// Stemmer initialization
const stemmer = natural.PorterStemmer;

// API handler
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body; // Extract text from the request body

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Tokenize the text
    const tokens = tokenizeText(text);
    const wordCount = tokens.length; // Calculate the word count

    // Convert to lowercase and filter out stopwords
    const stopwords = natural.stopwords;
    const processedTokens = tokens
      .map(token => token.toLowerCase()) // Convert to lowercase
      .filter(token => !stopwords.includes(token)) // Remove stopwords

    // Find unique words
    const uniqueTokens = [...new Set(processedTokens)];
    const uniqueWordCount = uniqueTokens.length; // Count unique words

    // Return both tokens and word count
    res.status(200).json({ 
      tokens: processedTokens, 
      wordCount, 
      uniqueWordCount, 
      uniqueTokens 
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
