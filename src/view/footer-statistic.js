import { createElement } from '../utils.js';

export default class FooterStatistic {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return `<p>${this._movies.length} movies inside</p>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
