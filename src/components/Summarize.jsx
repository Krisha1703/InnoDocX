import { getSummarizedText } from './TextEditor';

const Summarize = () => {
  const summarizedText = getSummarizedText();

  return (
    <div>
      <p className='text-sm'>{summarizedText}</p>
    </div>
  );
};

export default Summarize;
