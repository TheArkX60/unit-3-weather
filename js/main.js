// Entry point: hash router that shows one screen section at a time.
const SCREENS = ['main', 'dates', 'trip', 'info', 'location', 'error'];

function route() {
  const name = SCREENS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'main';
  for (const id of SCREENS) {
    document.getElementById(`screen-${id}`).hidden = id !== name;
  }
}

window.addEventListener('hashchange', route);
route();
