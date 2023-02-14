import { useRouter } from "next/router";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { TitleWithMetadata } from "@/interfaces";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Title = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState<TitleWithMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetcher(`/api/title/${id}`).then((t) => {
        setTitle(t);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <div className="dark:bg-gray-800 p-8 min-h-screen dark:text-gray-300">
      <Head>
        <title>Title details</title>
        <meta name="description" content="IMDB search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="flex max-w-4xl">
          <img
            src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${title?.posterPath}`}
            className="mr-8"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl my-4 font-medium">
              {title?.primaryTitle} ({title?.startYear})
            </h1>
            <div className="text-sm mb-1">{title?.genres}</div>
            <div className="mb-10 text-sm">
              Rating{" "}
              <span className="font-mono">{title?.averageRating}/10</span>
            </div>
            <h2 className="text-2xl">Overview</h2>
            <p className="my-4">{title?.overview}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Title;
