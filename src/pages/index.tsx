import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Title, TitleWithMetadata } from "@/interfaces";
import { take } from "lodash";
import CircularProgress from "@/pages/circularProgress";
import Link from "next/link";
import { useRouter } from "next/router";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const router = useRouter();
  const query = router.query["q"];
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TitleWithMetadata[]>([]);
  useEffect(() => {
    if (query) {
      fetcher(`/api/titles?q=${query}`).then((r) => {
        setLoading(false);
        setResults(take(r, 100));
      });
    } else {
      fetcher("/api/popular").then((r) => {
        setLoading(false);
        setResults(r);
      });
    }
  }, [query]);
  return (
    <div className="dark:bg-gray-800 p-8 min-h-screen dark:text-gray-300">
      <Head>
        <title>Title search</title>
        <meta name="description" content="IMDB search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl my-4 font-medium">
          <Link href="/">Movie browser</Link>
        </h1>
        <div className="flex">
          <form method="get" action="/">
            <input
              type="text"
              name="q"
              defaultValue={query || ""}
              placeholder="Search..."
              className="rounded py-2 px-4 text-xl text-gray-900 border border-gray-200 focus:outline-none"
            />
          </form>
          <div className="">
            {loading && (
              <CircularProgress
                text=""
                className="py-3 border border-gray-200 rounded-r-md rounded-l-none -ml-1"
              />
            )}
          </div>
        </div>
        {results.length > 0 && (
          <div className="my-2">
            <div className="flex justify-around flex-wrap">
              {results.map((title) => (
                <TitleCard key={title.tconst} title={title} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const TitleCard = ({ title }: { title: TitleWithMetadata }) => {
  const { tconst, primaryTitle, startYear, posterPath } = title;
  return (
    <div className="my-3 mr-3 w-48 inline-block border dark:border-gray-900 rounded-lg bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-white drop-shadow">
      <Link
        href={`/title/${tconst}`}
        className="flex flex-col justify-between h-full"
      >
        <img
          src={
            posterPath && posterPath.toLowerCase() !== "null"
              ? `https://image.tmdb.org/t/p/w500/${posterPath}`
              : "/missingImage.svg"
          }
          alt="Movie poster"
          className="rounded-t-lg"
        />
        <div className="py-4 px-3 text-sm">
          {primaryTitle.trim()}
          <br />
          {startYear}
        </div>
      </Link>
    </div>
  );
};
