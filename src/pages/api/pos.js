// Import necessary libraries
import natural from 'natural';

// Initialize tokenizer and tagger
const tokenizer = new natural.TreebankWordTokenizer();

// Initialize the Brill POS Tagger
const baseFolder = './node_modules/natural/lib/natural/brill_pos_tagger';
const rulesFilename = baseFolder + '/data/English/tr_from_posjs.txt';
const lexiconFilename = baseFolder + '/data/English/lexicon_from_posjs.json';
const defaultCategory = 'N';

const lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
const rules = new natural.RuleSet(rulesFilename);
const tagger = new natural.BrillPOSTagger(lexicon, rules);

// Function to categorize POS tags
function categorizePOSTags(posTags) {
  const posCount = {};

  posTags.forEach(({ pos }) => {
    // Initialize count if it doesn't exist
    if (!posCount[pos]) {
      posCount[pos] = 0;
    }
    // Increment the count for the specific POS tag
    posCount[pos]++;
  });

  return posCount;
}

export default function posTagging(req, res) {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'No valid text provided' });
    }

    // Tokenize the text
    const tokens = tokenizer.tokenize(text);
    console.log('Tokens:', tokens); // Log tokens

    // Perform POS tagging
    const taggedWords = tagger.tag(tokens).taggedWords;
    console.log('Tagged Words:', taggedWords); // Log tagged words

    // Convert to a structure of [{ word: '...', pos: '...' }]
    const posTags = taggedWords.map(taggedWord => ({
      word: taggedWord.token,
      pos: taggedWord.tag
    }));

    console.log('POS Tags:', posTags); // Log POS tags

    // Categorize POS tags and count each type
    const posCount = categorizePOSTags(posTags);
    console.log('POS Count:', posCount); // Log POS count

    return res.status(200).json(posCount);
  } catch (error) {
    console.error('Error performing POS tagging:', error);
    return res.status(500).json({ error: 'Could not perform POS tagging' });
  }
}
