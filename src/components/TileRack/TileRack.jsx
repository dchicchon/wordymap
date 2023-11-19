import { useEffect, useState, useCallback } from 'react';
import Tile from '../Tile';
import { useStore } from '../../utils/store';
import styles from './TileRack.module.css';

export const TileRack = () => {
  const tilerack = useStore((state) => state.tilerack);
  const selectedTile = useStore((state) => state.selectedTile);
  const setSelectedTile = useStore((state) => state.setSelectedTile);
  const returnToPile = useStore((state) => state.returnToPile);

  const [rack, setRack] = useState([]);
  useEffect(() => {
    setRack(buildRack(tilerack));
    const unsubscribe = useStore.subscribe(
      (state) => state.tilerack,
      (newTileRack, oldTilerack) => {
        setRack(buildRack(newTileRack));
      }
    );
    return unsubscribe;
  }, []);

  const sendToPile = (e) => {
    if (!selectedTile) return;
    returnToPile(selectedTile.index);
  };

  const buildRack = (newRack) => {
    const rack = [];
    for (let i = 0; i < newRack.length; i++) {
      const tile = newRack[i];
      rack.push(
        <div
          className={styles.tile}
          onClick={() => setSelectedTile({ index: i, ...tile })}
          key={i}
        >
          <Tile tile={tile} />
        </div>
      );
    }
    return rack;
  };

  return (
    <div id={styles.wrapper}>
      <div id={styles.rack}>{rack}</div>
      <div id={styles.toPile} onClick={sendToPile}>
        <h2>Back To Pile</h2>
      </div>
    </div>
  );
};
