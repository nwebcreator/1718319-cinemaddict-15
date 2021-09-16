import SmartView from './smart';

export default class FooterStatistic extends SmartView {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._data = { totalMovies: this._moviesModel.getMovies().length };
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  getTemplate() {
    return `<p>${this._data.totalMovies} movies inside</p>`;
  }

  restoreHandlers() {
  }

  _handleModelEvent() {
    const totalMovies = this._moviesModel.getMovies().length;
    this.updateData(
      { totalMovies },
    );
  }
}
