// import { useDrag } from "react-dnd";
import { useStore } from '../../utils/store';
import { useEffect, useState } from 'react';
import './Tile.css';

const borderStyles = {
  noLetter: {
    border: '1px solid transparent',
    // opacity: 0
    // display: 'none',
  },
  valid: {
    border: '1px solid rgb(20, 157, 236)',
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
  const [border, setBorder] = useState(false);

  useEffect(() => {
    // Consider using zustand subscriptions for this instead
    if (selectedTile && selectedTile.id === tile.id) {
      setBorder('selected');
    } else if (tile.valid) {
      setBorder('valid');
    } else if (tile.id) {
      setBorder('default');
    } else {
      setBorder('noLetter');
    }
  }, [selectedTile]);

  return (
    <div style={borderStyles[border]} className="tile">
      {tile.letter}
    </div>
  );
};
