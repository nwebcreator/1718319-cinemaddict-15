import AbstractView from './abstract.js';

export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return '<div class="films-list__container"></div>';
  }
}
