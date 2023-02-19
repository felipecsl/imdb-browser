import { useRouter } from "next/router";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { TitleWithMetadata } from "@/interfaces";
import { sortBy } from "lodash";
import HeaderSection from "@/headerSection";

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

  return (
    <div className="dark:bg-gray-800 p-8 min-h-screen dark:text-gray-300">
      <Head>
        <title>{title?.primaryTitle}</title>
        <meta name="description" content="IMDB search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderSection loading={loading} />
      <main className="flex justify-center">
        <div className="flex max-w-4xl">
          <img
            src={
              title?.posterPath
                ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${title?.posterPath}`
                : "/missingImage.svg"
            }
            width="300"
            className="mr-8 self-start rounded-lg drop-shadow-lg"
          />
          <div className="flex flex-col w-[530px] min-h-[480px]">
            <div className="flex justify-between mb-1">
              <h1 className="text-3xl font-medium">{title?.primaryTitle}</h1>
              <div className="mt-2">
                <TitleRating rating={title?.averageRating} />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              {title?.startYear} &bull; {title?.runtimeMinutes} minutes
            </p>
            <div className="mb-8">
              <TitleGenres genres={title?.genres.split(",")} />
            </div>
            <h2 className="text-2xl">Overview</h2>
            <p className="mt-4 mb-10">{title?.overview}</p>
            <TitleMedia torrents={title?.torrents} />
          </div>
        </div>
      </main>
    </div>
  );
};

const TitleGenres = ({ genres }: { genres?: string[] }) => {
  return (
    <div className="flex">
      {genres?.map((g) => (
        <div
          key="g"
          className="px-3 py-1 rounded-full border border-gray-500 text-xs mr-2 bg-gray-900"
        >
          {g}
        </div>
      ))}
    </div>
  );
};

const TitleMedia = ({ torrents }: { torrents?: { [_: string]: any } }) => {
  const hasSeeds = ([_, v]: [string, any]) => v.seed > 0;
  const sortedTorrents = torrents
    ? sortBy(Object.entries(torrents).filter(hasSeeds), ([_, v]) => -v.seed)
    : [];
  return (
    <>
      {torrents && <h2 className="text-2xl">Media</h2>}
      <div className="flex justify-around my-4">
        {torrents &&
          sortedTorrents.map(([res, details]) => (
            <div key={details.url} className="mb-3">
              <a href={details.url}>
                <div className="text-lg font-bold text-green-500">{res}</div>
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
    </>
  );
};

const TitleRating = ({ rating }: { rating?: number }) => {
  return (
    <>
      <span className="text-2xl font-medium dark:text-white">
        ⭐️&nbsp;{rating ?? "??"}
      </span>
      <span className="text-gray-400"> /10</span>
    </>
  );
};

export default Title;
