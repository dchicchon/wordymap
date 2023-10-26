import Tile from '../Tile';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useStore } from '../../utils/store';
import styles from './TilesBoard.module.css';
import { useEffect, useState } from 'react';

export const TilesBoard = ({}) => {
  // const game = useStore((state) => state.game);
  const tilemap = useStore((state) => state.tilemap);
  const setTile = useStore((state) => state.setTile);
  const removeTile = useStore((state) => state.removeTile);
  const selectedTile = useStore((state) => state.selectedTile);
  const setSelectedTile = useStore((state) => state.setSelectedTile);
  const removeFromTileRack = useStore((state) => state.removeFromTileRack);
  const addToTileRack = useStore((state) => state.addToTileRack);
  const updateTileMapNum = useStore((state) => state.updateTileMapNum);
  const removeTileFromMap = useStore((state) => state.removeTileFromMap);

  // const [map, setMap] = useState(tilemap);
  useEffect(() => {
    // we need to use the selector for this to work
    // const unsubscribe = useStore.subscribe(
    //   (state) => state.tilemapNum,
    //   (tilemap) => {
    //     console.log('tilemap changed');
    //     // setMap(buildTileRows(tilemap));
    //   }
    // );
  }, []);
  const onClick = (currentTile) => {
    if (selectedTile) {
      console.log('we have a selected tile');
      console.log({ selectedTile });
      if (selectedTile.id === currentTile.id) {
        console.log('clicked on same tile again');
        removeTileFromMap(selectedTile);
        setSelectedTile(null);
        return;
      } 
      // else if ()

      setTile(currentTile.x, currentTile.y, selectedTile);
      if (selectedTile.index === 0 || selectedTile.index) {
        console.log('remove selected tile from rack');
        removeFromTileRack(selectedTile.index);
        updateTileMapNum(1);
        // game.removeFromTileRack(selectedTile.index);
      }
      if (selectedTile.x && selectedTile.y) {
        setTile(selectedTile.x, selectedTile.y, currentTile);
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
    } else if (currentTile.id) {
      setSelectedTile(currentTile);
    }
  };
  const buildTileRows = () => {
    const rows = [];
    for (let y = 0; y < tilemap.length; y++) {
      const row = [];
      for (let x = 0; x < tilemap.length; x++) {
        const key = `${y}${x}`;
        const tile = tilemap[y][x];
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
    <TransformWrapper
      doubleClick={{ disabled: true }}
      centerZoomedOut={false}
      initialScale={1.5}
    >
      <TransformComponent>{buildTileRows()}</TransformComponent>
    </TransformWrapper>
  );
};
