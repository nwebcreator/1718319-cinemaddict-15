import { getYear, getFormatedDuration, createElement } from '../utils.js';

export default class Card {
  constructor(movie) {
    this._element = null;
    this._movie = movie;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._movie.filmInfo.title}</h3>
    <p class="film-card__rating">${this._movie.filmInfo.totalRaiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getYear(this._movie.filmInfo.release.date)}</span>
      <span class="film-card__duration">${getFormatedDuration(this._movie.filmInfo.runtime)}</span>
      <span class="film-card__genre">${this._movie.filmInfo.genre.join(', ')}</span>
    </p>
    <img src="./${this._movie.filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._movie.filmInfo.description}</p>
    <a class="film-card__comments">${this._movie.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${this._movie.userDetails.watchList ? ' film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched${this._movie.userDetails.alreadyWatched ? ' film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite${this._movie.userDetails.favorite ? ' film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
