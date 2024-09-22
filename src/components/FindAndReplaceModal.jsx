export const findAndReplace = (text, findWord, replaceWord) => {
  const regex = new RegExp(findWord, 'g');
  return text.replace(regex, replaceWord);
};
