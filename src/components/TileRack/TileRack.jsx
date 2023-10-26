import { useEffect, useState } from 'react';
import Tile from '../Tile';
import { useStore } from '../../utils/store';
import styles from './TileRack.module.css';

export const TileRack = () => {
  const tilerack = useStore((state) => state.tilerack);
  const setSelectedTile = useStore((state) => state.setSelectedTile);
  const [rack, setRack] = useState([]);
  useEffect(() => {
    setRack(buildRack(tilerack));
    const unsubscribe = useStore.subscribe((state) => {
      setRack(buildRack(state.tilerack));
    });
    return unsubscribe;
  }, []);

  const onClick = (pressedTile) => {
    const index = tilerack.findIndex((tile) => tile.id === pressedTile.id);
    const selectedTile = {
      index,
      ...pressedTile,
    };
    setSelectedTile(selectedTile);
  };

  const buildRack = (newRack) => {
    const rack = [];
    for (let i = 0; i < newRack.length; i++) {
      const tile = newRack[i];
      rack.push(
        <div className={styles.tile} onClick={() => onClick(tile)} key={i}>
          <Tile tile={tile} />
        </div>
      );
    }
    return rack;
  };

  return (
    <div id={styles.wrapper}>
      <div id={styles.rack}>{rack}</div>
    </div>
  );
};
