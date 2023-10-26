import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import Game from './Game';

const wordObj = {
  HELLO: true,
  AT: true,
  IT: true,
  TOO: true,
  TOOT: true,
  TO: true,
  DO: true,
  GO: true,
  SO: true,
  OF: true,
  BE: true,
  ME: true,
  YOU: true,
  QI: true,
};

// perhaps we should just bring this to zustand
const Alpha = {
  alpha: '',
  rs: function (char, num) {
    const str = ''.concat(char).repeat(num);
    this.alpha = this.alpha.concat(str);
    return this;
  },
  s: function () {
    return this.alpha;
  },
};

/**
 Bananagrams distribution
 2: J, K, Q, X, Z
 3: B, C, F, H, M, P, V, W, Y
 4: G
 5: L
 6: D, S, U
 8: N
 9: T, R
 11: O
 12: I
 13: A
 18: E
 */
let alpha = Alpha.rs('E', 18)
  .rs('A', 13)
  .rs('I', 12)
  .rs('O', 11)
  .rs('TR', 9)
  .rs('N', 8)
  .rs('DSU', 6)
  .rs('L', 5)
  .rs('G', 4)
  .rs('BCFHMPVWY', 3)
  .rs('JKQXZ', 2)
  .s();

const initialGame = new Game();

function inBounds(x, y, map) {
  if (x < 0 || x >= map.length) return false;
  if (y < 0 || y >= map.length) return false;
  return true;
}

const wordCheck = (x, y, tilemap, validmap) => {
  const startX = x;
  const startY = y;
  const startingTile = tilemap[startY][startX]; // starting tile
  const ORIENTATIONX = 'ORIENTATIONX';
  const ORIENTATIONY = 'ORIENTATIONY';
  const BEHIND = 'BEHIND';
  const AHEAD = 'AHEAD';

  const look = {
    [ORIENTATIONX]: {
      left: BEHIND,
      right: AHEAD,
    },
    [ORIENTATIONY]: {
      up: BEHIND,
      down: AHEAD,
    },
  };

  const updateMap = {
    [BEHIND]: (val) => val - 1,
    [AHEAD]: (val) => val + 1,
  };

  const insertMap = {
    [BEHIND]: (letter, word) => letter.concat(word),
    [AHEAD]: (letter, word) => word.concat(letter),
  };

  let firstWordValid = false;

  // Go through x or y
  Object.keys(look).forEach((lookKey) => {
    let word = startingTile.letter; // add to the front or back of this word while we go
    const orientation = look[lookKey];
    const indicies = [];
    const startIndex = [startX, startY];
    indicies.push(startIndex);
    Object.keys(orientation).forEach((orientationKey) => {
      let insertPos = orientation[orientationKey];
      const update = updateMap[insertPos];
      const insert = insertMap[insertPos];
      let currentX = startX;
      let currentY = startY;

      let iters = 0;
      // BEFORE WHILE LOOP
      while (iters < 10) {
        if (lookKey === ORIENTATIONX) {
          // currentX = update(currentX);
          currentX = updateMap[insertPos](currentX);
        }
        if (lookKey === ORIENTATIONY) {
          // currentX = update(currentY);
          currentX = updateMap[insertPos](currentX);
        }
        // if out of bounds
        if (!inBounds(currentX, currentY, tilemap)) {
          break;
        }

        const nextTile = tilemap[currentY][currentX];
        if (!nextTile.id) {
          break;
        }
        const newIndex = [currentX, currentY]; // push position of this tile for later
        indicies.push(newIndex);

        // word = insertMap[insertPos];
        word = insert(nextTile.letter, word);
        iters++;
      }
    });

    const validWord = wordObj[word];
    if (validWord) {
      firstWordValid = true;
      indicies.forEach(([x, y]) => {
        validmap[y][x] = 1;
      });
    } else {
      if (firstWordValid) indicies.shift(); // remove first index so we don't set it as invalid
      indicies.forEach(([x, y]) => {
        validmap[y][x] = 0;
      });
    }
  });

  // we're checking if we should add a new letter
  // if (this.tiles.length === 0 && this.validNum === this.totalTiles) {
  //   const copymap = JSON.parse(JSON.stringify(this.tilemap));
  //   const count = this.clustercount(x, y, copymap);
  //   if (count !== this.totalTiles) return;
  //   if (this.availableLetters.length === 0) {
  //     console.log('You win!');
  //     return;
  //   }
  //   // const newTile = this.getRandomLetter();
  //   const newTile = {
  //     x: null,
  //     y: null,
  //     valid: false,
  //     index: this.tiles.length,
  //     letter: this.getRandomLetter(),
  //   };
  //   this.tiles.push(newTIle);
  //   // this.addToTileRack(newTile);
  //   this.totalTiles += 1;
  // }
  return { tilemap, validmap };
};

export const useStore = create(
  subscribeWithSelector((set) => ({
    tilemap: initialGame.tilemap,
    validmap: initialGame.validmap,
    validNum: 0,
    tilerack: initialGame.tilerack,
    tilemapNum: 0,
    selectedTile: null,
    game: initialGame,
    gameNum: 1,
    tilesPlaced: 0,
    ready: false, // use this to show loading panel
    updateTileMapNum: (change) =>
      set((state) => {
        return {
          tilemapNum: state.tilemapNum + change,
        };
      }),
    removeFromTileRack: (selectedIndex) =>
      set((state) => {
        state.tilerack.splice(selectedIndex, 1);
        return {
          tilerack: state.tilerack,
          tilemapNum: state.tilemapNum + 1,
        };
      }),
    addToTileRack: (tile) =>
      set((state) => {
        state.tilerack.push(tile);
        return {
          tilerack: state.tilerack,
        };
      }),
    setTileRack: (rack) =>
      set((state) => {
        return {
          tilerack: rack,
        };
      }),
    setTileMap: (map) =>
      set((state) => {
        return {
          tilemap: map,
        };
      }),
    removeTile: (x, y) =>
      set((state) => {
        const emptyTile = {
          letter: '',
          valid: false,
          index: null,
          x,
          y,
        };
        state.tilemap[y][x] = emptyTile;
        return {
          tilemap: state.tilemap,
        };
      }),
    setSelectedTile: (tile) =>
      set(() => {
        return { selectedTile: tile };
      }),
    removeTileFromMap: (tile) =>
      set((state) => {
        const emptyTile = {
          letter: '',
          valid: false,
          x: tile.x,
          y: tile.y,
        };
        state.tilemap[tile.y][tile.x] = emptyTile;
        delete tile.x;
        delete tile.y;
        state.tilerack.push(tile);
        return {
          tilerack: state.tilerack,
          tilemap: state.tilemap,
          tilemapNum: state.tilemapNum - 1,
        };
      }),
    setTile: (x, y, tile) =>
      set((state) => {
        const newTile = {
          ...tile,
          x,
          y,
        };
        state.tilemap[y][x] = newTile;
        const { validmap, tilemap } = wordCheck(x, y, state.tilemap, state.validmap);
        const validNum = validmap.reduce((acc, row) => {
          return row.reduce((acc, num) => acc + num, 0) + acc;
        }, 0);
        console.table(validmap);
        return {
          validmap,
          tilemap,
          validNum,
        };
      }),
    addTilesPlaced: () =>
      set((state) => {
        return {
          tilesPlaced: state.tilesPlaced + 1,
        };
      }),
    updateGame: (game) =>
      set(() => {
        return { game };
      }),
    resetGame: () =>
      set((state) => {
        // we might as well also
        return {
          game: new Game(),
          gameNum: state.gameNum + 1,
        };
      }),
  }))
);
