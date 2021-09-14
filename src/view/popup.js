import { getFullDate, getFormatedDuration, getCommentsDate, pluralize, isOnline } from '../utils/common.js';
import SmartView from './smart.js';
import { UpdateType, UserAction } from '../const.js';
import { toast } from '../utils/toast.js';
import he from 'he';
import dayjs from 'dayjs';

const PopupState = {
  DEFAULT: 'DEFAULT',
  SAVING: 'SAVING',
  ABORTING: 'ABORTING',
};

export default class Popup extends SmartView {
  constructor(movie, changeData) {
    super();
    this._data = movie;
    this._changeData = changeData;

    this._currentState = PopupState.DEFAULT;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._emojiInputHandler = this._emojiInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getGenreMarkup(genre) {
    return genre.map((it) => (`<span class="film-details__genre">${it}</span>`)).join('');
  }

  getSelectedEmojiMarkup() {
    const { emoji } = this._data;
    if (emoji) {
      return `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`;
    } else {
      return '';
    }
  }

  getCommentsMarkup() {
    return this._data.movieComments.map((comment) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${getCommentsDate(comment.date)}</span>
        <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
      </p>
    </div>
  </li>`).join('');
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
            <img class="film-details__poster-img" src="./${this._data.poster}" alt="">
  
            <p class="film-details__age">${this._data.ageRating}+</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._data.title}</h3>
                <p class="film-details__title-original">${this._data.alternativeTitle}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._data.totalRaiting}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._data.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._data.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._data.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFullDate(this._data.releaseDate)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFormatedDuration(this._data.runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._data.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${pluralize(this._data.genre.length, 'Genre')}</td>
                <td class="film-details__cell">
                  ${this.getGenreMarkup(this._data.genre)}
                </td>
              </tr>
            </table>
  
            <p class="film-details__film-description">
              ${this._data.description}
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist${this._data.watchList ? ' film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched${this._data.alreadyWatched ? ' film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite${this._data.favorite ? ' film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      ${isOnline() ? (`
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._data.movieComments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${this.getCommentsMarkup()}
          </ul>
  
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${this.getSelectedEmojiMarkup()}</div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${this._data.savign ? 'readOnly' : ''}>${this._data.commentText || ''}</textarea>
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
      </div>`) : ''}
    </form>
  </section>`;
  }

  setViewState(state) {
    if (this._currentState === state) {
      return;
    }
    this._currentState = state;

    const scrollTop = this.getScrollTop();

    switch (state) {
      case PopupState.ABORTING:
        this.shake(() => {
          this.getElement().querySelectorAll('.film-details__comment-delete').forEach((button) => {
            button.innerText = 'Delete';
            button.disabled = false;
          });
        });
        break;
      case PopupState.SAVING:
        this.updateData({
          savign: true,
        });
        break;
      case PopupState.DEFAULT:
        this.updateData({
          saving: false,
          disabled: false,
        });
    }

    this.scrollByTop(scrollTop);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _setInnerHandlers() {
    this.setDeleteCommentHandler();
    this.setAddToWatchlistHandler();
    this.setMarkAsWatchedHandler();
    this.setFavoriteHandler();
    this.setEmojiInputHandler();
    this.setAddCommentHandler();
  }

  _deleteCommentHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();

    if (!isOnline()) {
      toast('You can\'t delete comment offline');
      return;
    }

    const commentId = evt.target.dataset.commentId;

    evt.target.innerText = 'Deleting...';
    evt.target.disabled = true;

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      { id: this._data.id, commentId },
    );
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        {
          watchList: !this._data.watchList,
        },
      ),
    );
  }

  _markAsWatchedHandler(evt) {
    evt.preventDefault();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        {
          alreadyWatched: !this._data.alreadyWatched,
          watchingDate: dayjs().toISOString(),
        },
      ),
    );
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        {
          favorite: !this._data.favorite,
        },
      ),
    );
  }

  _emojiInputHandler(evt) {
    evt.preventDefault();
    const scrollTop = this.getScrollTop();

    const comment = this.getElement().querySelector('.film-details__comment-input').value;
    this.updateData({
      emoji: evt.target.value,
      commentText: comment,
    }, false);
    this.scrollByTop(scrollTop);
  }

  _addCommentHandler(evt) {
    if (evt.ctrlKey && evt.code === 'Enter') {
      evt.preventDefault();

      if(!isOnline()) {
        toast('You can\'t add comment offline');
        return;
      }

      if (this._data.emoji === undefined) {
        this.shake();
      } else {
        const comment = evt.target.value;
        const emotion = this._data.emoji;
        this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.MINOR,
          {
            id: this._data.id,
            comment,
            emotion,
          },
        );
      }
    }
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setDeleteCommentHandler() {
    if (isOnline()) {
      this.getElement().querySelector('.film-details__comments-wrap').addEventListener('click', this._deleteCommentHandler);
    }
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

  setEmojiInputHandler() {
    if (isOnline()) {
      this.getElement().querySelectorAll('.film-details__emoji-item').forEach((it) => it.addEventListener('input', this._emojiInputHandler));
    }
  }

  setAddCommentHandler() {
    if (isOnline()) {
      this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._addCommentHandler);
    }
  }

  getScrollTop() {
    return this.getElement().scrollTop;
  }

  scrollByTop(scrollTop) {
    this.getElement().scrollBy(0, scrollTop, 0);
  }
}

export { PopupState };
