import dayjs from 'dayjs';
import AbstractObserver from '../utils/abstract-observer.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    const movieIndex = this._movies.findIndex((movie) => movie.id === update.id);

    if (movieIndex === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    const comment = {
      id: `${Math.random()}`,
      author: 'Natasha',
      comment: update.comment,
      date: dayjs().toISOString(),
      emotion: update.emotion,
    };

    const updatedMovie = this._movies[movieIndex];
    updatedMovie.comments.push(comment.id);

    this._notify(updateType, updatedMovie);
  }

  deleteComment(updateType, update) {
    const movieIndex = this._movies.findIndex((movie) => movie.id === update.id);

    if (movieIndex === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    const updatedMovie = this._movies[movieIndex];
    const movieCommentIndex = updatedMovie.comments.findIndex((comment) => comment === update.commentId);
    updatedMovie.comments = [
      ...updatedMovie.comments.slice(0, movieCommentIndex),
      ...updatedMovie.comments.slice(movieCommentIndex + 1),
    ];

    this._notify(updateType, updatedMovie);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      {
        id: movie.id,
        title: movie['film_info'].title,
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRaiting: movie['film_info']['total_rating'],
        poster: movie['film_info'].poster,
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info'].director,
        writers: movie['film_info'].writers,
        actors: movie['film_info'].actors,
        releaseDate: movie['film_info'].release.date,
        releaseCountry: movie['film_info'].release['release_country'],
        runtime: movie['film_info'].runtime,
        genre: movie['film_info'].genre,
        description: movie['film_info'].description,
        watchList: movie['user_details'].watchlist,
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
        favorite: movie['user_details'].favorite,
        comments: movie.comments,
      },
    );

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      {
        id: movie.id,
        ['film_info']: {
          title: movie.title,
          ['alternative_title']: movie.alternativeTitle,
          ['total_rating']: movie.totalRaiting,
          poster: movie.poster,
          ['age_rating']: movie.ageRating,
          director: movie.director,
          writers: movie.writers,
          actors: movie.actors,
          release: {
            date: movie.releaseDate,
            ['release_country']: movie.releaseCountry,
          },
          runtime: movie.runtime,
          genre: movie.genre,
          description: movie.description,
        },
        ['user_details']: {
          watchlist: movie.watchList,
          ['already_watched']: movie.alreadyWatched,
          ['watching_date']: movie.watchingDate,
          favorite: movie.favorite,
        },
        comments: movie.comments,
      },
    );

    return adaptedMovie;
  }
}
