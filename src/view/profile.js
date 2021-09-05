import AbstractView from './abstract.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../const.js';

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
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._rating = getProfileRating(filter[FilterType.HISTORY](this._moviesModel.getMovies()).length);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }

  _handleModelEvent() {
    this._rating = getProfileRating(filter[FilterType.HISTORY](this._moviesModel.getMovies()).length);
    this.getElement().querySelector('.profile__rating').innerText = this._rating;
  }
}
