import dayjs from 'dayjs';

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortMoviesByDate = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieB.filmInfo.release.date, movieA.filmInfo.release.date);

  if (weight !== null) {
    return weight;
  }

  return dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));
};

const sortMoviesByRating = (movieA, movieB) => {
  if (movieA.filmInfo.totalRaiting > movieB.filmInfo.totalRaiting) {
    return -1;
  }

  if (movieA.filmInfo.totalRaiting < movieB.filmInfo.totalRaiting) {
    return 1;
  }

  return 0;
};

export { sortMoviesByDate, sortMoviesByRating };
