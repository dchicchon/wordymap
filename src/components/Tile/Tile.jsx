
import './Tile.css'
import { useDrag } from 'react-dnd'

export const Tile = ({ tile, index, x, y, valid }) => {

    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: 'tile',
            item: () => {
                return {
                    index: index,
                    x: x,
                    y: y,
                    valid: valid,
                }
            },
            collect: (monitor) => {
                return {
                    isDragging: !!monitor.isDragging(),
                }
            },
        }),
        []
    )

    const borderStyle = () => {
        if (!tile) {
            return {
                border: '1px solid transparent'
            }
        }
        if (valid) {
            return {
                border: '1px solid green'
            }
        }
        return {
            border: '1px solid rgb(20, 157, 236)'
        }
    }

    return (
        <div ref={drag} style={borderStyle()} className='tile'>
            {tile}
        </div>
    )
}