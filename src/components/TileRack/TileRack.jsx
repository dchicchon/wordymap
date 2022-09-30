
import { useDrop } from 'react-dnd'
import Tile from '../Tile'
import './TileRack.css'

export const TileRack = ({ game, update }) => {

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'tile',
        drop: (item) => {
            // Checking if tile is in tilerack. If not, lets let it drop here
            if (isNaN(item.index)) {
                console.log('Adding back to rack');
                const tile = game.getTile(item.x, item.y)
                game.addToTileRack(tile); // add to rack
                game.removeTile(item.x, item.y) // remove from board
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        })
    }), [game])

    const buildRack = () => {
        const rack = []
        for (let i = 0; i < game.tiles.length; i++) {
            const tile = game.tiles[i]
            rack.push(<Tile update={update} key={i} index={i} tile={tile} />);
        }
        return rack;
    }

    return (
        <div id='tilerack-wrapper'>
            <div id='tilerack' style={{
                backgroundColor: isOver && canDrop ? '#353535' : ''
            }} ref={drop}>
                {buildRack()}
            </div>
        </div>
    )
}
