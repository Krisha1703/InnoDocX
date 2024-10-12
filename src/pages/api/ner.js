// pages/api/ner.js
import { NlpManager } from 'node-nlp';

const manager = new NlpManager({ languages: ['en'] });

// Add training data for NER
manager.addNamedEntity('organization', 'organization', ['Apple', 'Google', 'OpenAI']);
manager.addNamedEntity('location', 'location', ['California', 'New York', 'London']);
manager.addNamedEntity('person', 'person', ['John Doe', 'Jane Smith']);
manager.addNamedEntity('date', 'date', ['January 1, 2024', 'February 14, 2024']);
manager.addNamedEntity('email', 'email', ['example@gmail.com']);
manager.addNamedEntity('url', 'url', ['https://www.example.com']);

// Prepare the manager (this should be done when initializing the API)
const prepareManager = async () => {
  await manager.train();
  manager.save();
};

prepareManager(); // Ensure the manager is prepared

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;

    // Log input text for debugging
    console.log('Input text:', text);

    // Perform NER
    const result = await manager.process('en', text);
    
    // Log the NER result for debugging
    console.log('NER result:', result.entities);

    // Format the response
    const entities = result.entities.map(entity => ({
      type: entity.entity,
      value: entity.lemma,
    }));

    // Send response
    res.status(200).json({ entities });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
