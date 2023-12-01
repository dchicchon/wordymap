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

  const share = () => {
    console.log('share');
    console.log({ validmap });

    // find y bounds
    const yTop = null;
    const yBottom = null;

    for (let y = 0; y < validmap.length; y++) {
      for (let x = 0; x < validmap[y].length; y++) {
        if (!isNaN(yTop) && !isNaN(yBottom)) {
          break;
        }
      }
    }
  };

  return (
    <div className={styles.modal}>
      <h2>You win!</h2>
      <h2>Final Time: {formatTime(time)}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button onClick={playAgain}>Play Again</button>
        <button onClick={sendHome}>Home</button>
        <button onClick={share}>Share</button>
      </div>
    </div>
  );
};

export default Modal;
