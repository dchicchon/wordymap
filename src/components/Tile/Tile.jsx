// import { useDrag } from "react-dnd";
import { useStore } from '../../utils/store';
import { useEffect, useState } from 'react';
import './Tile.css';

const borderStyles = {
  noLetter: {
    border: '1px solid transparent',
  },
  valid: {
    border: '1px solid #1eff1e',
    borderRadius: '10px',
  },
  selected: {
    border: '1px solid yellow',
    borderRadius: '10px',
  },
  default: {
    border: '1px solid rgb(20, 157, 236)',
    borderRadius: '10px',
  },
};

export const Tile = ({ tile }) => {
  // const initSelectedTile = useStore((state) => state.selectedTile);
  const selectedTile = useStore((state) => state.selectedTile);
  const validmap = useStore((state) => state.validmap);
  const [border, setBorder] = useState(false);

  useEffect(() => {
    if (selectedTile && selectedTile.id === tile.id) {
      setBorder('selected');
    } else if (tile.y && tile.x && validmap[tile.y][tile.x]) {
      setBorder('valid');
    } else if (tile.id) {
      setBorder('default');
    } else {
      setBorder('noLetter');
    }

    // const unsub = useStore.subscribe(
    //   (state) => state.validNum,
    //   (validNum) => {
    //     console.log('validmap updated');
    //     console.log({ validNum });
    //   }
    // );

    // const unsub2 = useStore.subscribe(
    //   (state) => state.selectedTile,
    //   (selectedTile) => {
    //     console.log('run the change');
    //     if (selectedTile && selectedTile.id === tile.id) {
    //       setBorder('selected');
    //     } else if (tile.valid) {
    //       setBorder('valid');
    //     } else if (tile.id) {
    //       setBorder('default');
    //     } else {
    //       setBorder('noLetter');
    //     }
    //   }
    // );

    // return unsub2;
  }, [selectedTile, validmap]);

  return (
    <div style={borderStyles[border]} className="tile">
      {tile.letter}
    </div>
  );
};
