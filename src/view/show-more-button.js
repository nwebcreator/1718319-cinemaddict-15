import AbstractView from './abstract.js';

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
