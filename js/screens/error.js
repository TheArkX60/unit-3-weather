// Error screen: three distinct states, each drawn separately in the specification (R17-R19).
//   not-found    manual entry matched no US location
//   denied       the browser refused device location
//   unavailable  the forecast could not be fetched (offers a retry)
const $ = (id) => document.getElementById(id);

/** Wire the retry button once. `onRetry()` re-attempts whatever failed. */
export function initErrorScreen({ onRetry }) {
  $('error-retry').addEventListener('click', onRetry);
}

/** Show one error state; `detail` is the searched text for not-found. */
export function renderError(kind, detail = '') {
  for (const panel of document.querySelectorAll('#screen-error [data-error]')) {
    panel.hidden = panel.dataset.error !== kind;
  }
  $('error-query').textContent = detail ? `"${detail}"` : 'that search';
  // Move focus to the heading so screen readers announce what happened.
  document.querySelector(`#screen-error [data-error="${kind}"] h1`)?.focus();
}
