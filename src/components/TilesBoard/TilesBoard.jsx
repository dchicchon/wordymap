import Tile from '../Tile';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useStore } from '../../utils/store';
import styles from './TilesBoard.module.css';
// import { useEffect, useState } from 'react';

export const TilesBoard = ({}) => {
  const tilemap = useStore((state) => state.tilemap);
  const setTile = useStore((state) => state.setTile);
  const selectedTile = useStore((state) => state.selectedTile);
  const setSelectedTile = useStore((state) => state.setSelectedTile);
  const removeFromTileRack = useStore((state) => state.removeFromTileRack);
  const removeTileFromMap = useStore((state) => state.removeTileFromMap);
  const onClick = (currentTile) => {
    if (selectedTile) {
      if (selectedTile.id === currentTile.id) {
        removeTileFromMap(selectedTile);
        setSelectedTile(null);
        return;
      } else {

      }
      setTile(currentTile.x, currentTile.y, selectedTile);
      if (selectedTile.index === 0 || selectedTile.index) {
        removeFromTileRack(selectedTile.index);
      }
      if (selectedTile.x && selectedTile.y) {
        setTile(selectedTile.x, selectedTile.y, currentTile);
      }

      // finally select null
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
      initialScale={1.25}
    >
      <TransformComponent>{buildTileRows()}</TransformComponent>
    </TransformWrapper>
  );
};
