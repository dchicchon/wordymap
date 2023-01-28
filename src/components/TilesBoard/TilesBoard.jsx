import { useDrop } from "react-dnd";
import Tile from "../Tile";
import styles from "./TilesBoard.module.css";

export const TilesBoard = ({ game, update }) => {
  const buildTiles = () => {
    const tiles = [];
    for (let y = 0; y < game.size; y++) {
      const row = [];
      for (let x = 0; x < game.size; x++) {
        const key = `${y}${x}`;
        row.push(
          <TileSpace update={update} game={game} x={x} y={y} key={key} />
        );
      }
      tiles.push(
        <div key={y} className={styles.row}>
          {row}
        </div>
      );
    }
    return tiles;
  };

  return <div id={styles.tiles}>{buildTiles()}</div>;
};

const TileSpace = ({ x, y, id, game, update }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "tile",
      canDrop: () => {
        return true;
      },
      drop: (item) => {
        // coming from tilerack
        if (!isNaN(item.index)) {
          game.placeTile(x, y, item.index);
        }
        // from board
        else {
          game.moveTile(item.x, item.y, x, y);
        }
        update((prev) => prev + 1);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [game]
  );

  const onMouseUp = (e) => {
    const tile = game.getTile(x, y);
    if (tile) {
      game.addToTileRack(tile);
      game.removeTile(x, y);
      update((prev) => prev + 1);
    }
  };

  return (
    <div id={id} ref={drop} className={styles.tilespace}>
      {isOver && canDrop && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: canDrop ? "#353535" : "",
          }}
        />
      )}
      <Tile
        x={x}
        y={y}
        tile={game.tilemap[y][x]}
        valid={game.isValid(x, y)}
        onMouseUp={onMouseUp}
      />
    </div>
  );
};
