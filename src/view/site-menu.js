import AbstractView from './abstract.js';

export default class SiteMenu extends AbstractView {
  constructor(movies) {
    super();
    this._data = SiteMenu.parseMoviesToData(movies);
  }

  getTemplate() {
    return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this._data.watchListCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${this._data.alreadyWatchedCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this._data.favoriteCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
  }

  static parseMoviesToData(movies) {
    return {
      watchListCount: movies.filter((it) => it.watchList).length,
      alreadyWatchedCount: movies.filter((it) => it.alreadyWatched).length,
      favoriteCount: movies.filter((it) => it.favorite).length,
    };
  }
}
