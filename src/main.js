import SiteMenuView from './view/site-menu.js';
import ProfileView from './view/profile.js';
import FilmsContainerView from './view/films-container.js';
import CardView from './view/card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmsListExtraView from './view/films-list-extra.js';
import SortView from './view/sort.js';
import PopupView from './view/popup.js';
import FooterStatisticView from './view/footer-statistic.js';
import NoFilmView from './view/no-film.js';
import { generateComments, generateMovies } from './mock/movie.js';
import { RenderPosition, render, remove } from './render.js';

const CARDS_COUNT_PER_STEP = 5;
const movies = generateMovies();
const comments = generateComments();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

if (movies.length === 0) {
  render(mainElement, new SiteMenuView(movies), RenderPosition.BEFOREEND);
  render(mainElement, new NoFilmView(), RenderPosition.BEFOREEND);
  render(footerStatisticsElement, new FooterStatisticView(movies), RenderPosition.BEFOREEND);
} else {
  render(headerElement, new ProfileView(movies), RenderPosition.BEFOREEND);
  render(mainElement, new SiteMenuView(movies), RenderPosition.BEFOREEND);
  render(mainElement, new SortView(), RenderPosition.BEFOREEND);
  render(mainElement, new FilmsContainerView(), RenderPosition.BEFOREEND);

  const filmsListElement = mainElement.querySelector('.films-list');
  const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

  let popupOpened = false;
  const openPopup = (movie) => () => {

    if (popupOpened) {
      return;
    }

    const popupMovieComments = comments.filter((comment) => movie.comments.includes(comment.id));
    const popup = new PopupView(movie, popupMovieComments);

    const closePopup = () => {
      remove(popup);
      document.body.classList.remove('hide-overflow');
      popupOpened = false;
    };

    const onEscKeyDown = (evt2) => {
      if (evt2.key === 'Escape' || evt2.key === 'Esc') {
        evt2.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.body.appendChild(popup.getElement());
    document.body.classList.add('hide-overflow');

    popup.setCloseClickHandler(closePopup);
    document.addEventListener('keydown', onEscKeyDown);
    popupOpened = true;
  };

  const setCardViewListeners = (cardView, movie) => {
    cardView.setOpenPopupHandler(openPopup(movie));
  };

  for (let i = 0; i < Math.min(movies.length, CARDS_COUNT_PER_STEP); i++) {
    const cardView = new CardView(movies[i]);
    render(filmsListContainerElement, cardView, RenderPosition.BEFOREEND);
    setCardViewListeners(cardView, movies[i]);
  }

  const showMoreButtonComponent = new ShowMoreButtonView();
  if (movies.length > CARDS_COUNT_PER_STEP) {
    let renderedMovieCount = CARDS_COUNT_PER_STEP;

    render(filmsListElement, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      movies
        .slice(renderedMovieCount, renderedMovieCount + CARDS_COUNT_PER_STEP)
        .forEach((movie) => {
          const cardView = new CardView(movie);
          render(filmsListContainerElement, cardView, RenderPosition.BEFOREEND);
          setCardViewListeners(cardView, movie);
        });

      renderedMovieCount += CARDS_COUNT_PER_STEP;

      if (renderedMovieCount >= movies.length) {
        remove(showMoreButtonComponent);
      }
    });
  }

  const filmsElement = mainElement.querySelector('.films');
  const topRatedFilmsExtraView = new FilmsListExtraView('Top rated');
  const mostCommentedFilmsExtraView = new FilmsListExtraView('Most commented');

  render(filmsElement, topRatedFilmsExtraView, RenderPosition.BEFOREEND);
  render(filmsElement, mostCommentedFilmsExtraView, RenderPosition.BEFOREEND);

  const topRatedElement = topRatedFilmsExtraView.getElement().querySelector('.films-list__container');
  const mostCommentedElement = mostCommentedFilmsExtraView.getElement().querySelector('.films-list__container');


  const topRatedMovies = movies.slice();
  topRatedMovies.sort((a, b) => b.filmInfo.totalRaiting - a.filmInfo.totalRaiting);

  const firstTopRatedCardView = new CardView(topRatedMovies[0]);
  const secondTopRatedCardView = new CardView(topRatedMovies[1]);

  render(topRatedElement, firstTopRatedCardView, RenderPosition.BEFOREEND);
  render(topRatedElement, secondTopRatedCardView, RenderPosition.BEFOREEND);
  setCardViewListeners(firstTopRatedCardView, topRatedMovies[0]);
  setCardViewListeners(secondTopRatedCardView, topRatedMovies[1]);


  const mostCommentedMovies = movies.slice();
  mostCommentedMovies.sort((a, b) => b.comments.length - a.comments.length);

  const firstMostCommentedCardView = new CardView(mostCommentedMovies[0]);
  const secondMostCommentedCardView = new CardView(mostCommentedMovies[1]);

  render(mostCommentedElement, firstMostCommentedCardView, RenderPosition.BEFOREEND);
  render(mostCommentedElement, secondMostCommentedCardView, RenderPosition.BEFOREEND);
  setCardViewListeners(firstMostCommentedCardView, mostCommentedMovies[0]);
  setCardViewListeners(secondMostCommentedCardView, mostCommentedMovies[1]);

  render(footerStatisticsElement, new FooterStatisticView(movies), RenderPosition.BEFOREEND);
}
