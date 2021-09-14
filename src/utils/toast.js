const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message, autoHide = true) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  toastContainer.append(toastItem);

  const hide = () => toastItem.remove();

  if (autoHide) {
    setTimeout(() => hide(), SHOW_TIME);
  }

  return hide;
};

export { toast };
