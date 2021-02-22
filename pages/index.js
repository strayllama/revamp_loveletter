import Head from 'next/head'
import styles from '../styles/Home.module.css'
// import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Love Letter Game</title>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <img src="/images/love-letter-logo.png" alt="Love Letter game Logo" />

        <p className={styles.description}>
          {' '}
          <code className={styles.code}>Choose your settings and lets PLAY</code>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Choose number of players</h3>
            <p>1 - 4 humans players</p>
            <p>, 1 - 3 cpu players</p>
          </div>

          <div className={styles.card}>
            <h3>Normal or Extended Game?</h3>
            <p>Normal deck is 8 characters, extended has 16 in total</p>
          </div>

          <div className={styles.card}>
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </div>

          {/*<Link href="/game/game" className={styles.card}>*/}
            <h3>START GAME &rarr;</h3>
            <p> some text.</p>
          {/*</Link>*/}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/strayllama/revamp_loveletterit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/images/porkLogoSmall.png" alt="Pork Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
