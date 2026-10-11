import { reactive } from 'vue';

const STORAGE_KEY = 'mosaic-lang';
const DEFAULT_LANG = 'es';

export const LANGS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

const messages = {
  es: {
    'app.title': 'Mosaicos',
    'lang.label': 'Idioma',
    'loading': 'Cargando…',

    'top.addImages': 'Agregar imágenes',
    'top.export': 'Exportar',
    'top.generating': 'Generando…',

    'export.png': 'Imagen PNG',
    'export.pdf': 'PDF',
    'export.pdfHint': 'Listo para imprimir o enviar',
    'export.print': 'Imprimir',
    'export.printHint': 'Abre el diálogo de impresión',
    'export.share': 'Compartir',
    'export.shareHint': 'Enviar a otra app',
    'export.shareTitle': 'Mosaico',
    'export.pngDone': 'Imagen descargada.',
    'export.pdfDone': 'PDF descargado.',
    'export.error': 'No se pudo generar el archivo. Probá con una hoja más chica (Hoja → Personalizado).',

    'info.v': 'vertical',
    'info.h': 'horizontal',
    'info.piece': 'pieza',
    'info.pieces': 'piezas',
    'info.toggleUnit': 'Tocá para ver en {unit}',
    'info.pieceTitle': 'Tamaño de cada pieza. Tocá para ver en {unit}',
    'info.preview': 'Vista previa de la hoja',

    'zoom.label': 'Zoom',
    'zoom.out': 'Alejar',
    'zoom.in': 'Acercar',
    'zoom.fit': 'Ajustar',
    'zoom.fitTitle': 'Ajustar a la pantalla',

    'empty.title': 'Empezá con tus imágenes',
    'empty.touch': 'Elegí las imágenes desde tu dispositivo.',
    'empty.desktop': 'Arrastralas hasta acá, pegalas con Ctrl+V o elegilas desde tu equipo.',
    'empty.choose': 'Elegir imágenes',
    'drop.hint': 'Soltá las imágenes para agregarlas',

    'sheet.hide': 'Ocultar opciones',
    'sheet.show': 'Mostrar opciones',
    'tabs.label': 'Opciones',
    'tab.paper': 'Hoja',
    'tab.layout': 'Diseño',
    'tab.images': 'Imágenes',
    'tab.style': 'Estilo',

    'paper.title': 'Tamaño de hoja',
    'paper.A4': 'A4',
    'paper.A3': 'A3',
    'paper.CUSTOM': 'Personalizado',
    'orientation.title': 'Orientación',
    'orientation.v': 'Vertical',
    'orientation.h': 'Horizontal',
    'custom.title': 'Medidas personalizadas',
    'custom.hint': 'Mantiene la proporción de la hoja elegida. Con la hoja en vertical, una más chica se genera más rápido.',
    'custom.ratio': 'Proporción',
    'ratio.A4': 'Como A4',
    'ratio.A3': 'Como A3',
    'custom.width': 'Ancho',
    'custom.height': 'Alto',

    'layout.title': 'Distribución',
    'layout.perRow': 'Imágenes por línea',
    'layout.gap': 'Espacio entre imágenes',
    'margins.title': 'Márgenes',
    'margins.top': 'Arriba',
    'margins.bottom': 'Abajo',
    'margins.left': 'Izquierda',
    'margins.right': 'Derecha',
    'margins.labelHint': 'El texto usa el margen superior. Aumentalo en la pestaña Diseño para verlo mejor.',

    'images.one': 'imagen',
    'images.many': 'imágenes',
    'images.add': 'Agregar',
    'images.removeAll': 'Quitar todas',
    'images.empty': 'Todavía no hay imágenes. Agregá algunas para armar la hoja.',
    'images.hintFixed': 'pone esa cantidad de copias primero.',
    'images.hintRest': 'reparte el espacio que queda entre las imágenes marcadas así.',
    'images.remove': 'Quitar {name}',
    'images.repeat': 'Repetición',
    'images.confirmClear': '¿Quitar todas las imágenes?',
    'images.pickError': 'Elegí archivos de imagen.',
    'images.failed': '{n} archivo(s) no se pudieron abrir.',
    'images.addedOne': 'Imagen agregada.',
    'images.addedMany': '{n} imágenes agregadas.',
    'repeat.rest': 'Resto',
    'repeat.fixed': 'Cantidad',

    'filter.title': 'Filtro de imagen',
    'filter.amount': 'Intensidad',
    'filter.none': 'Sin filtro',
    'filter.print': 'Corrección de impresión',
    'filter.contrast': 'Contraste',
    'filter.vivid': 'Vívido',
    'filter.fade': 'Ahorro de tinta',
    'filter.grayscale': 'Blanco y negro',
    'filter.sepia': 'Sepia',
    'filter.invert': 'Negativo',
    'filter.printHint': 'aclara las sombras y los tonos medios porque el papel se ve más oscuro que la pantalla. La vista previa también se ve más clara, es normal: el archivo exportado lleva la misma corrección. Empezá con 50% y subí si todavía sale oscuro.',
    'filter.fadeHint': 'Aclara y desatura las imágenes para gastar menos tinta.',
    'filter.note': 'El filtro se aplica solo a las imágenes, no al fondo, el borde ni el texto.',

    'background.title': 'Fondo del área de imágenes',
    'background.label': 'Fondo',
    'background.white': 'Blanco',
    'background.black': 'Negro',
    'background.gray': 'Gris',
    'line.title': 'Borde del área',
    'line.label': 'Borde',
    'line.NONE': 'Ninguno',
    'line.LINE': 'Línea',
    'line.DASH': 'Punteado',
    'text.title': 'Texto en el margen superior',
    'text.showPaper': 'Mostrar tamaño de hoja',
    'text.legend': 'Leyenda',
    'text.optional': 'Opcional',

    'number.decrease': 'Disminuir',
    'number.increase': 'Aumentar',
  },

  en: {
    'app.title': 'Mosaics',
    'lang.label': 'Language',
    'loading': 'Loading…',

    'top.addImages': 'Add images',
    'top.export': 'Export',
    'top.generating': 'Generating…',

    'export.png': 'PNG image',
    'export.pdf': 'PDF',
    'export.pdfHint': 'Ready to print or send',
    'export.print': 'Print',
    'export.printHint': 'Opens the print dialog',
    'export.share': 'Share',
    'export.shareHint': 'Send to another app',
    'export.shareTitle': 'Mosaic',
    'export.pngDone': 'Image downloaded.',
    'export.pdfDone': 'PDF downloaded.',
    'export.error': 'Could not generate the file. Try a smaller paper (Paper → Custom).',

    'info.v': 'portrait',
    'info.h': 'landscape',
    'info.piece': 'piece',
    'info.pieces': 'pieces',
    'info.toggleUnit': 'Tap to see in {unit}',
    'info.pieceTitle': 'Size of each piece. Tap to see in {unit}',
    'info.preview': 'Preview of the sheet',

    'zoom.label': 'Zoom',
    'zoom.out': 'Zoom out',
    'zoom.in': 'Zoom in',
    'zoom.fit': 'Fit',
    'zoom.fitTitle': 'Fit to screen',

    'empty.title': 'Start with your images',
    'empty.touch': 'Pick the images from your device.',
    'empty.desktop': 'Drag them here, paste them with Ctrl+V or pick them from your computer.',
    'empty.choose': 'Choose images',
    'drop.hint': 'Drop the images to add them',

    'sheet.hide': 'Hide options',
    'sheet.show': 'Show options',
    'tabs.label': 'Options',
    'tab.paper': 'Paper',
    'tab.layout': 'Layout',
    'tab.images': 'Images',
    'tab.style': 'Style',

    'paper.title': 'Paper size',
    'paper.A4': 'A4',
    'paper.A3': 'A3',
    'paper.CUSTOM': 'Custom',
    'orientation.title': 'Orientation',
    'orientation.v': 'Portrait',
    'orientation.h': 'Landscape',
    'custom.title': 'Custom size',
    'custom.hint': 'Keeps the proportion of the chosen paper. With the paper in portrait, a smaller one is generated faster.',
    'custom.ratio': 'Proportion',
    'ratio.A4': 'Like A4',
    'ratio.A3': 'Like A3',
    'custom.width': 'Width',
    'custom.height': 'Height',

    'layout.title': 'Layout',
    'layout.perRow': 'Images per row',
    'layout.gap': 'Space between images',
    'margins.title': 'Margins',
    'margins.top': 'Top',
    'margins.bottom': 'Bottom',
    'margins.left': 'Left',
    'margins.right': 'Right',
    'margins.labelHint': 'The text uses the top margin. Increase it in the Layout tab to see it better.',

    'images.one': 'image',
    'images.many': 'images',
    'images.add': 'Add',
    'images.removeAll': 'Remove all',
    'images.empty': 'No images yet. Add some to build the sheet.',
    'images.hintFixed': 'places that many copies first.',
    'images.hintRest': 'shares the remaining space between the images marked that way.',
    'images.remove': 'Remove {name}',
    'images.repeat': 'Repeat',
    'images.confirmClear': 'Remove all images?',
    'images.pickError': 'Choose image files.',
    'images.failed': '{n} file(s) could not be opened.',
    'images.addedOne': 'Image added.',
    'images.addedMany': '{n} images added.',
    'repeat.rest': 'Rest',
    'repeat.fixed': 'Amount',

    'filter.title': 'Image filter',
    'filter.amount': 'Intensity',
    'filter.none': 'No filter',
    'filter.print': 'Print correction',
    'filter.contrast': 'Contrast',
    'filter.vivid': 'Vivid',
    'filter.fade': 'Ink saver',
    'filter.grayscale': 'Black & white',
    'filter.sepia': 'Sepia',
    'filter.invert': 'Negative',
    'filter.printHint': 'brightens the shadows and midtones because paper looks darker than a screen. The preview also looks lighter, which is normal: the exported file gets the same correction. Start at 50% and raise it if it still prints dark.',
    'filter.fadeHint': 'Lightens and desaturates the images to use less ink.',
    'filter.note': 'The filter only applies to the images, not to the background, the border or the text.',

    'background.title': 'Image area background',
    'background.label': 'Background',
    'background.white': 'White',
    'background.black': 'Black',
    'background.gray': 'Gray',
    'line.title': 'Area border',
    'line.label': 'Border',
    'line.NONE': 'None',
    'line.LINE': 'Line',
    'line.DASH': 'Dashed',
    'text.title': 'Text in the top margin',
    'text.showPaper': 'Show paper size',
    'text.legend': 'Caption',
    'text.optional': 'Optional',

    'number.decrease': 'Decrease',
    'number.increase': 'Increase',
  },
};

function loadLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (LANGS.some(({ code }) => code === stored)) return stored;
  } catch (e) {
    // ignore privacy-mode errors
  }
  return DEFAULT_LANG;
}

export const i18n = reactive({ lang: loadLang() });

// Reads i18n.lang, so any render function or computed that calls it re-runs on a language change.
export function t(key, params) {
  const text = messages[i18n.lang]?.[key] ?? messages[DEFAULT_LANG][key] ?? key;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
}

function applyDocument() {
  document.documentElement.lang = i18n.lang;
  document.title = t('app.title');
}

export function setLang(code) {
  if (!LANGS.some(lang => lang.code === code)) return;
  i18n.lang = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
  applyDocument();
}

applyDocument();