import dayjs from 'dayjs';

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
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const yearsGap = getRandomInteger(-100, -70);
  return dayjs().add(daysGap, 'day').add(yearsGap, 'year').toDate();
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

  if(hours > 0){
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const getFullDate = (date) => dayjs(date).format('D MMM YYYY');

const getCommentsDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');

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

const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));

const mergeDeep = (target, ...sources) => {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

export { getRandomInteger, getRandomFloat, getRandomElementFromArray, getRandomUniqueElementsFromArray, generateDate, range, getYear, getFormatedDuration, getFullDate, getCommentsDate, updateItem, mergeDeep };
