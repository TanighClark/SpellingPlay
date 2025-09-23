import { useLocation, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/ActivityCard';
import Meta from '../components/Meta';
import './styles/ActivityPicker.css';

const activities = [
  {
    id: 'fillblank',
    title: 'Fill in the Blank',
    image: '/images/fillblank.png',
    description: 'Practice in context',
    directions: 'Determine which word best completes each sentence.',
  },
  {
    id: 'wordsearch',
    title: 'Word Search',
    image: '/images/wordsearch.png',
    description: 'Find your words in a grid',
    directions:
      'Find each of the spelling words hidden in the grid. Circle or highlight each one as you locate it. When you’ve found them all, check off the list.',
  },

  {
    id: 'scrambleWords',
    title: 'Scrambled Words',
    image: '/images/scrambledwords.png',
    description: 'Unscramble each word',
    directions:
      'Each spelling word has its letters mixed up. Unscramble the letters to form the correct word, then write the word neatly on the line provided.',
  },
  {
    id: 'fillingInLetters',
    title: 'Filling in Letters',
    image: '/images/fillinletters.png',
    description: 'Fill in the missing letters',
    directions:
      'Look at each word with blanks for missing letters. Fill in the blanks to complete the spelling word correctly, using the word bank if you need a hint.',
  },
  {
    id: 'writeSentence',
    title: 'Write a Sentence',
    image: '/images/writescentence.png',
    description: 'Use each word in a sentence',
    directions:
      'Write one original sentence for each spelling word. Make sure your sentence shows that you understand the word’s meaning.',
  },
  {
    id: 'writingFourTimes',
    title: 'Writing Four Times',
    image: '/images/fourtimes.png',
    description: 'Write each word four times',
    directions:
      'Practice your handwriting and spelling by writing each word four times in a row. Pay close attention to letter formation and accuracy.',
  },
  {
    id: 'spellingTest',
    title: 'Spelling Test',
    image: '/images/spellingtest.png',
    description: 'End of the week test',
    directions:
      'Listen carefully to the audio for each word. When you hear the word, write it on the blank line. After you’ve written all the words, compare with the answer key to see how you did.',
  },
  {
    id: 'alphabeticalOrder',
    title: 'Alphabetical Order',
    image: '/images/alphaorder.png',
    description: 'Put the words in alphabetical order',
    directions:
      'Write the spelling words in alphabetical order on the lines below. Read each word carefully and think about which letter comes first.',
  },
];

export default function ActivityPicker() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const words = state?.words || ['example', 'words', 'go', 'here'];
  const listName = state?.listName || 'Demo List';

  return (
    <main className="picker-container" aria-label="Activity Selection">
      <Meta
        title="Choose an Activity — Spell & Play"
        description="Select from word search, fill-in-the-blank, scrambles, and more to turn your word list into printable practice."
        canonical={`${
          typeof window !== 'undefined' ? window.location.origin : ''
        }/activities`}
      />
      <h1 className="picker-title">Choose an Activity</h1>
      <section
        className="picker-grid"
        aria-label="Available spelling activities"
      >
        {activities.map((act) => (
          <ActivityCard
            key={act.id}
            title={act.title}
            image={act.image}
            description={act.description}
            onSelect={() =>
              navigate('/preview', {
                state: {
                  words,
                  listName,
                  activity: act.id,
                  title: act.title,
                  directions: act.directions,
                },
              })
            }
          />
        ))}
      </section>
    </main>
  );
}
