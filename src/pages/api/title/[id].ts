import { NextApiRequest, NextApiResponse } from "next";
import { findTitleById, searchTitles } from "@/data";
import type { ResponseError, Title, TitleWithMetadata } from "@/interfaces";

export default async function titleHandler(
  req: NextApiRequest,
  res: NextApiResponse<(TitleWithMetadata & { torrents?: any }) | ResponseError>
) {
  const { query } = req;
  const { id } = query;
  const movieOrShow = ["movie", "tvSeries"];
  if (id) {
    const titleFound = await findTitleById(id as string);
    if (titleFound && movieOrShow.includes(titleFound.titleType)) {
      const type = titleFound.titleType === "movie" ? "movie" : "show";
      const imdbId = titleFound.tconst;
      const popcornUrl = `https://popcorn-time.ga/${type}/${imdbId}`;
      const popcornData = await fetch(popcornUrl);
      let torrents = null;
      if (popcornData.status === 200) {
        const popcornJson = await popcornData.json();
        torrents = popcornJson?.torrents?.en;
      }
      res.status(200).json({ ...titleFound, torrents });
    } else {
      res.status(404).json({ message: `Title with id='${id}' not found.` });
    }
  } else {
    return res.status(400).json({ message: `Missing id param` });
  }
}
