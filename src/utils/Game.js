import { wordObj } from "./words.js";

const Alpha = {
  alpha: "",
  rs: function (char, num) {
    const str = "".concat(char).repeat(num);
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
let alpha = Alpha.rs("E", 18)
  .rs("A", 13)
  .rs("I", 12)
  .rs("O", 11)
  .rs("TR", 9)
  .rs("N", 8)
  .rs("DSU", 6)
  .rs("L", 5)
  .rs("G", 4)
  .rs("BCFHMPVWY", 3)
  .rs("JKQXZ", 2)
  .s();

class Game {
  constructor() {
    this.availableLetters = alpha.slice();
    this.totalTiles = 0;
    this.validNum = 0;
    this.tiles = [];
    this.tilemap = [];
    this.validmap = [];
    this.size = 32;
    this.setup();
  }

  setup() {
    this.buildMaps();
    this.setupTileRack();
  }

  reset() {
    // reset the game
    this.tiles = [];
    this.points = 0;
    this.setup();
  }

  buildMaps() {
    for (let i = 0; i < this.size; i++) {
      this.tilemap[i] = [];
      this.validmap[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.tilemap[i][j] = "";
        this.validmap[i][j] = false;
      }
    }
  }

  // read the validmap and look for bool
  isValid(x, y) {
    return this.validmap[y][x];
  }

  setValid(x, y) {
    if (!this.isValid(x, y)) {
      this.validNum += 1;
      this.validmap[y][x] = true;
    }
  }

  removeValid(x, y) {
    if (this.isValid(x, y)) {
      if (this.validNum > 0) this.validNum -= 1;
      this.validmap[y][x] = false;
    }
  }

  // start check from this coordinate
  // words only valid going down or to the right
  wordCheck(x, y) {
    const startX = x;
    const startY = y;
    const startingTile = this.tilemap[startY][startX]; // starting tile
    const ORIENTATIONX = "ORIENTATIONX";
    const ORIENTATIONY = "ORIENTATIONY";
    const BEHIND = "BEHIND";
    const AHEAD = "AHEAD";

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
      [BEHIND]: (tile, word) => tile.concat(word),
      [AHEAD]: (tile, word) => word.concat(tile),
    };

    let firstWordValid = false;

    // Go through x or y
    Object.keys(look).forEach((lookKey) => {
      let word = startingTile; // add to the front or back of this word while we go
      const orientation = look[lookKey];
      const indicies = [];
      const startIndex = [startX, startY];
      indicies.push(startIndex);
      // Go left to right || up to down
      Object.keys(orientation).forEach((orientationKey) => {
        let insertPos = orientation[orientationKey];
        const update = updateMap[insertPos];
        const insert = insertMap[insertPos];
        let currentX = startX;
        let currentY = startY;

        while (true) {
          if (lookKey === ORIENTATIONX) {
            currentX = update(currentX);
          }
          if (lookKey === ORIENTATIONY) {
            currentY = update(currentY);
          }
          // if out of bounds
          if (!this.inBounds(currentX, currentY)) break;

          const newTile = this.getTile(currentX, currentY);
          if (!newTile || newTile.length === 0) break; // if no tile exists

          const newIndex = [currentX, currentY]; // push position of this tile for later
          indicies.push(newIndex);

          word = insert(newTile, word);
        }
      });
      const validWord = wordObj[word];
      if (validWord) {
        firstWordValid = true;
        // console.log("Valid word", word);
        indicies.forEach((pos) => {
          // console.log('Set valid:', ...pos)
          this.setValid(...pos);
        });
      } else {
        // console.log("Not a valid word");
        if (firstWordValid) indicies.shift(); // remove first index so we don't set it as invalid
        indicies.forEach((pos, i) => {
          // console.log('Remove valid:', ...pos)
          this.removeValid(...pos);
        });
      }
    });

    if (this.tiles.length === 0 && this.validNum === this.totalTiles) {
      const copymap = JSON.parse(JSON.stringify(this.tilemap))
      const count = this.clustercount(x, y, copymap)
      if (count !== this.totalTiles) return;
      if (this.availableLetters.length === 0) {
        console.log("You win!");
        return;
      }
      const newTile = this.getRandomTile();
      this.addToTileRack(newTile);
      this.totalTiles += 1;
    }
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   *  Starting at point x and y, we will count the size of the
   *  word cluster
   */
  clustercount(x, y, map, memo = { sum: 0 }) {
    const char = map[y][x];
    if (char) memo.sum += 1;
    map[y][x] = "";
    const validTiles = this.getValidAdjecentTiles(x, y, map);
    if (validTiles.length > 0) {
      validTiles.forEach((tile) => {
        this.clustercount(...tile, map, memo);
      });
    }
    return memo.sum;
  }

  inBounds(x, y) {
    if (x < 0 || x >= this.size.length) return false;
    if (y < 0 || y >= this.size.length) return false;
    return true;
  }

  getValidAdjecentTiles(x, y, map) {
    const startX = x;
    const startY = y;

    const validTiles = [];
    const top = [startX, startY - 1];
    const bottom = [startX, startY + 1];
    const left = [startX - 1, startY];
    const right = [startX + 1, startY];

    if (this.inBounds(...top) && this.getTile(...top, map)) {
      validTiles.push(top);
    }
    if (this.inBounds(...bottom) && this.getTile(...bottom, map)) {
      validTiles.push(bottom);
    }
    if (this.inBounds(...left) && this.getTile(...left, map)) {
      validTiles.push(left);
    }
    if (this.inBounds(...right) && this.getTile(...right, map)) {
      validTiles.push(right);
    }
    return validTiles;
  }

  // get a tile
  getTile(x, y, map) {
    if (map) return map[y][x];
    return this.tilemap[y][x];
  }

  // placing a tile from rack
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} index
   */
  placeTile(x, y, index) {
    const tile = this.tiles[index];
    const current = this.getTile(x, y);
    this.setTile(x, y, tile);
    this.removeFromTileRack(index);

    // if theres a tile already there, we should bring it back to the rack
    if (current) {
      this.addToTileRack(current);
    }

    this.wordCheck(x, y);
  }

  // set a tile on a space
  setTile(x, y, tile) {
    this.tilemap[y][x] = tile;
  }

  // anytime we move a tile, we should always do a word check
  moveTile(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) return; // check if it's the same tile
    const firstTile = this.getTile(x1, y1);
    const secondTile = this.getTile(x2, y2);

    // should remove the valid at both of these tiles
    this.removeValid(x1, y1);
    this.removeValid(x2, y2);
    // set the tiles
    this.setTile(x2, y2, firstTile);
    this.setTile(x1, y1, secondTile);

    if (secondTile) {
      this.wordCheck(x1, y1); // check the first position with the new tile
    } else {
      const validAdjectTiles = this.getValidAdjecentTiles(x1, y1);
      validAdjectTiles.forEach((coord) => {
        this.wordCheck(...coord);
      });
    }
    this.wordCheck(x2, y2); // check word at the second position
  }
  // anytime we remove a tile from the board, check the adjecent tiles
  removeTile(x, y) {
    this.tilemap[y][x] = "";
    this.removeValid(x, y);
    const validAdjecentTiles = this.getValidAdjecentTiles(x, y); // checking for valid adjecent tiles
    if (validAdjecentTiles.length > 0) {
      validAdjecentTiles.forEach((tile) => {
        this.wordCheck(...tile);
      });
    }
  }

  getRandomTile() {
    const index = Math.floor(Math.random() * this.availableLetters.length);
    const char = this.availableLetters[index];
    const firstHalf = this.availableLetters.slice(0, index);
    const secondHalf = this.availableLetters.slice(index + 1);
    this.availableLetters = firstHalf.concat(secondHalf);
    return char;
  }

  setupTileRack() {
    // start with 21 tiles
    for (let i = 0; i < 21; i++) {
      this.totalTiles += 1;
      const letter = this.getRandomTile();
      this.addToTileRack(letter);
    }
  }

  addToTileRack(tile) {
    this.tiles.push(tile);
  }

  removeFromTileRack(index) {
    this.tiles.splice(index, 1);
  }
}

export default Game;
