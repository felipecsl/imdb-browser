import { NextApiRequest, NextApiResponse } from "next";
import { searchTitles } from "@/data";
import type { ResponseError, Title, TitleWithMetadata } from "@/interfaces";

export default async function titleHandler(
  req: NextApiRequest,
  res: NextApiResponse<Title[] | ResponseError>
) {
  const { query } = req;
  const { q } = query;
  if (q) {
    const titlesFound = await searchTitles(q as string);
    return titlesFound.length > 0
      ? res.status(200).json(titlesFound)
      : res.status(404).json({ message: `Title with query='${q}' not found.` });
  } else {
    return res.status(400).json({ message: `Missing search query` });
  }
}
