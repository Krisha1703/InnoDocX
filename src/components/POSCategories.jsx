const posLabelMapping = {
    // Nouns
    'N': 'Noun',
    'N(soort,ev,basis)': 'Noun', 
    'N(soort,mv,basis)': 'Noun', 
    'N(eigen,ev,basis)': 'Proper Noun',
  
    // Verbs
    'V(ott,3,ev)': 'Verb', 
    'V(verleden,3,ev)': 'Verb', 
    'V(gebiedende_wijs)': 'Imperative Verb', 
    'V(hulp_of_kopp,ott,3,ev)': 'Auxiliary Verb',
  
    // Pronouns
    'Pron(pers,stan,vol,3,mv)':'Personal Pronoun', 
    'Pron(pos,stan,vol,3,ev)':'Possessive Pronoun', 
    'Pron(refl,stan,vol,3,ev)':'Reflexive Pronoun', 
  
    // Adjectives
    'Adj(prenom,basis,stan,zonder)': 'Adjective', 
    'Adj(prenom,basis,stan,met)': 'Adjective', 
  
    // Adverbs
    'Adv(basis)': 'Adverb',
    'Adv(comp)': 'Adverb',
  
    // Articles
    'Art(bep,stan)': 'Definite Article',
    'Art(onbep,stan)': 'Indefinite Article',
  
    // Prepositions
    'Prep': 'Preposition',
  
    // Conjunctions
    'Conj(coord)': 'Conjunction',
    'Conj(subord)': 'Conjunction',
  
    // Numerals
    'Num(hoofd,basis)':'Number',
    'Num(rang,basis)':'Number',
  
    // Interjections
    'Int': 'Interjection',
  
    // Punctuation
    'Punc(punt)': 'Punctuation',
    'Punc(vraag)': 'Punctuation',
    'Punc(uitroep)': 'Punctuation',
    'Punc(komma)': 'Punctuation',
  
    // Foreign Words
    'Misc(vreemd)': 'Foreign Word',
  
    // Miscellaneous or Undefined
    'Misc(onbep)': 'Miscellaneous',
    
    // Default fallback (for any unmapped labels)
    default: 'Other'
  };
export default  posLabelMapping; 