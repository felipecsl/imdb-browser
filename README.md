## IMDB title browser

```bash
yarn install
yarn dev
```

This is a work in progress

## Building titles DB

* Download [`title.basics.tsv.gz`]((https://datasets.imdbws.com/title.basics.tsv.gz)) and [`title.ratings.tsv.gz`](https://datasets.imdbws.com/title.ratings.tsv.gz) from IMDB
* Unzip files
* Run `tr '"' "'" < title.basics.tsv > title.basics.fixed.tsv`
* Run `sqlite3 titles.db < populate_db.sql` to create DB tables and populate with IMDB title and ratings data from TSVs
* In order to populate the titles metadata with descriptions, images, etc., you need to grab data from TMDB:
  * Create a [TMDB account](https://themoviedb.org) and get an API key
  * Download a daily export of movies and tv series IDs from [this page](https://developers.themoviedb.org/3/getting-started/daily-file-exports)
  * Run `yarn tsc && node dist/download_metadata.js <path to tmdb export> <path to titles.db> <tmdb api key>` (TODO implement this)

Open [http://localhost:3000](http://localhost:3000) with your browser to view the app.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
