
const startingTilesNum = 10;
class Game {
  constructor(availableTiles) {
    this.availableTiles = availableTiles
    this.totalTiles = 0;
    this.validNum = 0;
    this.size = 20;
    this.tilerack = [];
    this.tilemap = [];
    this.validmap = [];
    this.setup();
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
}

export default Game;
