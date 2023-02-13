## Getting Started

```bash
yarn install
yarn dev
```

## Building titles DB

* Download `title.basics.tsv.gz` and `title.ratings.tsv.gz` from [IMDB](https://datasets.imdbws.com/title.basics.tsv.gz)
* Unzip files
* Run `tr '"' "'" < title.basics.tsv > title.basics.fixed.tsv`
* Run `sqlite3` then run the following commands to create a sqlite3 database:

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
