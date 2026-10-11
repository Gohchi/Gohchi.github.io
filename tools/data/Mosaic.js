// Constants, settings persistence, drawing and export helpers for the mosaic tool.
// Plain JS (no Vue): the same drawing routine is used for the live preview
// (low resolution) and for the export (full resolution).

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PAPERS = {
  A4: { width: 3535, height: 5000 },
  A3: { width: 3633, height: 5000 },
};

export const PAPER_OPTIONS = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'CUSTOM', label: 'Personalizado' },
];

export const RATIO_OPTIONS = [
  { value: 'A4', label: 'Como A4' },
  { value: 'A3', label: 'Como A3' },
];

export const ORIENTATION_OPTIONS = [
  { value: 'v', label: 'Vertical', icon: 'crop_portrait' },
  { value: 'h', label: 'Horizontal', icon: 'crop_landscape' },
];

export const BACKGROUND_OPTIONS = [
  { value: 'white', label: 'Blanco', swatch: '#ffffff' },
  { value: 'black', label: 'Negro', swatch: '#000000' },
  { value: 'gray', label: 'Gris', swatch: '#808080' },
];

export const LINE_OPTIONS = [
  { value: 'NONE', label: 'Ninguno' },
  { value: 'LINE', label: 'Línea' },
  { value: 'DASH', label: 'Punteado' },
];

export const LIMITS = {
  columns: [1, 100],
  gap: [0, 500],
  margin: [0, 2000],
  custom: [200, 12000],
  repeat: [1, 100],
};

export const DEFAULT_SETTINGS = {
  paper: 'A3', // 'A4' | 'A3' | 'CUSTOM'
  orientation: 'v', // 'v' | 'h'
  customRatioBase: 'A4',
  customWidth: PAPERS.A4.width,
  customHeight: PAPERS.A4.height,
  columns: 4,
  gap: 4,
  marginTop: 40,
  marginRight: 30,
  marginBottom: 15,
  marginLeft: 20,
  background: 'white',
  lineStyle: 'LINE',
  showPaperType: false,
  legend: '',
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const isNumber = value => typeof value === 'number' && Number.isFinite(value);

// ---------------------------------------------------------------------------
// Paper size
// ---------------------------------------------------------------------------

// Custom sizes keep the proportion of A4 or A3: editing one side computes the other.
export function dimensionsFromWidth(base, width) {
  const ratio = PAPERS[base].width / PAPERS[base].height;
  const w = clamp(Math.round(width) || 1, ...LIMITS.custom);
  return { width: w, height: Math.round(w / ratio) };
}

export function dimensionsFromHeight(base, height) {
  const ratio = PAPERS[base].width / PAPERS[base].height;
  const h = clamp(Math.round(height) || 1, ...LIMITS.custom);
  return { width: Math.round(h * ratio), height: h };
}

export function getPaperSize(settings) {
  const base = settings.paper === 'CUSTOM'
    ? { width: settings.customWidth, height: settings.customHeight }
    : PAPERS[settings.paper];

  return settings.orientation === 'h'
    ? { width: base.height, height: base.width }
    : { width: base.width, height: base.height };
}

export function getPaperName(settings) {
  return settings.paper === 'CUSTOM' ? settings.customRatioBase : settings.paper;
}

// ---------------------------------------------------------------------------
// Settings persistence (images are never stored, only the options)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'mosaic-settings';

export function sanitizeSettings(input) {
  const base = DEFAULT_SETTINGS;
  const pick = (value, options, fallback) => (options.includes(value) ? value : fallback);
  const int = (value, [min, max], fallback) => (isNumber(value) ? clamp(Math.round(value), min, max) : fallback);

  return {
    paper: pick(input.paper, PAPER_OPTIONS.map(o => o.value), base.paper),
    orientation: pick(input.orientation, ['v', 'h'], base.orientation),
    customRatioBase: pick(input.customRatioBase, ['A4', 'A3'], base.customRatioBase),
    customWidth: int(input.customWidth, LIMITS.custom, base.customWidth),
    customHeight: int(input.customHeight, LIMITS.custom, base.customHeight),
    columns: int(input.columns, LIMITS.columns, base.columns),
    gap: int(input.gap, LIMITS.gap, base.gap),
    marginTop: int(input.marginTop, LIMITS.margin, base.marginTop),
    marginRight: int(input.marginRight, LIMITS.margin, base.marginRight),
    marginBottom: int(input.marginBottom, LIMITS.margin, base.marginBottom),
    marginLeft: int(input.marginLeft, LIMITS.margin, base.marginLeft),
    background: pick(input.background, BACKGROUND_OPTIONS.map(o => o.value), base.background),
    lineStyle: pick(input.lineStyle, LINE_OPTIONS.map(o => o.value), base.lineStyle),
    showPaperType: input.showPaperType === true,
    legend: typeof input.legend === 'string' ? input.legend.slice(0, 80) : '',
  };
}

export function loadSettings() {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    // ignore corrupted storage / privacy-mode errors
  }
  return sanitizeSettings({ ...DEFAULT_SETTINGS, ...stored });
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

let nextImageId = 1;

// Loads a File as an <img>. The object URL is kept so the list can show a thumbnail.
export function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({
      id: nextImageId++,
      name: file.name || 'Imagen',
      url,
      img,
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(file.name || 'Imagen'));
    };
    img.src = url;
  });
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

