// Marks <html class="keyboard-open"> while the on-screen keyboard of a phone is up, so the CSS can
// make the practice pages compact (the page is only ~half as tall then and looked squashed).
//
// The viewport meta uses interactive-widget=resizes-content, so the page itself shrinks when the
// keyboard shows. We compare the current height with the tallest one seen while no keyboard was
// open, and only when a text field has focus (a resized desktop window does not count).

const MIN_SHRINK = 140; // px: smaller changes are browser bars, not a keyboard
const FIELD = 'input, textarea, [contenteditable="true"]';

let baseHeight = 0;
let baseWidth = 0;

const currentHeight = () => Math.min(window.visualViewport?.height ?? Infinity, window.innerHeight);

function update() {
  const height = currentHeight();

  // rotating the phone changes the width: forget the old reference
  if (Math.abs(window.innerWidth - baseWidth) > 60) {
    baseWidth = window.innerWidth;
    baseHeight = height;
  }

  const shrunk = baseHeight - height > MIN_SHRINK;
  if (!shrunk) baseHeight = height; // no keyboard: this is the reference height

  const typing = Boolean(document.activeElement?.matches?.(FIELD));
  document.documentElement.classList.toggle('keyboard-open', shrunk && typing);
}

export function watchKeyboard() {
  baseHeight = currentHeight();
  baseWidth = window.innerWidth;

  window.visualViewport?.addEventListener('resize', update);
  window.addEventListener('resize', update);
  document.addEventListener('focusin', update);
  // the field loses focus a moment before the viewport grows back
  document.addEventListener('focusout', () => setTimeout(update, 50));
}

watchKeyboard();
