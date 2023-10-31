import TileRack from './components/TileRack';
import TilesBoard from './components/TilesBoard';
import Navbar from './components/Navbar/Navbar';
import styles from './index.module.css';

// we should check the width of the screen were currently on
// with that width, we can create the tilesizes on the board

const App = () => {
  return (
    <div className={styles.App}>
      <Navbar />
      <TilesBoard />
      <TileRack />
    </div>
  );
};

export default App;
