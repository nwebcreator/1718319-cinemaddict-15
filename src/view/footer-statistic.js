import AbstractView from './abstract.js';

export default class FooterStatistic extends AbstractView {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return `<p>${this._movies.length} movies inside</p>`;
  }
}
