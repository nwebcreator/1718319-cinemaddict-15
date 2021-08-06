import { createSiteMenuTemplate } from './view/menu.js';
import { createProfileTemplate } from './view/profile.js';
import { createFilmsContainerTemplate } from './view/films.js';
import { createCardTemplate } from './view/card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createFilmsExtraContainerTemplate } from './view/films-list-extra.js';
import { createSortsTemplate } from './view/sorts.js';
import { createPopupTemplate } from './view/popup.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics.js';
import { generateComments, generateMovies } from './mock/movie.js';

const CARDS_COUNT_PER_STEP = 5;
const movies = generateMovies();
const comments = generateComments();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

render(headerElement, createProfileTemplate(movies), 'beforeend');
render(mainElement, createSiteMenuTemplate(movies), 'beforeend');
render(mainElement, createSortsTemplate(), 'beforeend');
render(mainElement, createFilmsContainerTemplate(), 'beforeend');

const filmsListElement = mainElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for(let i = 0; i < Math.min(movies.length, CARDS_COUNT_PER_STEP); i++) {
  render(filmsListContainerElement, createCardTemplate(movies[i]), 'beforeend');
}


if (movies.length > CARDS_COUNT_PER_STEP) {
  let renderedMovieCount = CARDS_COUNT_PER_STEP;

  render(filmsListContainerElement, createShowMoreButtonTemplate(), 'afterend');

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + CARDS_COUNT_PER_STEP)
      .forEach((movie) => render(filmsListContainerElement, createCardTemplate(movie), 'beforeend'));

    renderedMovieCount += CARDS_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

render(filmsListElement, createFilmsExtraContainerTemplate('Most commented'), 'afterend');
render(filmsListElement, createFilmsExtraContainerTemplate('Top rated'), 'afterend');

const extraFilmsElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');
const topRatedElement = extraFilmsElements[0];
const mostCommentedElement = extraFilmsElements[1];

const mostRatedMovies = movies.slice();
mostRatedMovies.sort((a, b) => b.filmInfo.totalRaiting - a.filmInfo.totalRaiting);

render(topRatedElement, createCardTemplate(mostRatedMovies[0]), 'beforeend');
render(topRatedElement, createCardTemplate(mostRatedMovies[1]), 'beforeend');

const mostCommentedMovies = movies.slice();
mostCommentedMovies.sort((a, b) => b.comments.length - a.comments.length);

render(mostCommentedElement, createCardTemplate(mostCommentedMovies[0]), 'beforeend');
render(mostCommentedElement, createCardTemplate(mostCommentedMovies[1]), 'beforeend');

render (footerStatisticsElement, createFooterStatisticsTemplate(movies), 'beforeend');

const popupMovie = movies[0];
const popupMovieComments = comments.filter((commnet) => popupMovie.comments.includes(commnet.id));
render(document.body, createPopupTemplate(popupMovie, popupMovieComments), 'beforeend');
