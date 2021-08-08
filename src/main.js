import SiteMenuView from './view/site-menu.js';
import ProfileView from './view/profile.js';
import FilmsContainerView from './view/films-container.js';
import CardView from './view/card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmsListExtraView from './view/films-list-extra.js';
import SortView from './view/sort.js';
import PopupView from './view/popup.js';
import FooterStatisticView from './view/footer-statistic.js';
import { generateComments, generateMovies } from './mock/movie.js';
import { RenderPosition, render } from './render.js';

const CARDS_COUNT_PER_STEP = 5;
const movies = generateMovies();
const comments = generateComments();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

render(headerElement, new ProfileView(movies).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SiteMenuView(movies).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);

const filmsListElement = mainElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(movies.length, CARDS_COUNT_PER_STEP); i++) {
  render(filmsListContainerElement, new CardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}


if (movies.length > CARDS_COUNT_PER_STEP) {
  let renderedMovieCount = CARDS_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsListElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + CARDS_COUNT_PER_STEP)
      .forEach((movie) => render(filmsListContainerElement, new CardView(movie).getElement(), RenderPosition.BEFOREEND));

    renderedMovieCount += CARDS_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const filmsElement = mainElement.querySelector('.films');
const topRatedFilmsExtraView = new FilmsListExtraView('Top rated');
const mostCommentedFilmsExtraView = new FilmsListExtraView('Most commented');

render(filmsElement, topRatedFilmsExtraView.getElement(), RenderPosition.BEFOREEND);
render(filmsElement, mostCommentedFilmsExtraView.getElement(), RenderPosition.BEFOREEND);

const topRatedElement = topRatedFilmsExtraView.getElement().querySelector('.films-list__container');
const mostCommentedElement = mostCommentedFilmsExtraView.getElement().querySelector('.films-list__container');

const mostRatedMovies = movies.slice();
mostRatedMovies.sort((a, b) => b.filmInfo.totalRaiting - a.filmInfo.totalRaiting);

render(topRatedElement, new CardView(mostRatedMovies[0]).getElement(), RenderPosition.BEFOREEND);
render(topRatedElement, new CardView(mostRatedMovies[1]).getElement(), RenderPosition.BEFOREEND);

const mostCommentedMovies = movies.slice();
mostCommentedMovies.sort((a, b) => b.comments.length - a.comments.length);

render(mostCommentedElement, new CardView(mostCommentedMovies[0]).getElement(), RenderPosition.BEFOREEND);
render(mostCommentedElement, new CardView(mostCommentedMovies[1]).getElement(), RenderPosition.BEFOREEND);

render(footerStatisticsElement, new FooterStatisticView(movies).getElement(), RenderPosition.BEFOREEND);

const popupMovie = movies[0];
const popupMovieComments = comments.filter((commnet) => popupMovie.comments.includes(commnet.id));
render(document.body, new PopupView(popupMovie, popupMovieComments).getElement(), RenderPosition.BEFOREEND);
