import TileRack from "../TileRack";
import TilesBoard from "../TilesBoard";
import Game from "../../utils/Game";
import { useState, useMemo } from "react";
import styles from "./Board.module.css";
import { isMobile } from "../../utils";

export const Board = () => {
  const [tile, setTile] = useState(0);
  const game = useMemo(() => new Game(), []);
  // now we can pass functions based on game changes?
  return (
    <div className={isMobile ? `${styles.mobileBoard}` : `${styles.board}`}>
      <TilesBoard update={setTile} game={game} />
      <TileRack update={setTile} game={game} />
    </div>
  );
};
