import { useEffect } from 'react';
import styles from './Navbar.module.css';
import { useStore } from '../../utils/store';
import { useNavigate } from 'react-router-dom';

const formatTime = (totalSeconds) => {
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
  return timerDisplay;
};

const Navbar = () => {
  const time = useStore((state) => state.time);
  const tick = useStore((state) => state.tick);
  const resetGame = useStore((state) => state.resetGame);
  const navigate = useNavigate();
  const ready = useStore((state) => state.ready);
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [ready]);

  const exitGame = () => {
    resetGame();
    navigate('/wordymap/');
  };

  return (
    <div>
      {/* make this the same size as the navbar? */}
      <div style={{ height: '5rem' }}></div>
      <div className={styles.navbar}>
        <h4 className={styles.nav_element}>Time: {formatTime(time)}</h4>
        <button onClick={exitGame}>Exit Game</button>
      </div>
    </div>
  );
};

export default Navbar;
