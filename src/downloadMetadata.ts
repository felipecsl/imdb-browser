import { readFile, writeFile } from "fs/promises";
import sqlite3 from "sqlite3";
import fetch from "node-fetch";
import * as fs from "fs";
import { existsSync } from "fs";
import * as readline from "readline";
import * as https from "https";
import { chunk } from "lodash";

const titlesDb = new sqlite3.Database("./titles.db");
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const INSERT_QUERY = `INSERT INTO title_metadata
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;
const agent = new https.Agent({ keepAlive: true });

function delay<T>(ms: number, v: any = null): Promise<T> {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), ms);
  });
}

const queryIds: () => Promise<string[]> = () => {
  return new Promise((resolve) => {
    titlesDb.all(
      "SELECT * FROM titles WHERE titleType = 'movie' AND startYear > 1920",
      (err, rows) => {
        if (err) throw err;
        resolve(rows.map((row) => row.tconst));
      }
    );
  });
};

const downloadPopcornTimeMetadata = async () => {
  const ids: string[] = await queryIds();
  for (const id of ids) {
    console.log(`Downloading metadata for ${id}...`);
    const metadata = await fetch(`https://popcorn-time.ga/movie/${id}`);
    if (metadata.status === 200) {
      const text = await metadata.text();
      await writeFile(`./popcorn-time-metadata/${id}.json`, text);
    } else {
      console.log(`Failed to download metadata for ${id}: ${metadata.status}`);
    }
    await delay(1000);
  }
};

// Downloads metadata from TMDB movie with `id` to JSON file in `./tmdb` directory
const fetchTmdbMetadata: (
  id: string,
  type: "movie" | "tv",
  force?: boolean
) => Promise<void> = async (
  id: string,
  type: "movie" | "tv",
  force = false
) => {
  const path = `./tmdb/${type}/${id}.json`;
  if (force || !existsSync(path)) {
    try {
      const url = `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`;
      const metadata = await fetch(url, { agent });
      if (metadata.status === 200) {
        if (type === "tv") {
          const metadataJson = await metadata.json();
          // tv shows don't include the imdb ID by default, so we need to make an extra request
          const externalIds = await fetch(
            `${TMDB_BASE_URL}/tv/${id}/external_ids?api_key=${TMDB_API_KEY}`
          );
          const { imdb_id } = await externalIds.json();
          await writeFile(path, JSON.stringify({ ...metadataJson, imdb_id }));
          console.log(`Wrote ${path}`);
        } else {
          const text = await metadata.text();
          await writeFile(path, text);
          console.log(`Wrote ${path}`);
        }
      } else {
        console.log(
          `Failed to download metadata for ${id}: ${metadata.status}`
        );
      }
    } catch (e) {
      console.log(`Failed to download metadata for ${id}: ${e}`);
    }
  }
};

// Reads TMDB movie/tv show IDs from a file and downloads metadata for each one
// https://developers.themoviedb.org/3/getting-started/daily-file-exports
const downloadAllTMDBMetadata: (
  inputJsonPath: string,
  type: "movie" | "tv",
  force?: boolean
) => Promise<void> = async (
  inputJsonPath: string,
  type: "movie" | "tv",
  force = false
) => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(inputJsonPath),
  });
  const ids: string[] = [];
  lineReader.on("line", (line) => ids.push(JSON.parse(line).id));
  lineReader.on("close", async () => {
    const chunks = chunk(ids, 1000);
    for (const chunk of chunks) {
      await Promise.all(chunk.map((id) => fetchTmdbMetadata(id, type, force)));
    }
  });
};

// Imports TMDB json dumps from `./tmdb/tv|movie` directory into the `title_metadata` table
const importTMDBMetadata: (type: "movie" | "tv") => Promise<void> = async (
  type: "movie" | "tv"
) => {
  const path = `./tmdb/${type}`;
  const files = fs.readdirSync(path);
  let totalMissingImdbId = 0;
  let totalInserted = 0;
  const failedFiles = new Set();
  titlesDb.all("SELECT tconst from title_metadata", async (err, rows) => {
    const existingIds = new Set(rows.map((row) => row.tconst));
    console.log(`Found ${existingIds.size} existing IDs`);
    const chunks = chunk(files, 1000);
    for (const chunk of chunks) {
      const statement = titlesDb.prepare(INSERT_QUERY);
      for (const file of chunk) {
        const contents = await readFile(`${path}/${file}`, "utf8");
        let json;
        try {
          json = JSON.parse(contents);
        } catch (e) {
          failedFiles.add(file);
          continue;
        }
        const {
          imdb_id,
          id,
          original_language,
          overview,
          release_date,
          poster_path,
          backdrop_path,
        } = json;
        // we ignore entries without an IMDB ID
        if (!imdb_id) {
          totalMissingImdbId++;
        }
        if (imdb_id && !existingIds.has(imdb_id)) {
          const values = [
            imdb_id,
            id,
            original_language,
            overview,
            release_date,
            poster_path,
            backdrop_path,
          ];
          statement.run(values, (err) => {
            console.error(`Error inserting data for ${id}`, err);
          });
          totalInserted++;
        }
      }
      statement.finalize((err) => {
        if (err) throw err;
      });
    }
    console.log(`Total entries missing an IMDB ID: ${totalMissingImdbId}`);
    console.log("Failed files: ", [...failedFiles].join(", "));
    console.log("Total inserted: " + totalInserted);
  });
};

(async () => {
  await importTMDBMetadata("tv");
  console.log("Done!");
})();
