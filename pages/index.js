import Head from 'next/head';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../styles/Home.module.css';
import Meme from '../component/Meme';

const fetcher = async url => {
    const response = await fetch(url);
    const data = response.json();
    return data;
};

// export async function
export default function Home({ initalMemes }) {
    const [hasMore] = useState(true);
    const [memes, setMemes] = useState(initalMemes);
    const getMemes = async () => {
        const data = await fetcher('/api/random');

        setMemes([...new Map([...memes, ...data.memes].map(item => [item.ups, item])).values()]);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Random Memes</title>
                <meta name="description" content="Random Memes by Gauti." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h3 className={styles.title}>
                    Random <a>Next.meme!</a>
                </h3>

                <div className={styles.grid}>
                    {/* {error && <div>Failed to load meme</div>} */}
                    {memes ? (
                        <InfiniteScroll
                            dataLength={memes.length + 5}
                            next={getMemes}
                            hasMore={hasMore}
                            className={styles.infinity}
                            loader={<h3> Loading...</h3>}
                            endMessage={<h4>Nothing more to show</h4>}>
                            {memes.map(meme => (
                                <Meme data={meme} key={meme.ups} />
                            ))}
                        </InfiniteScroll>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    // href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    // target="_blank"
                    rel="noopener noreferrer">
                    Developed by <span className={styles.logo}>Gautam</span>
                </a>
            </footer>
        </div>
    );
}

export async function getStaticProps() {
    const data = await fetcher('https://meme-api.herokuapp.com/gimme/3');

    return {
        props: { initalMemes: data?.memes }
    };
}
