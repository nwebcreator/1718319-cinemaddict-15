import CardView from '../view/card.js';
import { mergeDeep } from '../utils/common.js';
import { render, RenderPosition, replace } from '../utils/render.js';

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
  }

  _handleAddToWatchlist() {
    this._changeData(
      mergeDeep(
        {},
        this._movie,
        {
          userDetails: {watchList: !this._movie.userDetails.watchList},
        },
      ),
    );
  }

  _handleMarkAsWatched(){
    this._changeData(
      mergeDeep(
        {},
        this._movie,
        {
          userDetails: {alreadyWatched: !this._movie.userDetails.alreadyWatched},
        },
      ),
    );
  }

  _handleFavorite(){
    this._changeData(
      mergeDeep(
        {},
        this._movie,
        {
          userDetails: {favorite: !this._movie.userDetails.favorite},
        },
      ),
    );
  }
}
