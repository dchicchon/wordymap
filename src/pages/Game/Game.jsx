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

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className={styles.App}>
      {gameWon && finalTime !== null && <Modal />}
      <Navbar />
      <TilesBoard />
      <TileRack />
    </div>
  );
};

export default Game;
