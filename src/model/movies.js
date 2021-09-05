import AbstractObserver from '../utils/abstract-observer.js';
import { generateDate } from '../utils/common.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
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
      date: generateDate().toISOString(),
      emotion: update.emotion,
    };

    const updatedMovie = this._movies[movieIndex];
    updatedMovie.comments.push(comment.id);

    this._comments = [
      comment,
      ...this._comments,
    ];

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

    const commentIndex = this._comments.findIndex((comment) => comment.id === update.commentId);

    if (commentIndex === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._comments = [
      ...this._comments.slice(0, commentIndex),
      ...this._comments.slice(commentIndex + 1),
    ];

    this._notify(updateType, updatedMovie);
  }
}
