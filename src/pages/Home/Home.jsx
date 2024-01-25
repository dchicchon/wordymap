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
    const scoreDate = localStorage.getItem('score-date');
    const todaysDate = new Date().toLocaleDateString('en-US');
    const foundScores = localStorage.getItem('scores');
    if (foundScores) {
      const parsedScores = JSON.parse(foundScores);
      const sortedScores = parsedScores.sort((a, b) => a - b).slice(0, 5);
      setScores(sortedScores);
    }
    if (scoreDate !== todaysDate) {
      localStorage.setItem('scores', JSON.stringify([]));
      localStorage.setItem('score-date', todaysDate);
    }
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
      <h2>Todays High Scores</h2>
      <ul className={styles.scores}>
        {scores && scores.map((score, i) => <li key={i}>{formatTime(score)}</li>)}
      </ul>
    </div>
  );
};

export default Home;
