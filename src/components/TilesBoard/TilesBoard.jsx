import Tile from '../Tile';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useStore } from '../../utils/store';
import styles from './TilesBoard.module.css';

export const TilesBoard = ({}) => {
  const game = useStore((state) => state.game);
  const selectedTile = useStore((state) => state.selectedTile);
  const setSelectedTile = useStore((state) => state.setSelectedTile);
  const removeFromTileRack = useStore((state) => state.removeFromTileRack);

  const onClick = (currentTile) => {
    if (selectedTile) {
      console.log('we have a selected tile');
      console.log({ selectedTile });
      game.setTile(currentTile.x, currentTile.y, selectedTile);
      if (!isNaN(selectedTile.index)) {
        console.log('remove selected tile from rack');
        removeFromTileRack(selectedTile.index);
        // game.removeFromTileRack(selectedTile.index);
      }
      // if (selectedTile.index && currentTile.letter) {
      //   console.log('bring current tile to rack');
      //   currentTile.index = selectedTile.index;
      //   game.addTileToRack(currentTile);
      // }
      // if (selectedTile.x && selectedTile.y) {
      //   console.log('placing the current tile to the selectedTile position');
      //   console.log({ selectedTile });
      //   game.setTile(selectedTile.x, selectedTile.y, currentTile);
      // }
      setSelectedTile(null);
    } else {
      if (currentTile.letter) {
        console.log('setting selected old tile');
        setSelectedTile(currentTile);
      }
    }

    // different situations
    // 1. We click on an empty space with a tile already selected
    // 2. We click on an occupied space with a tile already selected

    // 1. We place the selected tile into the empty space
    // 2. We place the tile into the occupied space. The old tile will switch places with the
    // new tile

    // const currentTile = oldTile.letter;
    // if (selectedTile.letter) {
    //   game.placeTile(x, y, selectedTile);
    //   setSelectedTile(null);
    //   if (selectedTile.index) {
    //     // this means it was in the tilerack, lets remove it from the rack
    //     setTile(game.tilemap[y][x]);
    //     setTileRack(game.tiles);
    //   }
    // }
  };
  const buildTileRows = () => {
    const rows = [];
    for (let y = 0; y < game.size; y++) {
      const row = [];
      for (let x = 0; x < game.size; x++) {
        const key = `${y}${x}`;
        const tile = game.tilemap[y][x];
        row.push(
          // we can change the tilespace size here?
          <div className={styles.tile} onClick={(e) => onClick(tile)} key={key}>
            <Tile tile={tile} />
          </div>
        );
      }
      rows.push(
        <div key={y} className={styles.row}>
          {row}
        </div>
      );
    }
    return rows;
  };

  return (
    // <div id={styles.tiles}>
    <TransformWrapper
    // initialScale={2}
    // initialPositionX={100} initialPositionY={100}
    >
      <TransformComponent
      // wrapperStyle={{ width: '100%' }}
      // contentStyle={{ width: '100%' }}
      >
        {buildTileRows()}
      </TransformComponent>
    </TransformWrapper>
    // </div>
  );

  return (
    <TransformWrapper
    // initialScale={1} initialPositionX={100} initialPositionY={100}
    >
      <TransformComponent>
        <div id={styles.tiles}>{buildTileRows()}</div>
      </TransformComponent>
    </TransformWrapper>
  );

  return <div id={styles.tiles}>{buildTileRows()}</div>;
};
