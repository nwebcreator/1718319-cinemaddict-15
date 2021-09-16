import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { getProfileRating } from '../utils/rating.js';
import { getHoursAndMinutes } from '../utils/common.js';
import { makeItemsUnique, getCountMoviesByGenre, getTopGenre, filterMoviesByPeriod } from '../utils/stats.js';
import { FilterType, StatsPeriod } from '../const.js';
import { filter } from '../utils/filter.js';

const renderChart = (chartCtx, movies) => {
  const BAR_HEIGHT = 50;

  const movieGenres = movies.reduce((accumulator, currentValue) => [...accumulator, ...currentValue.genre], []);
  const uniqueGenres = makeItemsUnique(movieGenres);
  const moviesByGenreCounts = uniqueGenres.map((genre) => getCountMoviesByGenre(movies, genre));

  chartCtx.height = BAR_HEIGHT * uniqueGenres.length;

  const myChart = new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqueGenres,
      datasets: [{
        data: moviesByGenreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return myChart;
};

export default class Stats extends SmartView {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    this._selectedPeriod = StatsPeriod.ALL_TIME;
    this._data = this._parseModelToData(moviesModel);

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this.restoreHandlers();
  }

  getTemplate() {
    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${this._data.rating}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatsPeriod.ALL_TIME}"${this._selectedPeriod === StatsPeriod.ALL_TIME ? ' checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatsPeriod.TODAY}"${this._selectedPeriod === StatsPeriod.TODAY ? ' checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatsPeriod.WEEK}"${this._selectedPeriod === StatsPeriod.WEEK ? ' checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatsPeriod.MONTH}"${this._selectedPeriod === StatsPeriod.MONTH ? ' checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatsPeriod.YEAR}"${this._selectedPeriod === StatsPeriod.YEAR ? ' checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._data.totalWatchedMoviesCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${this._getTotalDurationMarkup(this._data.totalDuration)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._data.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
  }

  restoreHandlers() {
    this._setCharts();
    this._setPeriodChangeHandler();
  }

  _getTotalDurationMarkup(duration) {
    const { hours, minutes } = getHoursAndMinutes(duration);
    return `${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span>`;
  }

  _setCharts() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const { filteredByPeriodMovies } = this._data;
    const chartCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderChart(chartCtx, filteredByPeriodMovies);
  }

  _parseModelToData() {
    const watchedMovies = filter[FilterType.HISTORY](this._moviesModel.getMovies().slice());
    const filteredByPeriodMovies = filterMoviesByPeriod(watchedMovies, this._selectedPeriod);
    return {
      filteredByPeriodMovies,
      rating: getProfileRating(watchedMovies.length),
      totalDuration: filteredByPeriodMovies.map((movie) => movie.runtime).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      totalWatchedMoviesCount: filteredByPeriodMovies.length,
      topGenre: getTopGenre(filteredByPeriodMovies),
    };
  }

  _periodChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const selectedPeriod = evt.target.value;

    if (this._selectedPeriod === selectedPeriod) {
      return;
    }

    this._selectedPeriod = selectedPeriod;

    this.updateData(
      Object.assign(
        {},
        this._parseModelToData(),
      ));
  }

  _setPeriodChangeHandler(){
    this.getElement().querySelector('.statistic__filters').addEventListener('click', this._periodChangeHandler);
  }
}
