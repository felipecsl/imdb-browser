import { Title, TitleRating } from "@/interfaces";
import sqlite3 from "sqlite3";
import { sortBy } from "lodash";

const titlesDb = new sqlite3.Database("./title_basics.db");
const titleRatingsDb = new sqlite3.Database("./title_ratings.db");
const TITLE_QUERY = `SELECT *
                     FROM titles
                     WHERE originalTitle LIKE ?`;
const RATINGS_QUERY = `SELECT *
                       from title_ratings
                       WHERE tconst = ? LIMIT 1`;

const ratingsSearch: (titleId: string) => Promise<TitleRating | undefined> = (titleId) => {
  return new Promise((resolve) => {
    titleRatingsDb.get(RATINGS_QUERY, titleId, (err, row) => {
      if (err) throw err;
      resolve(row);
    });
  });
};

const titleSearch: (query: string) => Promise<Title[]> = (query) => {
  return new Promise((resolve) => {
    titlesDb.all(TITLE_QUERY, `%${query}%`, (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
  });
};

const searchTitles = async (query: string) => {
  const titles = await titleSearch(query);
  const titlesWithRatings = await Promise.all(
    titles.map(async (title) => {
      const titleRatings = await ratingsSearch(title.tconst);
      if (titleRatings) {
        const { averageRating, numVotes } = titleRatings;
        return { ...title, averageRating, numVotes };
      } else {
        return { ...title, averageRating: 0, numVotes: 0 };
      }
    })
  );
  return sortBy(titlesWithRatings, (t) => -t.numVotes);
};

export { searchTitles };
