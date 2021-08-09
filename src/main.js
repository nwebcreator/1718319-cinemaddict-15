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
import { RenderPosition, render } from './render.js';

const CARDS_COUNT_PER_STEP = 5;
const movies = generateMovies();
const comments = generateComments();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

if (movies.length === 0) {
  render(mainElement, new SiteMenuView(movies).getElement(), RenderPosition.BEFOREEND);
  render(mainElement, new NoFilmView().getElement(), RenderPosition.BEFOREEND);
  render(footerStatisticsElement, new FooterStatisticView(movies).getElement(), RenderPosition.BEFOREEND);
} else {
  render(headerElement, new ProfileView(movies).getElement(), RenderPosition.BEFOREEND);
  render(mainElement, new SiteMenuView(movies).getElement(), RenderPosition.BEFOREEND);
  render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(mainElement, new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);

  const filmsListElement = mainElement.querySelector('.films-list');
  const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

  const openPopup = (movie, evt) => {
    evt.preventDefault();

    if (document.body.classList.contains('hide-overflow')) {
      return;
    }

    const popupMovieComments = comments.filter((commnet) => movie.comments.includes(commnet.id));
    const popup = new PopupView(movie, popupMovieComments);

    const closePopup = () => {
      document.body.removeChild(popup.getElement());
      document.body.classList.remove('hide-overflow');
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
    popup.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => closePopup());
    document.addEventListener('keydown', onEscKeyDown);
  };

  const setCardViewListeners = (cardView, movie) => {
    cardView.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments').forEach((it) => it.addEventListener('click', openPopup.bind(null, movie)));
  };

  const showMoreButtonComponent = new ShowMoreButtonView();
  if (movies.length > CARDS_COUNT_PER_STEP) {
    let renderedMovieCount = 0;

    render(filmsListElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      movies
        .slice(renderedMovieCount, renderedMovieCount + CARDS_COUNT_PER_STEP)
        .forEach((movie) => {
          const cardView = new CardView(movie);
          render(filmsListContainerElement, cardView.getElement(), RenderPosition.BEFOREEND);
          setCardViewListeners(cardView, movie);
        });

      renderedMovieCount += CARDS_COUNT_PER_STEP;

      if (renderedMovieCount >= movies.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  showMoreButtonComponent.getElement().click();

  const filmsElement = mainElement.querySelector('.films');
  const topRatedFilmsExtraView = new FilmsListExtraView('Top rated');
  const mostCommentedFilmsExtraView = new FilmsListExtraView('Most commented');

  render(filmsElement, topRatedFilmsExtraView.getElement(), RenderPosition.BEFOREEND);
  render(filmsElement, mostCommentedFilmsExtraView.getElement(), RenderPosition.BEFOREEND);

  const topRatedElement = topRatedFilmsExtraView.getElement().querySelector('.films-list__container');
  const mostCommentedElement = mostCommentedFilmsExtraView.getElement().querySelector('.films-list__container');


  const topRatedMovies = movies.slice();
  topRatedMovies.sort((a, b) => b.filmInfo.totalRaiting - a.filmInfo.totalRaiting);

  const firstTopRatedCardView = new CardView(topRatedMovies[0]);
  const secondTopRatedCardView = new CardView(topRatedMovies[1]);

  render(topRatedElement, firstTopRatedCardView.getElement(), RenderPosition.BEFOREEND);
  render(topRatedElement, secondTopRatedCardView.getElement(), RenderPosition.BEFOREEND);
  setCardViewListeners(firstTopRatedCardView, topRatedMovies[0]);
  setCardViewListeners(secondTopRatedCardView, topRatedMovies[1]);


  const mostCommentedMovies = movies.slice();
  mostCommentedMovies.sort((a, b) => b.comments.length - a.comments.length);

  const firstMostCommentedCardView = new CardView(mostCommentedMovies[0]);
  const secondMostCommentedCardView = new CardView(mostCommentedMovies[1]);

  render(mostCommentedElement, firstMostCommentedCardView.getElement(), RenderPosition.BEFOREEND);
  render(mostCommentedElement, secondMostCommentedCardView.getElement(), RenderPosition.BEFOREEND);
  setCardViewListeners(firstMostCommentedCardView, mostCommentedMovies[0]);
  setCardViewListeners(secondMostCommentedCardView, mostCommentedMovies[1]);

  render(footerStatisticsElement, new FooterStatisticView(movies).getElement(), RenderPosition.BEFOREEND);
}
