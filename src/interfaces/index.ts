export type Title = {
  tconst: string;
  titleType: string;
  primaryTitle: string;
  originalTitle: string;
  isAdult: number;
  startYear: number;
  endYear: number;
  runtimeMinutes: number;
  genres: string;
};

export type TitleRating = {
  tconst: string;
  averageRating: number;
  numVotes: number;
};

export type TitleMetadata = {
  tconst: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  originalLanguage: string;
}

export type TitleWithMetadata = Title & TitleRating & TitleMetadata;

export type ResponseError = {
  message: string;
};
