// Only one popover is open at a time: the main menu, the notifications panel, the filters
// (JLPT, Pool...) and the kanji dialog all go through here.
//
// A popover calls claimPopover(id, close) when it opens: whichever popover was open gets its
// close() called. It calls releasePopover(id) when it closes (or is destroyed).

let active = null; // { id, close }
let counter = 0;

export const newPopoverId = prefix => `${prefix}-${++counter}`;

export function claimPopover(id, close) {
  if (active && active.id !== id) {
    const previous = active;
    active = null;
    previous.close();
  }
  active = { id, close };
}

export function releasePopover(id) {
  if (active?.id === id) active = null;
}
