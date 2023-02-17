import { NextApiRequest, NextApiResponse } from "next";
import { popularTitles, searchTitles } from "@/data";
import type { ResponseError, Title, TitleWithMetadata } from "@/interfaces";

const MAX_AGE = 60 * 60 * 24; // 1 day in seconds

export default async function titleHandler(
  req: NextApiRequest,
  res: NextApiResponse<Title[] | ResponseError>
) {
  const titlesFound = await popularTitles();
  return titlesFound.length > 0
    ? res
        .status(200)
        .setHeader(
          "Cache-Control",
          `public, s-maxage=${MAX_AGE}, max-age=${MAX_AGE}, stale-while-revalidate=${MAX_AGE}`
        )
        .json(titlesFound)
    : res.status(404).json({ message: `No titles found.` });
}
