import SiteMenuView from './view/site-menu.js';
import ProfileView from './view/profile.js';
import FooterStatisticView from './view/footer-statistic.js';
import { generateComments, generateMovies } from './mock/movie.js';
import { RenderPosition, render } from './utils/render.js';
import MovieListPresenter from './presenter/movie-list.js';

const movies = generateMovies();
const comments = generateComments();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

if (movies.length > 0) {
  render(headerElement, new ProfileView(movies), RenderPosition.BEFOREEND);
}

const movieListPresenter = new MovieListPresenter(mainElement);
movieListPresenter.init(movies, comments);
render(mainElement, new SiteMenuView(movies), RenderPosition.AFTERBEGIN);
render(footerStatisticsElement, new FooterStatisticView(movies), RenderPosition.BEFOREEND);
