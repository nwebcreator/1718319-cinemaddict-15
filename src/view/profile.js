import AbstractView from './abstract.js';

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

export default class Profile extends AbstractView {
  constructor(movies) {
    super();
    this._data = Profile.parseMoviesToData(movies);
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._data.rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }

  static parseMoviesToData(movies) {
    return {
      rating: getProfileRating(movies.filter((movie) => movie.alreadyWatched).length),
    };
  }
}
