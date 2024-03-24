import Tile from '../Tile';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useStore } from '../../utils/store';
import styles from './TilesBoard.module.css';

export const TilesBoard = ({}) => {
  const tilemap = useStore((state) => state.tilemap);
  const buildTileRows = () => {
    const rows = [];
    for (let y = 0; y < tilemap.length; y++) {
      const row = [];
      for (let x = 0; x < tilemap.length; x++) {
        const key = `${y}${x}`;
        const tile = tilemap[y][x];

        // should we instead be pushing tile spaces?
        row.push(<Tile key={key} tile={tile} />);
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
      centerOnInit
      limitToBounds={false}
      centerZoomedOut={false}
      initialScale={1.5}
      initialPositionY={0}
    >
      <TransformComponent
        wrapperStyle={{
          width: '100%',
        }}
      >
        <div
          className={styles.boardwrapper}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {buildTileRows()}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};
