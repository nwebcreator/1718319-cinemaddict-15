import ProfileView from './view/profile.js';
import StatsView from './view/stats.js';
import FooterStatisticView from './view/footer-statistic.js';
import { RenderPosition, render, remove } from './utils/render.js';
import MovieListPresenter from './presenter/movie-list.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import { MenuItem, UpdateType } from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic persikjs7979';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

render(headerElement, new ProfileView(moviesModel), RenderPosition.BEFOREEND);

let statsView = null;
const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, api);

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
render(footerStatisticsElement, new FooterStatisticView(moviesModel), RenderPosition.BEFOREEND);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });
