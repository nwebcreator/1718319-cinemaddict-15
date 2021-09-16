import ProfileView from './view/profile.js';
import StatsView from './view/stats.js';
import FooterStatisticView from './view/footer-statistic.js';
import { RenderPosition, render, remove } from './utils/render.js';
import MovieListPresenter from './presenter/movie-list.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import { MenuItem, UpdateType } from './const.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import { toast } from './utils/toast.js';

const AUTHORIZATION = 'Basic persikjs7979';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const STORE_PREFIX = 'cinemaaddict-localstorage';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

render(headerElement, new ProfileView(moviesModel), RenderPosition.BEFOREEND);

let statsView = null;
const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, apiWithProvider);

const siteMenuClickHandler = (menuItem) => {
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

const siteMenuPresenter = new SiteMenuPresenter(mainElement, moviesModel, filterModel, siteMenuClickHandler);
siteMenuPresenter.init();
movieListPresenter.init();
render(footerStatisticsElement, new FooterStatisticView(moviesModel), RenderPosition.BEFOREEND);

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

let hideToast;
window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  if (hideToast) {
    hideToast();
  }

  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  hideToast = toast('No internet access', false);
});
