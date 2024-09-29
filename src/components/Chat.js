import React, { useState } from 'react';

const Chat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/nlp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setResponse(data); // Store the sentiment analysis result
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
        />
        <button type="submit">Analyze Sentiment</button>
      </form>
      {response && (
        <div>
          <h2>Sentiment Analysis Result:</h2>
          {response.error ? (
            <p>{response.error}</p>
          ) : (
            <div>
              <p><strong>Score:</strong> {response.score}</p>
              <p><strong>Comparative:</strong> {response.comparative}</p>
              <p><strong>Number of Words:</strong> {response.numWords}</p>
              <p><strong>Sentiment Type:</strong> {response.sentimentType}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
