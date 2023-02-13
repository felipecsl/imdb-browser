import { NextApiRequest, NextApiResponse } from "next";
import { findTitleById, searchTitles } from "@/data";
import type { ResponseError, Title, TitleWithMetadata } from "@/interfaces";

export default async function titleHandler(
  req: NextApiRequest,
  res: NextApiResponse<TitleWithMetadata | ResponseError>
) {
  const { query } = req;
  const { id } = query;
  if (id) {
    const titleFound = await findTitleById(id as string);
    return titleFound
      ? res.status(200).json(titleFound)
      : res.status(404).json({ message: `Title with id='${id}' not found.` });
  } else {
    return res.status(400).json({ message: `Missing id param` });
  }
}
