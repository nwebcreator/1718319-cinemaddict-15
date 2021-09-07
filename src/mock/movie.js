import { getRandomElementFromArray, generateDate, getRandomFloat, getRandomInteger, getRandomUniqueElementsFromArray, range } from '../utils/common.js';

const TOTAL_MOVIES = 250;
const TITLES = ['Made for each other', 'Popeye meets sinbad', 'Sagebrush trail', 'Santa claus conquers the martians', 'The dance of life', 'The great flamarion', 'The man with the golden arm'];
const POSTERS = ['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg', 'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'];
const DIRECTORS = ['John Cromwell', 'Dave Fleischer', 'Armand Schaefer', 'Nicholas Webster', 'John Cromwell', 'Anthony Mann', 'Otto Ludwig Preminger'];
const COUNTRIES = ['England', 'Russia', 'USA', 'Japan', 'France'];
const GENRES = ['Drama', 'Film-Noir', 'Mystery', 'Musical', 'Western', 'Comedy'];
const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];
const MAX_COMMENTS_COUNT = 5;
const COMMENTS_AUTHORS = ['Masha', 'Nicolas', 'Natasha', 'Igor', 'Taras', 'Ignat', 'Ember', 'Ilon'];
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const getComments = () => range(1, getRandomInteger(1, MAX_COMMENTS_COUNT)).map((it) => it.toString());

const generateFilmInfo = () => ({
  title: getRandomElementFromArray(TITLES),
  alternativeTitle: getRandomElementFromArray(TITLES),
  totalRaiting: getRandomFloat(0, 10, 1),
  poster: `images/posters/${getRandomElementFromArray(POSTERS)}`,
  ageRating: getRandomInteger(0, 18),
  director: getRandomElementFromArray(DIRECTORS),
  writers: getRandomUniqueElementsFromArray(DIRECTORS, 1),
  actors: getRandomUniqueElementsFromArray(DIRECTORS, 2),
  releaseDate: generateDate().toISOString(),
  releaseCountry: getRandomElementFromArray(COUNTRIES),
  runtime: getRandomInteger(50, 180),
  genre: getRandomUniqueElementsFromArray(GENRES, 1, 3),
  description: getRandomUniqueElementsFromArray(DESCRIPTIONS, 1, 5).join(' '),
});

const generateUseDetails = () => {
  const alreadyWatched = getRandomElementFromArray([true, false]);
  return {
    watchList: getRandomElementFromArray([true, false]),
    alreadyWatched,
    watchingDate: alreadyWatched ? generateDate().toISOString() : undefined,
    favorite: getRandomElementFromArray([true, false]),
  };
};

const generateMovie = (id) => Object.assign({}, {
  id: id.toString(),
  comments: getComments(),
},
generateFilmInfo(),
generateUseDetails());

const generateMovies = () => {
  const movies = [];
  for (let i = 0; i < TOTAL_MOVIES; i++) {
    movies.push(generateMovie(i + 1));
  }
  return movies;
};

const generateComment = (id) => ({
  id: id.toString(),
  author: getRandomElementFromArray(COMMENTS_AUTHORS),
  comment: getRandomElementFromArray(DESCRIPTIONS),
  date: generateDate().toISOString(),
  emotion: getRandomElementFromArray(EMOTIONS),
});

const generateComments = () => {
  const comments = [];
  for (let i = 0; i < MAX_COMMENTS_COUNT; i++) {
    comments.push(generateComment(i + 1));
  }

  return comments;
};

export { generateMovies, generateComments };
