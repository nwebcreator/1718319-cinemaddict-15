import FilmsContainerView from '../view/films-container.js';
import BoardView from '../view/board.js';
import SortView from '../view/sort.js';
import NoFilmView from '../view/no-film.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import PopupView from '../view/popup.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import MoviePresenter from './movie.js';
import { sortMoviesByDate, sortMoviesByRating } from '../utils/sort-movies.js';
import { SortType } from '../const.js';

const CARDS_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._renderedMovieCount = CARDS_COUNT_PER_STEP;
    this._moviePresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._board = new BoardView();
    this._sortComponent = new SortView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedFilmsExtraComponent = new FilmsListExtraView('Top rated');
    this._mostCommentedFilmsExtraComponent = new FilmsListExtraView('Most commented');
    this._openedPopup = null;

    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._sourcedMovies = movies.slice();
    this._comments = comments.slice();
    render(this._mainContainer, this._board, RenderPosition.BEFOREEND);
    render(this._board.getFilmsContainer(), this._filmsContainerComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _handleMovieChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);
    this._moviePresenter.get(updatedMovie.id).forEach((presenter) => presenter.init(updatedMovie));
    if (this._openedPopup) {
      const scrollTop = this._openedPopup.getScrollTop();
      this._closePopup();
      this._openPopup(updatedMovie)();
      this._openedPopup.scrollByTop(scrollTop);
    }
  }

  _closePopup() {
    remove(this._openedPopup);
    document.body.classList.remove('hide-overflow');
    this._openedPopup = null;
  }

  _openPopup(movie) {
    return () => {
      if (this._openedPopup) {
        return;
      }

      const movieComments = this._comments.filter((comment) => movie.comments.includes(comment.id));
      const popupMovie = Object.assign({}, movie, {movieComments});
      const popup = new PopupView(popupMovie, this._handleMovieChange);

      const onEscKeyDown = (evt2) => {
        if (evt2.key === 'Escape' || evt2.key === 'Esc') {
          evt2.preventDefault();
          this._closePopup();
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };

      document.body.appendChild(popup.getElement());
      document.body.classList.add('hide-overflow');

      popup.setCloseClickHandler(this._closePopup);

      document.addEventListener('keydown', onEscKeyDown);
      this._openedPopup = popup;
    };
  }

  _sortMovies(sortType) {
    // 2. Этот исходный массив фильмов необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _movies
    switch (sortType) {
      case SortType.BY_DATE:
        this._movies.sort(sortMoviesByDate);
        break;
      case SortType.BY_RATING:
        this._movies.sort(sortMoviesByRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _movies исходный массив
        this._movies = this._sourcedMovies.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // сортируем фильмы тольео если новая сортировка отличается от текущей
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortMovies(sortType);
    this._clearMovieList();
    this._renderMovieList();
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMovie(movie, container) {
    const moviePresenter = new MoviePresenter(container || this._filmsContainerComponent, this._openPopup, this._handleMovieChange);
    moviePresenter.init(movie);
    let presenters = this._moviePresenter.get(movie.id);
    if (presenters === undefined) {
      presenters = [moviePresenter];
      this._moviePresenter.set(movie.id, presenters);
    } else {
      presenters.push(moviePresenter);
    }
  }

  _renderMovies(from, to) {
    // Метод для рендеринга N-задач за раз
    this._movies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(movie));
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
    render(this._mainContainer, new NoFilmView(), RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderMovies(this._renderedMovieCount, this._renderedMovieCount + CARDS_COUNT_PER_STEP);
    this._renderedMovieCount += CARDS_COUNT_PER_STEP;

    if (this._renderedMovieCount >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._board.getFilmsContainer(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderExtraFilms() {
    render(this._board, this._topRatedFilmsExtraComponent, RenderPosition.BEFOREEND);
    render(this._board, this._mostCommentedFilmsExtraComponent, RenderPosition.BEFOREEND);

    const topRatedElement = this._topRatedFilmsExtraComponent.getFilmsContainer();
    const mostCommentedElement = this._mostCommentedFilmsExtraComponent.getFilmsContainer();

    const topRatedMovies = this._movies.slice();
    topRatedMovies.sort((a, b) => b.totalRaiting - a.totalRaiting);
    this._renderMovie(topRatedMovies[0], topRatedElement);
    this._renderMovie(topRatedMovies[1], topRatedElement);

    const mostCommentedMovies = this._movies.slice();
    mostCommentedMovies.sort((a, b) => b.comments.length - a.comments.length);

    this._renderMovie(mostCommentedMovies[0], mostCommentedElement);
    this._renderMovie(mostCommentedMovies[1], mostCommentedElement);
  }

  _clearMovieList() {
    this._moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    this._moviePresenter.clear();
    this._renderedMovieCount = CARDS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderMovieList() {
    this._renderMovies(0, Math.min(this._movies.length, CARDS_COUNT_PER_STEP));

    if (this._movies.length > CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderExtraFilms();
  }

  _renderBoard() {
    if (this._movies.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderMovieList();
  }
}
