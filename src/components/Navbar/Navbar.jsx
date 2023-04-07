
import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

// should contain info about the game being played
const Navbar = ({ game, resetGame, gameNum }) => {
    const [time, setTime] = useState(0)
    useEffect(() => {
        console.log('create navbar')
        const newTimer = setInterval(() => setTime(prevTime => prevTime + 1), 1000)
        return () => {
            setTime(0);
            clearInterval(newTimer);
        }
    }, [gameNum])

    return (
        <div className={styles.navbar}>
            <h4>Wordymap</h4>
            <h4>Time: {time}</h4>
            <h4>Tiles Left: {game.availableLetters.length + game.tiles.length}</h4>
            <button onClick={resetGame} className={styles.button}>
                Reset Game
            </button>
        </div>
    )
}

export default Navbar