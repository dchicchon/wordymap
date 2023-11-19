import Tile from '../Tile';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useStore } from '../../utils/store';
import styles from './TilesBoard.module.css';

export const TilesBoard = ({}) => {
  const tilemap = useStore((state) => state.tilemap);
  const setTile = useStore((state) => state.setTile);
  const selectedTile = useStore((state) => state.selectedTile);
  const setSelectedTile = useStore((state) => state.setSelectedTile);
  const removeFromTileRack = useStore((state) => state.removeFromTileRack);
  const removeTileFromMap = useStore((state) => state.removeTileFromMap);
  const addToTileRack = useStore((state) => state.addToTileRack);

  const onClick = (currentTile) => {
    if (selectedTile) {
      if (selectedTile.id === currentTile.id) {
        console.log({ selectedTile });
        removeTileFromMap(selectedTile);
        return;
      } 
      if (selectedTile.index >= 0) {
        removeFromTileRack(selectedTile.index);
        delete selectedTile.index;
      }
      if (currentTile.id) {
        removeTileFromMap(currentTile);
      }
      if (
        selectedTile.x &&
        selectedTile.x !== null &&
        selectedTile.y &&
        selectedTile.y !== null
      ) {
        setTile(selectedTile.x, selectedTile.y, currentTile);
      }
      setTile(currentTile.x, currentTile.y, selectedTile);
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
      <TransformComponent>
        <div>{buildTileRows()}</div>
      </TransformComponent>
    </TransformWrapper>
  );
};
