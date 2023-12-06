import { create } from 'zustand';
import { wordObj } from './words';
import { nanoid } from 'nanoid';
import { noise, noiseSeed } from '@chriscourses/perlin-noise';

// we should grab only the perlin noise from q5
import { subscribeWithSelector } from 'zustand/middleware';
import Game from './Game';

noiseSeed(1);
// const sketchInstance = new q5js();
// noise seed could be based on day?
// sketchInstance.noiseSeed(1);

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

function map(value, start1, stop1, start2, stop2) {
  const isInvalid = start1 > value || value > stop1;
  if (isInvalid) {
    throw Error('Provided value is out of bounds');
  }
  const mappedValue = ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  return mappedValue;
}

function setupTiles() {
  const gameTiles = [];
  const remainingAlpha = alpha.slice().split('');
  for (let i = 0; i < alpha.length; i++) {
    const outputX = noise(i);
    const add = parseInt(outputX.toString()[5]);
    const index = Math.floor(map(add, 0, 9, 0, remainingAlpha.length - 1));
    const [letter] = remainingAlpha.splice(index, 1);
    const tile = {
      id: nanoid(),
      x: null,
      y: null,
      letter,
    };
    gameTiles.push(tile);
  }
  return gameTiles;
}

const gameTiles = setupTiles();
const initialGame = new Game(gameTiles);

function inBounds(x, y, map) {
  if (x < 0 || x >= map.length) return false;
  if (y < 0 || y >= map.length) return false;
  return true;
}

function wordCheck(x, y, tilemap, validmap) {
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
      while (iters < 10) {
        if (lookKey === ORIENTATIONX) {
          currentX = update(currentX);
        }
        if (lookKey === ORIENTATIONY) {
          currentY = update(currentY);
        }
        // if out of bounds
        if (!inBounds(currentX, currentY, tilemap)) {
          break;
        }

        const nextTile = tilemap[currentY][currentX];
        if (!nextTile.id) break;
        const newIndex = [currentX, currentY]; // push position of this tile for later
        indicies.push(newIndex);

        // word = insertMap[insertPos];
        word = insert(nextTile.letter, word);
        iters++;
      }
    });

    const validWord = wordObj[word];
    if (validWord) {
      // lets double check each index
      // we could double check the length of the word here
      // and remove the indicies that are not valid
      firstWordValid = true;
      indicies.forEach(([x, y]) => {
        if (tilemap[y][x].letter) {
          validmap[y][x] = 1;
        }
      });
    } else {
      if (firstWordValid) indicies.shift(); // remove first index so we don't set it as invalid
      indicies.forEach(([x, y]) => {
        validmap[y][x] = 0;
      });
    }
  });

  return { tilemap, validmap };
}

const formatTime = (totalSeconds) => {
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
  return timerDisplay;
};
// counting full system
function clusterCount(x, y, map, memo = { sum: 0 }) {
  const char = map[y][x].id;
  if (char) memo.sum += 1;
  const emptyTile = {
    letter: '',
    index: null,
    x,
    y,
  };
  map[y][x] = emptyTile;
  const validTiles = getValidAdjecentTiles(x, y, map);
  if (validTiles.length > 0) {
    validTiles.forEach((tile) => {
      clusterCount(tile.x, tile.y, map, memo);
    });
  }
  return memo.sum;
}

// get all tile coords that are valid
function getValidAdjecentTiles(x, y, tilemap) {
  if (!x || !y) return [];

  const startX = x;
  const startY = y;

  const validTiles = [];
  const top = {
    x: startX,
    y: startY - 1,
  };
  const bottom = {
    x: startX,
    y: startY + 1,
  };
  const left = {
    x: startX - 1,
    y: startY,
  };
  const right = {
    x: startX + 1,
    y: startY,
  };

  if (inBounds(top.x, top.y, tilemap) && tilemap[top.y] && tilemap[top.y][top.x].id) {
    validTiles.push(top);
  }
  if (
    inBounds(bottom.x, bottom.y, tilemap) &&
    tilemap[bottom.y][bottom.x] &&
    tilemap[bottom.y][bottom.x].id
  ) {
    validTiles.push(bottom);
  }
  if (
    inBounds(left.x, left.y, tilemap) &&
    tilemap[left.y][left.x] &&
    tilemap[left.y][left.x].id
  ) {
    validTiles.push(left);
  }
  if (
    inBounds(right.x, right.y, tilemap) &&
    tilemap[right.y] &&
    tilemap[right.y][right.x].id
  ) {
    validTiles.push(right);
  }
  return validTiles;
}

function checkVictory(x, y, tilemap, validmap, tilesInPlay) {
  const copymap = tilemap.map((row) => row.slice());

  let validCount = 0;
  for (let y = 0; y < validmap.length; y++) {
    for (let x = 0; x < validmap[y].length; x++) {
      const valid = validmap[y][x];
      if (valid) {
        validCount += 1;
      }
    }
  }
  return tilesInPlay === clusterCount(x, y, copymap) && validCount === tilesInPlay;
}

