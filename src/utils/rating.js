const NOVICE_MOVIE_COUNT = 1;
const FAN_MOVIE_COUNT = 11;
const MOVIEBUFF_MOVIE_COUNT = 21;

const getProfileRating = (count) => {
  if (count >= MOVIEBUFF_MOVIE_COUNT) {
    return 'Movie Buff';
  }
  if (count >= FAN_MOVIE_COUNT) {
    return 'Fan';
  }
  if (count >= NOVICE_MOVIE_COUNT) {
    return 'Novice';
  }
  return '';
};

export { getProfileRating };
