import { useEffect, useState } from 'react';
import Tile from '../Tile';
import { useStore } from '../../utils/store';
import styles from './TileRack.module.css';

export const TileRack = () => {
  const tilerack = useStore((state) => state.tilerack);

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

  const buildRack = (newRack) => {
    const rack = [];
    for (let i = 0; i < newRack.length; i++) {
      const tile = newRack[i];
      rack.push(<Tile key={i} tile={tile} index={i} />);
    }
    return rack;
  };

  return <div id={styles.rack}>{rack}</div>;
};
