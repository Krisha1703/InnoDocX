import { getSummarizedText } from '../Text Editor/TextEditor';

const Summarize = () => {
  const summarizedText = getSummarizedText();

  return <p>{summarizedText}</p> ;
};

export default Summarize;
