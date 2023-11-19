import { Outlet, Link } from 'react-router-dom';
import styles from './index.module.css';

// we should reset scores for every day?
const Home = () => {
  return (
    <div className={styles.page}>
      <h1>WordyMap</h1>
      <h2>About</h2>
      <p>
        Get rid of all your tiles in the fastest time by building words with 3 letters or
        more! If you have a letter you can't use, send it back to the pile to get 2 new
        letters to use.
      </p>

      {/* make this link look nicer */}
      <Link to={'game'}>Play Game</Link>
      <h2>Today's High Scores</h2>
      <ul>
        <li>Time: 1:00</li>
        <li>Time: 1:01</li>
        <li>Time: 1:02</li>
      </ul>
    </div>
  );
};

export default Home;
