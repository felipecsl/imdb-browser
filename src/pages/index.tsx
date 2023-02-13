import Head from "next/head";
import React, { useEffect, useState } from "react";
import { TitleWithMetadata } from "@/interfaces";
import { debounce, take } from "lodash";
import CircularProgress from "@/pages/circularProgress";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const [results, setResults] = useState<TitleWithMetadata[]>([]);
  useEffect(() => {
    if (query) {
      setLoading(true);
      setResults([]);
      setTotalMatches(0);
      fetcher(`/api/titles?q=${query}`).then((r) => {
        setResults(take(r, 100));
        setTotalMatches(r.length);
        setLoading(false);
      });
    } else {
      setLoading(true);
      setResults([]);
      setTotalMatches(0);
      fetcher("/api/popular").then((r) => {
        setResults(r);
        setTotalMatches(r.length);
        setLoading(false);
      });
    }
  }, [query]);
  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 3) setQuery(value);
  };
  return (
    <div className="dark:bg-gray-800 p-8 min-h-screen dark:text-gray-300">
      <Head>
        <title>Title search</title>
        <meta name="description" content="IMDB search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl my-4 font-medium">Movie Search</h1>
        <input
          type="text"
          placeholder="Search..."
          onChange={debounce(onChangeSearchQuery, 250)}
          className="border border-gray-600 rounded py-2 px-4 my-2 text-xl text-gray-900"
        />
        <br />
        {loading && <CircularProgress />}
        {results.length > 0 && (
          <div className="my-2">
            <div className="flex justify-around flex-wrap">
              {results.map(
                ({ tconst, originalTitle, startYear, posterPath }) => (
                  <div
                    key={tconst}
                    className="my-3 mr-3 w-48 inline-block border border-gray-900 rounded-lg bg-gray-700 hover:bg-gray-600 drop-shadow-lg"
                  >
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
                      />
                      <div className="py-4 px-3 text-sm">
                        {originalTitle.trim()}
                        <br />
                        {startYear}
                      </div>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
