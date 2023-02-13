import { NextApiRequest, NextApiResponse } from "next";
import { popularTitles, searchTitles } from "@/data";
import type { ResponseError, Title, TitleWithMetadata } from "@/interfaces";

export default async function titleHandler(
  req: NextApiRequest,
  res: NextApiResponse<Title[] | ResponseError>
) {
  const titlesFound = await popularTitles();
  return titlesFound.length > 0
    ? res.status(200).json(titlesFound)
    : res.status(404).json({ message: `No titles found.` });
}
