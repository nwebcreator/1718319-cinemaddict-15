import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getRandomInteger = (min, max) => {
  if (max <= min) {
    throw new Error('Value max cannot be less or equal than min');
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getYear = (date) => dayjs(date).year();

const getHoursAndMinutes = (duration) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return { hours, minutes };
};

const getFormatedDuration = (duration) => {
  const { hours, minutes } = getHoursAndMinutes(duration);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getFullDate = (date) => dayjs(date).format('D MMM YYYY');

const getCommentsDate = (date) => dayjs(date).fromNow();

const pluralize = (count, word) => count > 1 ? `${word}s` : word;

const isOnline = () => window.navigator.onLine;

export { getRandomInteger, getYear, getHoursAndMinutes, getFormatedDuration, getFullDate, getCommentsDate, pluralize, isOnline };
