import AbstractView from './abstract.js';

export default class Loading extends AbstractView {
  getTemplate() {
    return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`;
  }
}