export const useStore = create(
  subscribeWithSelector((set) => ({
    gameWon: false,
    tilesInPlay: initialGame.tilerack.length,
    tilemap: initialGame.tilemap,
    availableTiles: initialGame.availableTiles,
    validmap: initialGame.validmap,
    validNum: 0,
    tilerack: initialGame.tilerack,
    tilemapNum: 0,
    selectedTile: null,
    game: initialGame,
    gameNum: 1,
    tilesPlaced: 0,
    finalTime: 0,
    ready: false, // use this to show loading panel
    time: 0,
    startGame: () =>
      set((state) => {
        return {
          ready: true,
        };
      }),
    tick: (time) =>
      set((state) => {
        return {
          time: state.time + 1,
        };
      }),
    setFinalTime: (time) =>
      set((state) => {
        return {
          finalTime: formatTime(time),
        };
      }),
    updateTileMapNum: (change) =>
      set((state) => {
        return {
          tilemapNum: state.tilemapNum + change,
        };
      }),
    removeFromTileRack: (selectedIndex) =>
      set((state) => {
        const tilerack = state.tilerack.slice();
        tilerack.splice(selectedIndex, 1);
        return {
          selectedTile: null,
          tilerack,
          tilemapNum: state.tilemapNum + 1,
        };
      }),
    addToTileRack: (tile) =>
      set((state) => {
        const tilerack = state.tilerack.slice();
        tilerack.push({
          letter: tile.letter,
          id: tile.id,
        });
        return {
          tilerack,
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
          index: null,
          x,
          y,
        };
        state.tilemap[y][x] = emptyTile;
        return {
          tilemap: state.tilemap,
        };
      }),
    setSelectedTile: (pressedTile) =>
      set((state) => {
        if (state.selectedTile && pressedTile.id === state.selectedTile.id) {
          return {
            selectedTile: null,
          };
        }
        return {
          selectedTile: pressedTile,
        };
      }),
    removeTileFromMap: (tile) =>
      set((state) => {
        const tilerack = state.tilerack.slice();
        const tilemap = state.tilemap.map((row) => row.slice());
        const validmap = state.validmap.map((row) => row.slice());

        const { tilemapNum } = state;
        const emptyTile = {
          letter: '',
          x: tile.x,
          y: tile.y,
        };

        // remove the validity and then run a check on the adjecent tiles
        tilemap[tile.y][tile.x] = emptyTile;
        validmap[tile.y][tile.x] = 0;

        const validTiles = getValidAdjecentTiles(tile.x, tile.y, tilemap);
        validTiles.forEach((validTile) => {
          wordCheck(validTile.x, validTile.y, tilemap, validmap);
        });

        const newTile = {
          letter: tile.letter,
          id: tile.id,
        };
        tilerack.push(newTile);
        return {
          selectedTile: null,
          tilerack,
          tilemap,
          validmap,
          tilemapNum: tilemapNum - 1,
        };
      }),
    setTile: (x, y, tile) =>
      set((state) => {
        const tilerackLength = state.tilerack.length;
        const tilemap = state.tilemap.map((row) => row.slice());
        const validmap = state.validmap.map((row) => row.slice());
        const newTile = {
          ...tile,
          x,
          y,
        };
        tilemap[y][x] = newTile;

        // lets run a wordcheck on the old position of the tile
        const validTiles = getValidAdjecentTiles(tile.x, tile.y, tilemap);
        validTiles.forEach((validTile) => {
          wordCheck(validTile.x, validTile.y, tilemap, validmap);
        });

        const { validmap: newValidMap } = wordCheck(x, y, tilemap, validmap);
        let gameWon = false;
        let ready = true;
        if (tilerackLength === 0) {
          gameWon = checkVictory(x, y, tilemap, validmap, state.tilesInPlay);
          if (gameWon) {
            ready = false;

            // check if we already have scores in the local storage

            const foundScores = localStorage.getItem('scores');
            const todaysDate = new Date();
            if (foundScores) {
              const parsedScores = JSON.parse(foundScores);
              parsedScores.push(state.time);
              localStorage.setItem('scores', JSON.stringify(parsedScores));
            } else {
              const newScores = JSON.stringify([state.time]);
              localStorage.setItem('scores', newScores);
              localStorage.setItem('score-date', todaysDate.toLocaleDateString('en-US'));
            }
          }
        }

        return {
          selectedTile: null,
          gameWon,
          ready,
          tilemap,
          validmap: newValidMap,
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
        const gameTiles = setupTiles();
        const newGame = new Game(gameTiles);
        return {
          // gameNum: state.gameNum + 1,
          game: newGame,
          tilesInPlay: newGame.tilerack.length,
          tilemap: newGame.tilemap,
          availableTiles: newGame.availableTiles,
          validmap: newGame.validmap,
          tilerack: newGame.tilerack,
          ready: false,
          gameWon: false,
          time: 0,
        };
      }),
    returnToPile: (selectedIndex) =>
      set((state) => {
        const tilerack = state.tilerack.slice();
        const availableTiles = state.availableTiles.slice();
        const [returnedTile] = tilerack.splice(selectedIndex, 1);
        availableTiles.unshift(returnedTile);
        for (let i = 0; i < 2; i++) {
          tilerack.push(availableTiles.pop());
        }
        return {
          selectedTile: null,
          availableTiles,
          tilerack,
          tilesInPlay: state.tilesInPlay + 1,
        };
      }),
  }))
);
