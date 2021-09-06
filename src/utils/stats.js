import { StatsPeriod } from '../const.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const makeItemsUnique = (items) => [...new Set(items)];

const countMoviesByGenre = (movies, genre) => movies.filter((movie) => movie.genre.indexOf(genre) !== -1).length;

const getTopGenre = (movies) =>{
  const allGenres = {
  };

  for (const movie of movies) {
    for (const genre of movie.genre) {
      if (allGenres[genre] === undefined) {
        allGenres[genre] = 0;
      }

      allGenres[genre]++;
    }
  }

  const topGenre = Object.entries(allGenres).sort((it) => it[1]);
  if(topGenre.length === 0) {
    return '';
  }

  return topGenre[0][0];
};

const filterMoviesByPeriod = (movies, period) =>{
  switch(period) {
    case StatsPeriod.TODAY:
      return movies.filter((movie) => dayjs(movie.watchingDate).isSame(dayjs(), 'day'));
    case StatsPeriod.WEEK:
      return movies.filter((movie) => dayjs(movie.watchingDate).isBetween(dayjs().add(-7, 'day'), dayjs(), 'day'));
    case StatsPeriod.MONTH:
      return movies.filter((movie) => dayjs(movie.watchingDate).isBetween(dayjs().add(-30, 'day'), dayjs(), 'day'));
    case StatsPeriod.YEAR:
      return movies.filter((movie) => dayjs(movie.watchingDate).isBetween(dayjs().add(-365, 'day'), dayjs(), 'day'));
    case StatsPeriod.ALL_TIME:
    default:
      return movies;
  }
};

export { makeItemsUnique, countMoviesByGenre, getTopGenre, filterMoviesByPeriod };