/**
 * Draws the mosaic on `canvas`.
 *
 * All the measures in `options` are in "full resolution" pixels (the size of the
 * exported file). `scale` only changes the size of the bitmap: 1 = export,
 * less than 1 = faster preview.
 *
 * items:   [{ img: HTMLImageElement, repeat: 'rest' | number }]
 * options: settings + { width, height, paperName }
 * returns: { tiles } number of pictures drawn
 */
export function renderMosaic(canvas, items, options, scale = 1) {
  const {
    width, height,
    marginTop, marginRight, marginBottom, marginLeft,
    gap, columns, background, lineStyle,
    showPaperType, legend, paperName,
  } = options;

  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo crear el canvas');

  ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  // paper
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;
  let tiles = 0;

  if (innerWidth > 0 && innerHeight > 0) {
    // border of the printable area (thicker in the preview so it stays visible)
    if (lineStyle !== 'NONE') {
      ctx.setLineDash(lineStyle === 'DASH' ? [10, 5] : []);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(2, 1.2 / scale);
      ctx.strokeRect(marginLeft, marginTop, innerWidth, innerHeight);
      ctx.setLineDash([]);
    }

    ctx.fillStyle = background;
    ctx.fillRect(marginLeft, marginTop, innerWidth, innerHeight);

    tiles = drawTiles(ctx, items, {
      marginLeft, marginTop, marginBottom, innerWidth, height,
      gap, columns: Math.max(1, columns),
    });
  }

  // label in the top margin
  const text = (legend || '').trim();
  if (showPaperType || text) {
    const padding = 10;
    const fontSize = clamp(marginTop - padding * 2, 4, 48);
    ctx.fillStyle = 'black';
    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = 'alphabetic';

    let x = marginLeft + padding;
    const y = padding + fontSize;

    if (showPaperType) {
      ctx.fillText(paperName, x, y);
      x += fontSize * 1.5;
    }
    if (text) {
      ctx.fillText(text, x, y);
    }
  }

  return { tiles };
}

// Places the pictures row by row.
//  - images with a fixed amount are placed first, in order
//  - images set to "rest" share the remaining slots
function drawTiles(ctx, items, layout) {
  if (!items.length) return 0;

  const { marginLeft, marginTop, marginBottom, innerWidth, height, gap, columns } = layout;
  const images = items.map(item => item.img);

  const cellWidth = (innerWidth - gap * (columns - 1)) / columns;
  if (cellWidth <= 0) return 0;

  const bottomLimit = height - marginBottom;
  const fixedSequence = [];
  const restIndexes = [];

  items.forEach(({ repeat }, index) => {
    if (repeat === 'rest') {
      restIndexes.push(index);
    } else {
      const count = Math.max(0, parseInt(repeat, 10) || 0);
      for (let i = 0; i < count; i++) fixedSequence.push(index);
    }
  });

  const hasRest = restIndexes.length > 0;
  const sequence = [...fixedSequence];

  if (hasRest) {
    const averageHeight = images.reduce(
      (sum, image) => sum + image.naturalHeight * (cellWidth / image.naturalWidth),
      0
    ) / images.length;

    const estimatedRows = Math.max(1, Math.floor((height - marginTop - marginBottom + gap) / (averageHeight + gap)));
    const restSlots = Math.max(0, columns * estimatedRows - fixedSequence.length);

    restIndexes.forEach((imageIndex, position) => {
      const count = Math.floor(restSlots / restIndexes.length)
        + (position < restSlots % restIndexes.length ? 1 : 0);
      for (let i = 0; i < count; i++) sequence.push(imageIndex);
    });
  }

  if (!sequence.length) sequence.push(0);

  const restStart = fixedSequence.length;
  let cursor = 0;
  let y = marginTop;
  let tiles = 0;

  for (let guard = 0; guard < 10000; guard++) {
    const row = [];
    let rowHeight = 0;

    for (let i = 0; i < columns; i++) {
      if (cursor >= sequence.length) {
        if (!hasRest) break;
        cursor = restStart; // keep cycling over the "rest" images only
        if (cursor >= sequence.length) break;
      }

      const image = images[sequence[cursor]] || images[0];
      const tileHeight = image.naturalHeight * (cellWidth / image.naturalWidth);
      row.push({ image, tileHeight });
      rowHeight = Math.max(rowHeight, tileHeight);
      cursor++;
    }

    if (!row.length || y + rowHeight > bottomLimit) break;

    row.forEach(({ image, tileHeight }, i) => {
      const offsetLeft = marginLeft + (cellWidth + gap) * i;
      const offsetTop = y + (rowHeight - tileHeight) / 2;
      ctx.drawImage(image, offsetLeft + 1, offsetTop + 1, cellWidth, tileHeight);
    });

    tiles += row.length;
    y += rowHeight + gap;

    if (row.length < columns && !hasRest) break;
  }

  return tiles;
}

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

export function fileStamp(date = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    + `_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

export function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen'))),
      type,
      quality
    );
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// JPEG inside the PDF keeps the file small enough to share from a phone.
export function buildPdfBlob(canvas) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) throw new Error('jsPDF no está disponible');

  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'l' : 'p',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width, canvas.height);
  return pdf.output('blob');
}

export function printPdfBlob(blob) {
  const url = URL.createObjectURL(blob);
  const frame = document.createElement('iframe');
  frame.style.display = 'none';
  frame.onload = () => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  };
  frame.src = url;
  document.body.appendChild(frame);
  setTimeout(() => {
    frame.remove();
    URL.revokeObjectURL(url);
  }, 120000);
}

export const nextPaint = () => new Promise(resolve => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});