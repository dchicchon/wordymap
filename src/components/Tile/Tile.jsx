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

// remove DND and just use click
export const Tile = ({ tile }) => {
  // check for valid
  // check for selected

  // lets just subscribe to the currently selected letter
  // if it's the case that it's the same id, then we highlight it?
  const selectedTile = useStore((state) => state.selectedTile);
  // const setSelectedTile = useStore((state) => state.setSelectedTile);
  const [border, setBorder] = useState(false);

  useEffect(() => {
    // check if the selectedTile id is the same as this id
    if (selectedTile && selectedTile.id === tile.id) {
      setBorder('selected');
    } else if (tile.valid) {
      setBorder('valid');
    } else if (tile.letter) {
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
