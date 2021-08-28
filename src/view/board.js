import AbstractView from './abstract.js';

export default class Board extends AbstractView {
  getTemplate() {
    return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
    </section>`;
  }

  getFilmsContainer() {
    return this.getElement().querySelector('.films-list');
  }
}
