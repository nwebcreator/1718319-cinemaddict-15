import { getFullDate, getFormatedDuration, getCommentsDate } from '../utils/common.js';
import AbstractView from './abstract.js';
import { mergeDeep } from '../utils/common.js';

export default class Popup extends AbstractView {
  constructor(movie, comments, changeData) {
    super();
    this._movie = movie;
    this._comments = comments;

    this._changeData = changeData;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);

    this.setAddToWatchlistHandler();
    this.setMarkAsWatchedHandler();
    this.setFavoriteHandler();
  }

  getTemplate() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${this._movie.filmInfo.poster}" alt="">
  
            <p class="film-details__age">${this._movie.filmInfo.ageRating}+</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._movie.filmInfo.title}</h3>
                <p class="film-details__title-original">${this._movie.filmInfo.alternativeTitle}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._movie.filmInfo.totalRaiting}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._movie.filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._movie.filmInfo.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._movie.filmInfo.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFullDate(this._movie.filmInfo.release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFormatedDuration(this._movie.filmInfo.runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._movie.filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${this._movie.filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${this._movie.filmInfo.genre.map((it) => (`<span class="film-details__genre">${it}</span>`)).join('')}
                </td>
              </tr>
            </table>
  
            <p class="film-details__film-description">
              The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist${this._movie.userDetails.watchList ? ' film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched${this._movie.userDetails.alreadyWatched ? ' film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite${this._movie.userDetails.favorite ? ' film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
  
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
  
          <ul class="film-details__comments-list">
            ${this._comments.map((it) => (`<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${it.emotion}.png" width="55" height="55" alt="emoji-${it.emotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${it.comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${it.author}</span>
                  <span class="film-details__comment-day">${getCommentsDate(it.date)}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>`)).join('')}
          </ul>
  
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
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

  _markAsWatchedHandler(evt) {
    evt.preventDefault();
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

  _favoriteHandler(evt) {
    evt.preventDefault();
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

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setAddToWatchlistHandler() {
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._addToWatchlistHandler);
  }

  setMarkAsWatchedHandler() {
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._markAsWatchedHandler);
  }

  setFavoriteHandler() {
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteHandler);
  }

  getScrollTop(){
    return this.getElement().scrollTop;
  }

  scrollByTop(scrollTop) {
    this.getElement().scrollBy(0, scrollTop, 0);
  }
}
