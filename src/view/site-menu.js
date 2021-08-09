import { createElement } from '../utils.js';

export default class SiteMenu {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this._movies.filter((it) => it.userDetails.watchList).length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${this._movies.filter((it) => it.userDetails.alreadyWatched).length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this._movies.filter((it) => it.userDetails.favorite).length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
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
