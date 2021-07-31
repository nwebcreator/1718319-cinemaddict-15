import { createSiteMenuTemplate } from './view/menu.js';
import { createProfileTemplate } from './view/profile.js';
import { createFilmsContainerTemplate } from './view/films.js';
import { createCardTemplate } from './view/card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createFilmsExtraContainerTemplate } from './view/films-list-extra.js';
import { createSortsTemplate } from './view/sorts.js';
import { createPopupTemplate } from './view/popup.js';

const CARDS_COUNT = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

render(headerElement, createProfileTemplate(), 'beforeend');
render(mainElement, createSiteMenuTemplate(), 'beforeend');
render(mainElement, createSortsTemplate(), 'beforeend');
render(mainElement, createFilmsContainerTemplate(), 'beforeend');

const filmsListElement = mainElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for(let i = 0; i < CARDS_COUNT; i++) {
  render(filmsListContainerElement, createCardTemplate(), 'beforeend');
}

render(filmsListContainerElement, createShowMoreButtonTemplate(), 'afterend');

render(filmsListElement, createFilmsExtraContainerTemplate('Most commented'), 'afterend');
render(filmsListElement, createFilmsExtraContainerTemplate('Top rated'), 'afterend');

const extraFilmsElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');
const topRatedElement = extraFilmsElements[0];
const mostCommentedElement = extraFilmsElements[1];

render(topRatedElement, createCardTemplate(), 'beforeend');
render(topRatedElement, createCardTemplate(), 'beforeend');

render(mostCommentedElement, createCardTemplate(), 'beforeend');
render(mostCommentedElement, createCardTemplate(), 'beforeend');

render(document.body, createPopupTemplate(), 'beforeend');
