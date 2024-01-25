import { useStore } from '../../utils/store';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const formatTime = (totalSeconds) => {
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
  return timerDisplay;
};

const Modal = () => {
  const time = useStore((state) => state.time);
  const resetGame = useStore((state) => state.resetGame);
  const validmap = useStore((state) => state.validmap);
  const navigate = useNavigate();

  const sendHome = () => {
    resetGame();
    navigate('/wordymap/');
  };

  const playAgain = () => {
    resetGame();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.shadow}></div>
      <div className={styles.message}>
        <h2>You win!</h2>
        <h2>Final Time: {formatTime(time)}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button onClick={playAgain}>Play Again</button>
          <button onClick={sendHome}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
