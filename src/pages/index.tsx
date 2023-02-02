import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Title } from "@/interfaces";
import { debounce, take } from "lodash";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [totalMatches, setTotalMatches] = useState(0);
  const [results, setResults] = useState<Title[]>([]);
  useEffect(() => {
    if (query) {
      fetcher(`/api/titles?q=${query}`).then((r) => {
        setResults(take(r, 100));
        setTotalMatches(r.length);
      });
    }
  }, [query]);
  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 3) setQuery(value);
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="IMDB search"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className="m-8">
        <h1 className="text-3xl my-4 font-medium">IMDB search</h1>
        <input
          type="text"
          placeholder="Search..."
          onChange={debounce(onChangeSearchQuery, 250)}
          className="border border-gray-600 rounded py-2 px-4 my-2 text-xl"
        />
        <br/>
        {results.length > 0 && (
          <div className="my-2">
            <p className="mb-3">{totalMatches} matches found</p>
            <div className="">
              {results.map(({ tconst, originalTitle, startYear }) => (
                <div key={tconst} className="my-1">
                  <a
                    href={`https://imdb.com/title/${tconst}`}
                    className="underline"
                  >
                    {originalTitle.trim()}&nbsp;({startYear})
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
