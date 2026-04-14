const initCustomSize = { height: 400, width: 1000 };

var app = new Vue({
  el: '#app',
  data: {
    type: {
      CUSTOM: initCustomSize,
      A4: { height: 2480, width: 3508 },
      A3: { height: 4961, width: 3605 },
    },
    orientation: 'v',
    customHeight: initCustomSize.height,
    customWidth: initCustomSize.width,
    message: 'Seleccione un tipo de hoja y cargue una imagen para armar el mosaico.',
    ready: false,
    showBorder: true,
    internalSize: null,
    sizeName: 'A3',
    showHelp: false,
    amountHorizontal: 4,
    marginTop: 40,
    marginRight: 30,
    marginBottom: 0,
    marginLeft: 20,
    gap: 4,
  },
  created: function () {
    // this.size = this.type.CUSTOM;
    this.size = this.type.A4;
  },
  computed: {
    size: {
      get: function(){
        return this.internalSize
          ? this.orientation == 'h' ? { width: this.internalSize.width, height: this.internalSize.height }
            : this.orientation == 'v' ? { width: this.internalSize.height, height: this.internalSize.width }
              : null
          : null;
      },
      set: function(value) {
        this.internalSize = value;
      }
    },
    styleCanvas: function () {
      return {
        border: '2px dashed black'
      }
    }
  },
  methods: {
    changeType: function(){
      if( this.sizeName == 'CUSTOM' )
        this.internalSize = { height: this.customHeight, width: this.customWidth };
      else
        this.internalSize = this.type[this.sizeName];

      this.refresh();
    },
    clearCanvas: function () {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    clearAll: function () {
      this.clearCanvas();
      var input = document.getElementById('file');
      input.value = '';
    },
    refresh: function () {
      var fn = () => {
        this.ready = true;
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        // ctx.drawImage(img, 0, 0, canvas.width, img.height * (canvas.width / img.width));
        
        this.clearCanvas();

        // Create a temporary canvas for the limited horizontal repeat
        const patternCanvas = document.createElement('canvas');
        const patternCtx = patternCanvas.getContext('2d');
        const marginTop = +this.marginTop;
        const marginRight = +this.marginRight;
        const marginLeft = +this.marginLeft;
        const gap = +this.gap;
        const amountHorizontal = +this.amountHorizontal;
        patternCanvas.width = (canvas.width - marginLeft - marginRight - gap * amountHorizontal) / amountHorizontal;
        patternCanvas.height = img.height * (patternCanvas.width / img.width);
        patternCtx.drawImage(img, 0, 0, patternCanvas.width, patternCanvas.height);

        for (let i = 0; i < amountHorizontal; i++) {
          const offsetLeft = marginLeft + patternCanvas.width * i + (i > 0 ? gap * i : 0);
          ctx.drawImage(patternCanvas, offsetLeft, marginTop);
        }
      }

      var img = this.imageSizeHeight && this.imageSizeWidth
        ? new Image( this.imageSizeWidth, this.imageSizeHeight ) : new Image();
      setTimeout(() => {
        var input = document.getElementById('file');
        var file = input.files[0];
        if (file) {
          this.ready = true;
          var reader  = new FileReader();

          reader.onloadend = () => {
            img.src = reader.result;
            setTimeout(() => {
              fn();
            }, 0);
          }

          reader.readAsDataURL(file);
        } else {
          fn();
        }
      }, 0);

    },
    saveCanvas: function() {
      var canvas = document.getElementById('canvas');
    },
    swapOrientation() {
      this.orientation = this.orientation=='h' ? 'v': 'h';
      this.refresh();
    }
  }
});

// configure menu
{
  const buttonEl = document.getElementById('button-sizes');
  const menuEl = document.getElementById('menu-sizes');

  const menu = new mdc.menu.MDCMenu(menuEl);
  
  buttonEl.addEventListener('click', (event) => {
    menu.open = !menu.open;
    menu.setAnchorCorner(mdc.menu.Corner.BOTTOM_LEFT);
    menu.setAnchorElement(buttonEl);
  });
}