import TileRack from '../TileRack'
import TilesBoard from '../TilesBoard'
import Game from '../../Game'
import './Board.css'
import { useState, useMemo } from 'react'

export const Board = () => {

    const [tile, setTile] = useState('')
    const game = useMemo(() => new Game(), [])
    // now we can pass functions based on game changes?
    return (
        <div id='board'>
            <TilesBoard update={setTile} game={game} />
            <TileRack update={setTile} game={game} />
        </div>
    )

}
