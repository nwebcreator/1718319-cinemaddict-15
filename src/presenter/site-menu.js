import SiteMenuView from '../view/site-menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, MenuItem, UpdateType} from '../const.js';

export default class SiteMenu {
  constructor(siteMenuContainer, moviesModel, filterModel, siteMenuClickHandler) {
    this._siteMenuContainer = siteMenuContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._currentMenuItem = MenuItem.MOVIES;
    this._siteMenuClickHandler = siteMenuClickHandler;
    this._siteMenuComponent = null;

    this._handleSiteMenuItemChange = this._handleSiteMenuItemChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._siteMenuComponent;

    this._siteMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter(), this._currentMenuItem);
    this._siteMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuItemChange);

    if (prevFilterComponent === null) {
      render(this._siteMenuContainer, this._siteMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._siteMenuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: undefined,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleSiteMenuItemChange(menuItem) {
    if(this._currentMenuItem === menuItem) {
      return;
    }

    this._currentMenuItem = menuItem;
    this._siteMenuClickHandler(menuItem);
    this._handleModelEvent();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
