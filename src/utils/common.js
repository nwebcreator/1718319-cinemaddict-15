import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getRandomInteger = (min, max) => {
  if (max <= min) {
    throw new Error('Value max cannot be less or equal than min');
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomFloat = (min, max, fractionDigits) => {
  if (max < 0) {
    throw new Error('Value max cannot be less than zero');
  }
  if (max <= min) {
    throw new Error('Value max cannot be less or equal than min');
  }

  return parseFloat((Math.random() * (max - min) + min).toFixed(fractionDigits));
};

const getRandomElementFromArray = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getRandomUniqueElementsFromArray = (elements, min = 0, max = elements.length - 1) => {
  const totalCount = getRandomInteger(min, max);
  const shuffled = elements.slice(0).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, totalCount);
};

const generateDate = () => {
  const yearsGap = getRandomInteger(-3, 0);
  const monthsGap = getRandomInteger(-11, 0);
  const daysGap = getRandomInteger(-7, 0);
  const hoursGap = getRandomInteger(-23, 0);
  const minutesGap = getRandomInteger(-59, 0);
  return dayjs().add(yearsGap, 'year').add(monthsGap, 'month').add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute').toDate();
};

const range = (start, end) => {
  const ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
};

const getYear = (date) => dayjs(date).year();

const getFormatedDuration = (duration) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getFullDate = (date) => dayjs(date).format('D MMM YYYY');

const getCommentsDate = (date) => dayjs(date).fromNow();

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const pluralize = (count, word) => count > 1 ? `${word}s` : word;

export { getRandomInteger, getRandomFloat, getRandomElementFromArray, getRandomUniqueElementsFromArray, generateDate, range, getYear, getFormatedDuration, getFullDate, getCommentsDate, updateItem, pluralize };
