import { wordObj } from "./words.js";
// import { nanoid } from 'nanoid';

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

const startingTilesNum = 10;
class Game {
  constructor(availableTiles) {
    // store game data in 
    this.availableTiles = availableTiles
    this.totalTiles = 0;
    this.validNum = 0;
    this.size = 20;
    this.tilerack = [];
    this.tilemap = [];
    this.validmap = [];
    this.setup();
    // this.tilerack = this.buildRack();
    // this.tilemap = this.buildMaps();
  }

  setup() {
    this.buildRack()
    this.buildTileMap();
    this.buildValidMap();
  }

  buildTileMap() {
    const map = [];
    for (let y = 0; y < this.size; y++) {
      map[y] = [];
      for (let x = 0; x < this.size; x++) {
        const emptyTile = {
          letter: '',
          x,
          y,
        };
        map[y][x] = emptyTile;
      }
    }
    this.tilemap = map;
  }
  buildRack() {
    for (let i = 0; i < startingTilesNum; i++) {
      this.totalTiles += 1;
      const tile = this.availableTiles.pop();
      this.tilerack.push(tile);
    }
  }
  buildValidMap() {
    const map = []
    for (let y = 0; y < this.size; y++) {
      map[y] = [];
      for (let x = 0; x < this.size; x++) {
        map[y][x] = 0;
      }
    }
    this.validmap = map;
  }
  isValid(x, y) {
    return this.tilemap[y][x].valid;
  }

  setValid(x, y) {
    if (!this.isValid(x, y)) {
      this.validNum += 1;
      this.tilemap[y][x].valid = true;
    }
  }

  removeValid(x, y) {
    if (this.isValid(x, y)) {
      if (this.validNum > 0) this.validNum -= 1;
      // this.validmap[y][x] = false;
      this.tilemap[y][x].valid = false;

    }
  }
}

export default Game;
