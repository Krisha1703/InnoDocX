
export let wordCount = 0;

export const setWordCount = (count) => {
  wordCount = count;
};

export let sentenceCount = 0;

export const setSentenceCount = (count) => {
  sentenceCount = count;
};

export let characterCount = 0;

export const setCharacterCount = (count) => {
  characterCount = count;
};

export let uniqueCount = 0;

export const setUniqueCount = (count) => {
  uniqueCount = count;
};

export let averageReadingTime = 0;

// Function to set average reading time
export const setAverageReadingTime = () => {
  // Average reading speed: 250 words per minute
  averageReadingTime = (wordCount / 250) * 60; // in seconds
};

