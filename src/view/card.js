import { getYear, getFormatedDuration } from './../utils.js';

const createCardTemplate = (movie) => (
  `<article class="film-card">
     <h3 class="film-card__title">${movie.filmInfo.title}</h3>
     <p class="film-card__rating">${movie.filmInfo.totalRaiting}</p>
     <p class="film-card__info">
       <span class="film-card__year">${getYear(movie.filmInfo.release.date)}</span>
       <span class="film-card__duration">${getFormatedDuration(movie.filmInfo.runtime)}</span>
       <span class="film-card__genre">${movie.filmInfo.genre.join(', ')}</span>
     </p>
     <img src="./${movie.filmInfo.poster}" alt="" class="film-card__poster">
     <p class="film-card__description">${movie.filmInfo.description}</p>
     <a class="film-card__comments">${movie.comments.length} comments</a>
     <div class="film-card__controls">
       <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${movie.userDetails.watchList ? ' film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
       <button class="film-card__controls-item film-card__controls-item--mark-as-watched${movie.userDetails.alreadyWatched ? ' film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
       <button class="film-card__controls-item film-card__controls-item--favorite${movie.userDetails.favorite ? ' film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
     </div>
   </article>`);

export { createCardTemplate };
