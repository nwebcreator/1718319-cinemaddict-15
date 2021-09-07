import AbstractView from './abstract.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../const.js';
import { getProfileRating } from '../utils/rating.js';

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
