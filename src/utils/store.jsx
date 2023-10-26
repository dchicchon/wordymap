import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import Game from './Game';

// maybe we should migrate the game here?
const initialGame = new Game();
export const useStore = create((set) => ({
  tilerack: initialGame.tiles,
  removeFromTileRack: (selectedIndex) =>
    set((state) => {
      const tilerack = state.tilerack.filter((_, index) => index !== selectedIndex);
      state.game.removeFromTileRack(selectedIndex);
      return {
        tilerack,
      };
    }),

  setTileRack: (rack) =>
    set((state) => {
      console.log({ rack });
      // we should be updating our game directly through here
      return {
        tilerack: rack,
      };
    }),
  tilemap: initialGame.tilemap,
  setTileMap: (map) =>
    set((state) => {
      console.log({ map });
      return {
        tilemap: map,
      };
    }),
  selectedTile: null,
  setSelectedTile: (tile) =>
    set(() => {
      console.log({ selectedTile: tile });
      return { selectedTile: tile };
    }),
  game: initialGame,
  gameNum: 1,
  tilesPlaced: 0,
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
}));
