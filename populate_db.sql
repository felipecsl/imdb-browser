.mode tabs
create table titles (tconst TEXT NOT NULL PRIMARY KEY, titleType TEXT, primaryTitle TEXT, originalTitle TEXT, isAdult INTEGER, startYear INTEGER, endYear INTEGER, runtimeMinutes INTEGER, genres TEXT);
create table title_metadata (tconst TEXT NOT NULL PRIMARY KEY, tmdb_id INTEGER, original_language TEXT, overview TEXT, release_date TEXT, poster_path TEXT, backdrop_path TEXT);
create table title_ratings (tconst TEXT NOT NULL PRIMARY KEY, averageRating REAL, numVotes INTEGER);
.import title.basics.fixed.tsv titles
.import title.ratings.tsv title_ratings
