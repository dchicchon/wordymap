import { create } from 'zustand';
// import { wordObj } from './words';
import { nanoid } from 'nanoid';
import { noise, noiseSeed } from '@chriscourses/perlin-noise';
import { subscribeWithSelector } from 'zustand/middleware';
import Game from './Game';

const date = new Date();
date.setUTCHours(0);
date.setUTCMinutes(0);
date.setUTCSeconds(0);
date.setUTCMilliseconds(0);
noiseSeed(date.getTime());

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

// const beta = 'TESTMT';
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
      letter,
      loc: 'rack',
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

let wcCount = 0;
function wordCheck(x, y, tilemap, validmap, wordObj) {
  console.log('wordcheck', wcCount++);
  const startX = x;
  const startY = y;
  const startingTile = tilemap[startY][startX];

  const directions = {
    ORIENTATIONX: {
      left: 'BEHIND',
      right: 'AHEAD',
    },
    ORIENTATIONY: {
      up: 'BEHIND',
      down: 'AHEAD',
    },
  };

  const updateMap = {
    BEHIND: (val) => val - 1,
    AHEAD: (val) => val + 1,
  };

  const insertMap = {
    BEHIND: (letter, word) => letter.concat(word),
    AHEAD: (letter, word) => word.concat(letter),
  };

  let firstWordValid = false;

  Object.keys(directions).forEach((lookKey) => {
    console.log('Checking:', lookKey);
    // Start building a word for each direction
    let word = startingTile.letter;
    const orientation = directions[lookKey];
    const startingCoord = [startX, startY];
    const coords = [startingCoord];

    console.log('starting coords', ...coords);
    Object.keys(orientation).forEach((orientationKey) => {
      let insertPos = orientation[orientationKey];
      const update = updateMap[insertPos];
      const insert = insertMap[insertPos];
      let currentX = startX;
      let currentY = startY;

      let iters = 0;
      const maxIterations = 50;
      while (iters < maxIterations) {
        if (lookKey === 'ORIENTATIONX') {
          currentX = update(currentX);
        }
        if (lookKey === 'ORIENTATIONY') {
          currentY = update(currentY);
        }

        if (!inBounds(currentX, currentY, tilemap)) break;

        const nextTile = tilemap[currentY][currentX];
        if (!nextTile.letter) break;

        const newIndex = [currentX, currentY];
        coords.push(newIndex);

        word = insert(nextTile.letter, word);
        iters++;
      }
    });

    console.log('end coords', ...coords);
    console.log('created word', word);
    const validWord = wordObj[word];
    if (validWord) {
      console.log({ validWord, word });
      firstWordValid = true;
      coords.forEach(([x, y]) => {
        if (tilemap[y][x].letter) {
          validmap[y][x] = 1;
        }
      });
    } else {
      if (firstWordValid) coords.shift(); // remove first index so we don't set it as invalid
      coords.forEach(([x, y]) => {
        validmap[y][x] = 0;
      });
    }
  });
}

const formatTime = (totalSeconds) => {
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
  return timerDisplay;
};

function clusterCount(x, y, map, memo = { sum: 0 }) {
  const char = map[y][x].id;
  if (char) memo.sum += 1;
  // setting it to empty to ensure that we've counted it
  const emptyTile = {
    letter: '',
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

function getValidAdjecentTiles(x, y, tilemap) {
  if (isNaN(x) || isNaN(y)) return [];

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
  const clusterNumber = clusterCount(x, y, copymap);
  return tilesInPlay === clusterNumber && validCount === tilesInPlay;
}

export const useStore = create(
  subscribeWithSelector((set, get) => ({
    devMode: import.meta.env.MODE === 'development',
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
    wordObj: {},
    startGame: async () => {
      const { wordObj } = await import('./words');
      return set(() => {
        return {
          wordObj,
          ready: true,
        };
      });
    },
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
    getValidAdjecentTiles: (x, y) => {
      const tilemap = get().tilemap;
      if (isNaN(x) || isNaN(y)) return [];

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
    },
    updateTileMapNum: (change) =>
      set((state) => {
        return {
          tilemapNum: state.tilemapNum + change,
        };
      }),
    removeTileFromRack: (id) =>
      set((state) => {
        const tilerack = state.tilerack.slice().filter((tile) => tile.id !== id);
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
          loc: 'rack',
          index: tilerack.length,
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
          loc: 'map',
        };
        state.tilemap[y][x] = emptyTile;
        state.validmap[y][x] = 0;
        return {
          tilemap: state.tilemap,
          validmap: state.validmap,
        };
      }),
    setSelectedTile: (pressedTile) => {
      console.log({ pressedTile });
      return set({ selectedTile: pressedTile });
    },
    removeTileFromMap: (tile) => {
      console.log('removeTileFromMap');
      // we can run a get for the wordobj
      const { wordObj } = get();
      return set((state) => {
        const tilerack = state.tilerack.slice();
        const tilemap = state.tilemap.map((row) => row.slice()); // need this method to properly get tiles
        const validmap = state.validmap.map((row) => row.slice());
        const { tilemapNum } = state;
        const emptyTile = {
          letter: '',
          x: tile.x,
          y: tile.y,
          loc: 'map',
        };

        // remove the validity and then run a check on the adjecent tiles
        tilemap[tile.y][tile.x] = emptyTile;
        validmap[tile.y][tile.x] = 0;

        const validTiles = getValidAdjecentTiles(tile.x, tile.y, tilemap);
        validTiles.forEach((validTile) => {
          wordCheck(validTile.x, validTile.y, tilemap, validmap, wordObj);
        });

        const newTile = {
          letter: tile.letter,
          id: tile.id,
          loc: 'rack',
        };
        console.log({ tilemap });
        tilerack.push(newTile);
        return {
          selectedTile: null,
          tilerack,
          tilemap,
          validmap,
          tilemapNum: tilemapNum - 1,
        };
      });
    },
    setTile: (x, y, tile) =>
      set((state) => {
        const validmap = state.validmap.map((row) => row.slice());
        const tilemap = state.tilemap.map((row) => row.slice());
        const newTile = {
          ...tile,
          x,
          y,
          loc: 'map',
        };
        tilemap[y][x] = newTile;

        if (!newTile.letter) {
          validmap[y][x] = 0;
        }

        return {
          selectedTile: null,
          tilemap,
          validmap,
        };
      }),

    runWordCheck: (coords) => {
      const { wordObj, tilemap, tilerack, validmap } = get();
      return set((state) => {
        // const tilemap = state.tilemap.slice();
        // const tilerack = state.tilerack.slice();
        // const validmap = state.validmap.slice();
        coords.forEach(([x, y]) => {
          wordCheck(x, y, tilemap, validmap, wordObj);
        });

        let gameWon = false;
        let ready = true;
        if (tilerack.length === 0) {
          const [x, y] = coords[0];
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
          tilemap,
          validmap,
          gameWon,
          ready,
        };
      });
    },
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
        const newRack = tilerack.filter((tile, index) => {
          return index !== selectedIndex;
        });
        const [returnedTile] = tilerack.splice(selectedIndex, 1);
        availableTiles.unshift(returnedTile);
        for (let i = 0; i < 2; i++) {
          const newTile = availableTiles.pop();
          newRack.push(newTile);
        }

        return {
          selectedTile: null,
          availableTiles,
          tilerack: newRack,
          tilesInPlay: state.tilesInPlay + 1,
        };
      }),
  }))
);
