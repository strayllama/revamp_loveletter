import styles from "../../styles/Home.module.css";

const Game = () => {
  return (
    <div>
      <h1>PLAY TIME</h1>
      <main className={styles.main}>
        <img src="/images/love-letter-logo.png" alt="Love Letter game Logo" />

        <p className={styles.description}>
          {' '}
          <code className={styles.code}>Choose your settings and lets PLAY</code>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </div>

          <div className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </div>

          <div className={styles.card}>
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </div>

          <a
            href="/game/game"
            className={styles.card}
            >
            <h3>START GAME &rarr;</h3>
            <p> some text.</p>
          </a>
        </div>
    </main>
  </div>
 )
}


export default Game