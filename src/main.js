import ProfileView from './view/profile.js';
import StatsView from './view/stats.js';
import FooterStatisticView from './view/footer-statistic.js';
import { generateComments, generateMovies } from './mock/movie.js';
import { RenderPosition, render, remove } from './utils/render.js';
import MovieListPresenter from './presenter/movie-list.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import { MenuItem } from './const.js';

const movies = generateMovies();
const comments = generateComments();

const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);
moviesModel.setComments(comments);
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

if (movies.length > 0) {
  render(headerElement, new ProfileView(moviesModel), RenderPosition.BEFOREEND);
}

let statsView = null;
const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      // Показать доску
      // Скрыть статистику
      movieListPresenter.init();
      remove(statsView);
      break;
    case MenuItem.STATS:
      // Скрыть доску
      // Показать статистику
      movieListPresenter.destroy();
      statsView = new StatsView(moviesModel);
      render(mainElement, statsView, RenderPosition.BEFOREEND);
      break;
  }
};
const siteMenuPresenter = new SiteMenuPresenter(mainElement, moviesModel, filterModel, handleSiteMenuClick);
siteMenuPresenter.init();
movieListPresenter.init();

render(footerStatisticsElement, new FooterStatisticView(movies), RenderPosition.BEFOREEND);
