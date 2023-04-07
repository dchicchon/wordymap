import TileRack from "../TileRack";
import TilesBoard from "../TilesBoard";
import Game from "../../utils/Game";
import { useState, useMemo } from "react";
import styles from "./Board.module.css";
import Navbar from "../Navbar/Navbar";

export const Board = () => {
  const [tile, setTile] = useState(0);
  const [gameNum, setgameNum] = useState(0);

  const game = useMemo(() => new Game(), [gameNum]);

  const resetGame = () => {
    game.reset();
    setgameNum(prevGameNum => prevGameNum + 1);
  }

  // now we can pass functions based on game changes?
  return (
    <div className={styles.board}>
      <Navbar game={game} gameNum={gameNum} resetGame={resetGame} />
      <TilesBoard update={setTile} game={game} />
      <TileRack update={setTile} game={game} />
    </div>
  );
};
