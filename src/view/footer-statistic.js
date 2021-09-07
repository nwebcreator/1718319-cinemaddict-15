import AbstractView from './abstract.js';

export default class FooterStatistic extends AbstractView {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._totalMovies = 0;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  getTemplate() {
    return `<p>${this._totalMovies} movies inside</p>`;
  }

  _handleModelEvent() {
    this._totalMovies = this._moviesModel.getMovies().length;
    this.getElement().innerText = this._totalMovies;
  }
}
