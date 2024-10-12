import { useNerEntitiesArray } from './TextEditor';

const NER = () => {
  const nerEntities = useNerEntitiesArray();

  return (
    <div>
      <h1>Named Entities:</h1>
      <ul>
        {nerEntities.map((entity, index) => (
          <li key={index}>{entity}</li>
        ))}
      </ul>
    </div>
  );
};

export default NER;
