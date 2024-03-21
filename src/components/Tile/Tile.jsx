// import { useDrag } from "react-dnd";
import { useStore } from '../../utils/store';
import { useEffect, useState } from 'react';
import styles from './Tile.module.css';

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

export const Tile = ({ tile, index }) => {
  const {
    devMode,
    selectedTile,
    setSelectedTile,
    runWordCheck,
    removeTileFromMap,
    addToTileRack,
    removeTile,
    setTile,
    returnToPile,
    removeTileFromRack,
    getValidAdjecentTiles,
    validmap,
  } = useStore();
  const tilemap = useStore((state) => state.tilemap);

  // perhaps we should be adding an index to the tile as well?
  const [border, setBorder] = useState(false);
  useEffect(() => {
    if (selectedTile && selectedTile.id === tile.id) {
      setBorder('selected');
    } else if (
      tile.letter &&
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
  }, [selectedTile, validmap]);

  const clickTile = (e) => {
    if (!selectedTile && !tile.letter) {
      return;
    } else if (!selectedTile && tile.letter) {
      setSelectedTile(tile);
    } else {
      if (tile.loc === 'map') {
        const wordcheckCoords = [[tile.x, tile.y]];
        if (selectedTile.id === tile.id) {
          removeTileFromMap(selectedTile);
          setSelectedTile(null);
          // we already do a wordcheck when we remove it from the map?
          // runWordCheck(wordcheckCoords);
          return;
        }

        if (selectedTile.loc === 'rack') {
          removeTileFromRack(selectedTile.id);
        }
        // remove tile at the old location
        if (selectedTile.loc === 'map') {
          if (tile.letter) {
            wordcheckCoords.push([selectedTile.x, selectedTile.y]);
          } else {
            // we should look for surrounding valid tiles
            const validTiles = getValidAdjecentTiles(
              selectedTile.x,
              selectedTile.y,
              tilemap
            );
            console.log({ validTiles }); // array with objects that are positions
            validTiles.forEach((validTile) => {
              wordcheckCoords.push([validTile.x, validTile.y]);
            });
          }
          // we should check if the current tile is empty?
          removeTile(selectedTile.x, selectedTile.y);
        }
        // empty tile, lets add our thing
        if (tile.letter) {
          if (selectedTile.loc === 'map') {
            setTile(selectedTile.x, selectedTile.y, tile);
          } else {
            addToTileRack(tile);
          }
        }
        // we should do an else statement if the tile is empty?

        setTile(tile.x, tile.y, selectedTile);
        runWordCheck(wordcheckCoords);
      }
      if (tile.loc === 'rack') {
        // return to pile if its already selected
        if (selectedTile.id === tile.id) {
          returnToPile(index);
          setSelectedTile(null);
        } else {
          setSelectedTile(tile);
        }
      }
    }
  };

  if (!tile.letter) {
    return (
      <div className={styles.emptyTile} onClick={clickTile}>
        {devMode && (
          <div
            style={{
              position: 'absolute',
              fontSize: 8,
            }}
          >
            {tile.x},{tile.y}
          </div>
        )}

        <p></p>
      </div>
    );
  }

  return (
    <div style={borderStyles[border]} className={styles.tile} onClick={clickTile}>
      {devMode && (
        <div
          style={{
            position: 'absolute',
            fontSize: 8,
          }}
        >
          {tile.x},{tile.y}
        </div>
      )}

      {tile.letter}
    </div>
  );
};
