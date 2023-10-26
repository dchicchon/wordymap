import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import Game from './Game';
import { nanoid } from 'nanoid';

const wordObj = {
  HELLO: true,
  AT: true,
  TO: true,
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
// now we basically only use the game class to init
// we need to bring more game logic now?

export const useStore = create(
  subscribeWithSelector((set) => ({
    tilemap: initialGame.tilemap,
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
        state.tilerack.push(tile);
        const emptyTile = {
          letter: '',
          valid: false,
          index: null,
          x: tile.x,
          y: tile.y,
        };
        state.tilemap[tile.y][tile.x] = emptyTile;
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
          index: null,
          x,
          y,
        };
        state.tilemap[y][x] = newTile;
        return {
          tilemap: state.tilemap,
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
