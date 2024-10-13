import { getSummarizedText } from './TextEditor';

const Summarize = () => {
  const summarizedText = getSummarizedText();

  return (
    <div>
      <p className=''>{summarizedText}</p>
    </div>
  );
};

export default Summarize;
