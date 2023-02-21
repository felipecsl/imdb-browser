import { TitleWithMetadata } from "@/interfaces";
import sqlite3 from "sqlite3";
import { sortBy } from "lodash";

const titlesDb = new sqlite3.Database("./titles.db");
const BASE_SELECT = `SELECT titles.*,
                            title_ratings.averageRating,
                            title_ratings.numVotes,
                            title_metadata.overview,
                            title_metadata.poster_path   as posterPath,
                            title_metadata.backdrop_path as backdropPath
                     FROM titles
                              JOIN title_metadata,
                          title_ratings ON title_metadata.tconst = titles.tconst 
                      AND title_ratings.tconst = titles.tconst`;
const TITLE_QUERY = `${BASE_SELECT} WHERE primaryTitle LIKE ? ORDER BY numVotes DESC`;
const POPULAR_MOVIES_QUERY = `${BASE_SELECT} WHERE titleType = 'movie' ORDER BY numVotes DESC LIMIT 250`;

// Returns titles sorted by highest rating first
const searchTitles: (query: string) => Promise<TitleWithMetadata[]> = async (
  query: string
) => {
  return new Promise((resolve) => {
    titlesDb.all(TITLE_QUERY, `%${query}%`, (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
  });
};

const popularTitles: () => Promise<TitleWithMetadata[]> = async () => {
  return new Promise((resolve) => {
    titlesDb.all(POPULAR_MOVIES_QUERY, (err, rows) => {
      if (err) throw err;
      resolve(sortBy(rows, (t) => -t.averageRating));
    });
  });
};

const findTitleById: (id: string) => Promise<TitleWithMetadata | null> = async (
  id: string
) => {
  return new Promise((resolve) => {
    titlesDb.all(
      `SELECT titles.*,
              title_ratings.averageRating,
              title_ratings.numVotes,
              title_metadata.overview,
              title_metadata.poster_path   as posterPath,
              title_metadata.backdrop_path as backdropPath
       FROM titles
                JOIN title_metadata,
            title_ratings ON title_metadata.tconst = titles.tconst 
                      AND title_ratings.tconst = titles.tconst
       WHERE titles.tconst = ? LIMIT 1`,
      id,
      (err, rows) => {
        if (err) throw err;
        resolve(rows[0]);
      }
    );
  });
};

export { searchTitles, findTitleById, popularTitles };
