import { getYear, getFormatedDuration, cutText } from '../utils/common.js';
import AbstractView from './abstract.js';

export default class Card extends AbstractView {
  constructor(movie) {
    super();
    this._data = movie;

    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._data.title}</h3>
    <p class="film-card__rating">${this._data.totalRaiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getYear(this._data.releaseDate)}</span>
      <span class="film-card__duration">${getFormatedDuration(this._data.runtime)}</span>
      <span class="film-card__genre">${this._data.genre.join(', ')}</span>
    </p>
    <img src="./${this._data.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${cutText(this._data.description, 140)}</p>
    <a class="film-card__comments">${this._data.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${this._data.watchList ? ' film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched${this._data.alreadyWatched ? ' film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite${this._data.favorite ? ' film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
  }

  setOpenPopupHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments').forEach((it) => it.addEventListener('click', this._openPopupHandler));
  }

  setAddToWatchlistHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._addToWatchlistHandler);
  }

  setMarkAsWatchedHandler(callback) {
    this._callback.markAsWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._markAsWatchedHandler);
  }

  setFavoriteHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteHandler);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.openPopupClick();
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  _markAsWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
