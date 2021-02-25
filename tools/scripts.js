const initCustomSize = { height: 400, width: 1000 };

var app = new Vue({
  el: '#app',
  data: {
    type: {
      CUSTOM: initCustomSize,
      A4: { height: 2480, width: 3508 },
      A3: { height: 4961, width: 3605 },
    },
    orientation: 'h',
    customHeight: initCustomSize.height,
    customWidth: initCustomSize.width,
    message: 'Seleccione un tipo de hoja y cargue una imagen para armar el mosaico.',
    ready: false,
    showBorder: true,
    internalSize: null,
    sizeName: 'CUSTOM',
    showHelp: false
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
    clear: function () {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.size.width, this.size.height);
    },
    refresh: function () {
      var fn = () => {
        this.ready = true;
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        var pattern = ctx.createPattern(img, 'repeat');
        if( pattern ) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, this.size.width, this.size.height);
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