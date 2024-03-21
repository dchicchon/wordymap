import { useEffect } from 'react';
import TileRack from '../../components/TileRack';
import TilesBoard from '../../components/TilesBoard';
import Navbar from '../../components/Navbar/Navbar';
import styles from './index.module.css';
import { useStore } from '../../utils/store';
import Modal from '../../components/Modal/Modal';

const Game = () => {
  const gameWon = useStore((state) => state.gameWon);
  const finalTime = useStore((state) => state.finalTime);
  const startGame = useStore((state) => state.startGame);

  const start = async () => {
    await startGame();
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <div>
      {gameWon && finalTime !== null && <Modal />}
      <div className={styles.App}>
        <Navbar />
        <TilesBoard />
        <TileRack />
      </div>
    </div>
  );
};

export default Game;
