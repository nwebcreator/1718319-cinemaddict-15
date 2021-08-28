import CardView from '../view/card.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

export default class Movie {
  constructor(containerElement, openPopupHandler, changeData) {
    this._containerElement = containerElement;
    this._changeData = changeData;
    this._openPopupHandler = openPopupHandler;
    this._cardViewComponent = null;

    this._handleAddToWatchlist = this._handleAddToWatchlist.bind(this);
    this._handleMarkAsWatched = this._handleMarkAsWatched.bind(this);
    this._handleFavorite = this._handleFavorite.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevCardViewComponent = this._cardViewComponent;
    this._cardViewComponent = new CardView(this._movie);

    this._cardViewComponent.setOpenPopupHandler(this._openPopupHandler(this._movie));
    this._cardViewComponent.setAddToWatchlistHandler(this._handleAddToWatchlist);
    this._cardViewComponent.setMarkAsWatchedHandler(this._handleMarkAsWatched);
    this._cardViewComponent.setFavoriteHandler(this._handleFavorite);

    if(prevCardViewComponent === null || prevCardViewComponent === undefined)
    {
      render(this._containerElement, this._cardViewComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._cardViewComponent, prevCardViewComponent);

    remove(prevCardViewComponent);
  }

  destroy() {
    remove(this._cardViewComponent);
  }

  _handleAddToWatchlist() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          watchList: !this._movie.watchList,
        },
      ),
    );
  }

  _handleMarkAsWatched(){
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          alreadyWatched: !this._movie.alreadyWatched,
        },
      ),
    );
  }

  _handleFavorite(){
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          favorite: !this._movie.favorite,
        },
      ),
    );
  }
}
