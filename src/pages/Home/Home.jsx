import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

const formatTime = (totalSeconds) => {
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
  return timerDisplay;
};
// we should reset scores for every day?
const Home = () => {
  const [scores, setScores] = useState([]);
  useEffect(() => {
    console.log('get todays top 5 scores');
    const foundScores = localStorage.getItem('scores');
    const parsedScores = JSON.parse(foundScores);
    const sortedScores = parsedScores.sort((a, b) => a - b).slice(0, 5);
    setScores(sortedScores);
  }, []);
  return (
    <div className={styles.page}>
      <h1>Wordy</h1>
      <h2>About</h2>
      <p>
        Get rid of all your tiles in the fastest time by building words with 3 letters or
        more! If you have a letter you can't use, send it back to the pile to get 2 new
        letters to use.
      </p>
      <Link className={styles.button} to={'game'}>
        Play
      </Link>
      <h2>Today's High Scores</h2>
      <ul style={{ listStyle: 'none' }}>
        {scores && scores.map((score, i) => <li key={i}>{formatTime(score)}</li>)}
      </ul>
    </div>
  );
};

export default Home;
