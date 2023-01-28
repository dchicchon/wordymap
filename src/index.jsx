import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Board from './components/Board'
import styles from './index.module.css'

const App = () => {
  return (
    <div className={styles.App}>
      <DndProvider backend={HTML5Backend}>
        <Board />
      </DndProvider>
    </div>
  )
}

export default App
