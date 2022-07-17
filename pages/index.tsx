import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from 'next/image'
import { gql } from "@apollo/client";
import client from "../apollo-client";

import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface Movie {
  url?: string;
  programs: {
    name?: string
  }
}

type Movies = {
  movies: Movie
}


export default function Home({ movies }: Movies) {

  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>List Of Movies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-3xl font-bold underline">
          Mon carrousel de film !
        </h1>
        <div className={styles.grid}>
          <div className="h-40 space-y-0.5 md:space-y-2">
            <div className="group relative md:-ml-2">
              <ChevronLeftIcon
                className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && 'hidden'
                  }`}
                onClick={() => handleClick('left')}
              />

              <div
                ref={rowRef}
                className="flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2"
              >
                {movies.map((movie: Movie, index: number) => (
                  <div key={index} className={[styles.images, "mx-px border border-solid rounded-sm border-slate-100"]}>
                    <Image src={movie.url} alt={movie.programs[0].name} width={"200"} height={"266"} className="object-fit: cover;" />
                  </div>
                ))}
              </div>

              <ChevronRightIcon
                className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
                onClick={() => handleClick('right')}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by{" "}
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const FEED_QUERY = await client.query({
    query: gql`
      query ListOfMovies($limit: Int, $offset: Int) {
        image(limit: 6, offset: $offset) {
          id
          created_at
          url
          programs {
            name
          }
        }
      }
    `,
  });

  return {
    props: {
      movies: FEED_QUERY.data.image,
    },
  };
}