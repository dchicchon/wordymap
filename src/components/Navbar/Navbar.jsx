import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { useStore } from '../../utils/store';

// should contain info about the game being played
const formatTime = (totalSeconds) => {
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
  return timerDisplay;
};

const Navbar = () => {
  const [time, setTime] = useState(0);
  const gameNum = useStore((state) => state.gameNum);
  const tilesPlaced = useStore((state) => state.tilesPlaced);
  const resetGame = useStore((state) => state.resetGame);
  useEffect(() => {
    console.log('create navbar');
    const newTimer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    const resetTimer = () => {
      setTime(0);
      clearInterval(newTimer);
    };
    return resetTimer;
  }, [gameNum]);

  return (
    <div className={styles.navbar}>
      <h4 className={styles.nav_element}>Wordymap</h4>
      <h4 className={styles.nav_element}>Time: {formatTime(time)}</h4>
      <h4 className={styles.nav_element}>Score: {tilesPlaced}</h4>
      <h4 className={styles.nav_element}>Reset</h4>
      {/* <button onClick={resetGame} className={styles.button}>
        Reset
      </button> */}
    </div>
  );
};

export default Navbar;
