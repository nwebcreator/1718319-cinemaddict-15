import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

export default class NoFilm extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;
  }

  getTemplate() {
    return `<section class="films-list">
      <h2 class="films-list__title">${this._getTitle()}</h2>
    </section>`;
  }

  _getTitle() {
    switch (this._filterType) {
      case FilterType.WATCHLIST:
        return 'There are no watchlist movies now';
      case FilterType.HISTORY:
        return 'There are no history movies now';
      case FilterType.FAVORITES:
        return 'There are no favorite movies now';
      default:
        return 'There are no movies in our database';
    }
  }
}
