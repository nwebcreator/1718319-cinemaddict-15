import { MenuItem } from '../const.js';
import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType, canBeActive) => {
  const { type, name, count } = filter;
  return (
    `<a href="#${type}" data-filter-type="${type}" data-menu-item="${MenuItem.MOVIES}" class="main-navigation__item${canBeActive && type === currentFilterType ? ' main-navigation__item--active' : ''}">${name}${count === undefined ? '' : (` <span class="main-navigation__item-count">${count}</span>`)}</a>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType, currentMenuItem) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._currentMenuItem = currentMenuItem;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this.i = 0;
  }

  getTemplate() {
    const filterItemsTemplate = this._filters
      .map((filter) => createFilterItemTemplate(filter, this._currentFilterType, this._currentMenuItem === MenuItem.MOVIES))
      .join('');
    return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#${MenuItem.STATS}" data-menu-item="${MenuItem.STATS}" class="main-navigation__additional${this._currentMenuItem === MenuItem.STATS ? ' main-navigation__item--active' : ''}">Stats</a>
  </nav>`;
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelectorAll('.main-navigation__additional, .main-navigation__item').forEach((el) => el.addEventListener('click', this._menuClickHandler));
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
