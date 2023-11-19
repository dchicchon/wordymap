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
  const selectedTile = useStore((state) => state.selectedTile);
  const validmap = useStore((state) => state.validmap);
  const [border, setBorder] = useState(false);

  useEffect(() => {
    // perhaps we should only re render if we have stuff?
    // we need ot subscribe to validmap and selected tiles?
    if (selectedTile && selectedTile.id === tile.id) {
      setBorder('selected');
    } else if (
      tile.y !== null &&
      tile.y >= 0 &&
      tile.x !== null &&
      tile.x >= 0 &&
      validmap[tile.y][tile.x]
    ) {
      setBorder('valid');
    } else if (tile.id) {
      setBorder('default');
    } else {
      setBorder('noLetter');
    }

    // return unsub2;
  }, [selectedTile, validmap]);

  return (
    <div style={borderStyles[border]} className="tile">
      {tile.letter}
    </div>
  );
};
