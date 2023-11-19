import TileRack from '../../components/TileRack';
import TilesBoard from '../../components/TilesBoard';
import Navbar from '../../components/Navbar/Navbar';
import styles from './index.module.css';

const Game = () => {
  return (
    <div className={styles.App}>
      <Navbar />
      <TilesBoard />
      <TileRack />
    </div>
  );
};

export default Game;
