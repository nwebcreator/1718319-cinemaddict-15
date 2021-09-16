import AbstractView from './abstract.js';

export default class Board extends AbstractView {
  getTemplate() {
    return '<section class="films"></section>';
  }

  getFilmsContainer() {
    return this.getElement().querySelector('.films-list');
  }
}
