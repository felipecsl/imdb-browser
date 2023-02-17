import { useRouter } from "next/router";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { TitleWithMetadata } from "@/interfaces";
import { sortBy } from "lodash";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Title = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState<
    (TitleWithMetadata & { torrents?: { [k: string]: any } }) | null
  >(null);
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

  const hasSeedsAndPeers = ([_, v]: [string, any]) => v.seed > 0 && v.peer > 0;
  const sortedTorrents = title?.torrents
    ? sortBy(
        Object.entries(title.torrents).filter(hasSeedsAndPeers),
        ([_, v]) => -v.seed
      )
    : [];

  return (
    <div className="dark:bg-gray-800 p-8 min-h-screen dark:text-gray-300">
      <Head>
        <title>{title?.primaryTitle}</title>
        <meta name="description" content="IMDB search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl my-4 font-medium">
        <Link href="/">Movie browser</Link>
      </h1>
      <main className="flex justify-center">
        <div className="flex max-w-4xl">
          <img
            src={
              title?.posterPath
                ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${title?.posterPath}`
                : "/missingImage.svg"
            }
            width="300"
            className="mr-8 self-center"
          />
          <div className="flex flex-col w-[530px] min-h-[480px]">
            <h1 className="text-3xl mt-4 font-medium mb-1">
              {title?.primaryTitle}
            </h1>
            <div className="flex justify-between mb-10">
              <p className="text-sm text-gray-400">
                {title?.startYear} &bull; {title?.genres} &bull;{" "}
                {title?.runtimeMinutes} minutes
              </p>
              <div className="">
                <span className="text-xl font-medium">
                  {title?.averageRating ?? "??"}
                </span>
                <span className="text-gray-400"> / 10</span> &nbsp;⭐️
              </div>
            </div>
            <h2 className="text-2xl">Overview</h2>
            <p className="mt-4 mb-10">{title?.overview}</p>
            <h2 className="text-2xl">Media</h2>
            <div className="flex justify-between my-4">
              {title?.torrents &&
                sortedTorrents.map(([res, details]) => (
                  <div key={details.url} className="mb-3">
                    <a href={details.url} className="">
                      <div className="text-lg">{res}</div>
                    </a>
                    <span className="text-sm">
                      Seeds: {details.seed}
                      <br />
                      Peers: {details.peer}
                      <br />
                      Size: {details.filesize}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Title;
