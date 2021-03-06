import FilmsContainerView from '../view/films-container.js';
import BoardView from '../view/board.js';
import SortView from '../view/sort.js';
import NoFilmView from '../view/no-film.js';
import LoadingView from '../view/loading.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import PopupView, { PopupState } from '../view/popup.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import MoviePresenter from './movie.js';
import { sortMoviesByDate, sortMoviesByRating } from '../utils/sort-movies.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { filter } from '../utils/filter.js';

const CARDS_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class MovieList {
  constructor(mainContainer, moviesModel, filterModel, api) {
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;
    this._mainContainer = mainContainer;
    this._renderedMovieCount = CARDS_COUNT_PER_STEP;
    this._moviePresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._sortComponent = null;
    this._siteMenuComponent = null;
    this._showMoreButtonComponent = null;

    this._boardComponent = new BoardView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._noFilmComponent = new NoFilmView();
    this._loadingComponent = new LoadingView();
    this._topRatedFilmsExtraComponent = new FilmsListExtraView('Top rated');
    this._mostCommentedFilmsExtraComponent = new FilmsListExtraView('Most commented');
    this._openedPopup = null;

    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({ resetRenderedMovieCount: true, resetSortType: true });

    remove(this._filmsContainerComponent);
    remove(this._boardComponent);

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies().slice();
    const filtredMovies = filter[filterType](movies);
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredMovies.sort(sortMoviesByDate);
      case SortType.BY_RATING:
        return filtredMovies.sort(sortMoviesByRating);
      default:
        return filtredMovies;
    }
  }

  _closePopup() {
    remove(this._openedPopup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._openedPopup = null;
  }

  _openPopup(movie) {
    return () => this._api.getComments(movie.id)
      .then((movieComments) => {
        let scrollTop = 0;
        if (this._openedPopup) {
          scrollTop = this._openedPopup.getScrollTop();
          this._closePopup();
        }

        const popupMovie = Object.assign({}, movie, { movieComments });
        const popup = new PopupView(popupMovie, this._handleViewAction);
        document.body.appendChild(popup.getElement());
        document.body.classList.add('hide-overflow');
        popup.setCloseClickHandler(this._closePopup);
        this._openedPopup = popup;
        this._openedPopup.scrollByTop(scrollTop);
        document.addEventListener('keydown', this._onEscKeyDown);
      });
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange); // ???????????????? ?????????????? ?????????? ???????????????????? ???? ?????????? ????????????????????

    render(this._boardComponent, this._sortComponent, RenderPosition.BEFORE);
  }

  _renderMovie(movie, container) {
    const moviePresenter = new MoviePresenter(container || this._filmsContainerComponent.getFilmsContainer(), this._openPopup, this._handleViewAction);
    moviePresenter.init(movie);
    let presenters = this._moviePresenter.get(movie.id);
    if (presenters === undefined) {
      presenters = [moviePresenter];
      this._moviePresenter.set(movie.id, presenters);
    } else {
      presenters.push(moviePresenter);
    }
  }

  _renderMovies(movies) {
    // ?????????? ?????? ???????????????????? N-?????????? ???? ??????
    movies.forEach((movie) => this._renderMovie(movie));
  }

  _renderNoFilms() {
    if (this._noFilmComponent !== null) {
      this._noFilmComponent = null;
    }

    const filterType = this._filterModel.getFilter();
    this._noFilmComponent = new NoFilmView(filterType);

    render(this._boardComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._filmsContainerComponent.getFilmsContainer(), this._showMoreButtonComponent, RenderPosition.AFTER);
  }

  _renderExtraFilms() {
    const movies = this._moviesModel.getMovies();
    if (movies.length === 0) {
      return;
    }
    render(this._boardComponent, this._topRatedFilmsExtraComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._mostCommentedFilmsExtraComponent, RenderPosition.BEFOREEND);

    const topRatedMovies = movies.slice().filter((it) => it.totalRaiting > 0);
    if (topRatedMovies.length > 0) {
      topRatedMovies.sort((a, b) => b.totalRaiting - a.totalRaiting);
      const topRatedFilmsContainer = this._topRatedFilmsExtraComponent.getFilmsContainer();
      for (const movie of topRatedMovies.slice(0, EXTRA_CARDS_COUNT)) {
        this._renderMovie(movie, topRatedFilmsContainer);
      }
    } else {
      remove(this._topRatedFilmsExtraComponent);
    }

    const mostCommentedMovies = movies.slice().filter((it) => it.comments.length > 0);
    if (mostCommentedMovies.length > 0) {
      mostCommentedMovies.sort((a, b) => b.comments.length - a.comments.length);
      const mostCommentedFilmsContainer = this._mostCommentedFilmsExtraComponent.getFilmsContainer();
      for (const movie of mostCommentedMovies.slice(0, EXTRA_CARDS_COUNT)) {
        this._renderMovie(movie, mostCommentedFilmsContainer);
      }
    } else {
      remove(this._mostCommentedFilmsExtraComponent);
    }
  }

  _clearBoard({ resetRenderedMovieCount = false, resetSortType = false } = {}) {
    const movieCount = this._getMovies().length;

    this._moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    this._moviePresenter.clear();

    remove(this._siteMenuComponent);
    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._boardComponent);

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = CARDS_COUNT_PER_STEP;
    } else {
      if (this._renderedMovieCount < CARDS_COUNT_PER_STEP) {
        this._renderedMovieCount = Math.max(movieCount, this._renderedMovieCount);
      } else {
        this._renderedMovieCount = Math.min(movieCount, this._renderedMovieCount);
      }
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    render(this._mainContainer, this._boardComponent, RenderPosition.BEFOREEND);
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const totalMoviesCount = this._moviesModel.getMovies().length;
    if (totalMoviesCount === 0) {
      this._renderNoFilms();
    } else {
      const movies = this._getMovies();
      const movieCount = movies.length;
      if (movieCount > 0) {
        this._renderSort();
        render(this._boardComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
        this._renderMovies(movies.slice(0, Math.min(movieCount, this._renderedMovieCount)));
        if (movieCount > this._renderedMovieCount) {
          this._renderShowMoreButton();
        }
      } else {
        this._renderNoFilms();
      }

      this._renderExtraFilms();
    }
  }

  _handleShowMoreButtonClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedMovieCount + CARDS_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMovieCount);
    this._renderMovies(movies);
    this._renderedMovieCount = newRenderedMovieCount;

    if (this._renderedMovieCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    // ?????????????????? ???????????? ???????????? ???????? ?????????? ???????????????????? ???????????????????? ???? ??????????????
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({ resetRenderedMovieCount: true });
    this._renderBoard();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._api.updateMovie(update)
          .then((response) => {
            if (this._openedPopup) {
              this._openedPopup.setViewState(PopupState.DEFAULT);
            }
            this._moviesModel.updateMovie(updateType, response);
          })
          .catch(() => {
            if (this._openedPopup) {
              this._openedPopup.setViewState(PopupState.ABORTING);
            }
          });
        break;
      case UserAction.ADD_COMMENT:
        this._openedPopup.setViewState(PopupState.SAVING);
        this._api.addComment(update)
          .then((response) => {
            this._openedPopup.setViewState(PopupState.DEFAULT);
            this._moviesModel.updateMovie(updateType, response);
          })
          .catch(() => {
            this._openedPopup.setViewState(PopupState.ABORTING);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => {
            this._openedPopup.setViewState(PopupState.DEFAULT);
            this._moviesModel.deleteComment(updateType, update);
          })
          .catch(() => {
            this._openedPopup.setViewState(PopupState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - ???????????????? ?????????? ???????????? (????????????????, ?????????? ???????????????????? ????????????????)
        this._moviePresenter.get(data.id).forEach((presenter) => presenter.init(data));
        break;
      case UpdateType.MINOR:
        // - ???????????????? ???????????? (????????????????, ?????????? ???????????? ???????? ?? ??????????)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - ???????????????? ?????? ?????????? (????????????????, ?????? ???????????????????????? ??????????????)
        this._clearBoard({ resetRenderedMovieCount: true, resetSortType: true });
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._noFilmComponent);
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }

    if (this._openedPopup) {
      this._openPopup(data)();
    }
  }
}
