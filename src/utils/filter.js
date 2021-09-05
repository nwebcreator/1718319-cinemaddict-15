import { FilterType } from '../const.js';

const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.favorite),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.alreadyWatched),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.watchList),
};

export { filter };
