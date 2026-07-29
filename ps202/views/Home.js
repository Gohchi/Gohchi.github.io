import template from 'templates/Home.js';
import TextInput from 'components/TextInput.js';

export default {
  components: {
    TextInput,
  },
  data() {
    return {
      files: [],
      images: [],
      selectedFile: null,
      fileContent: '',
      directoryName: '',
      status: 'Select a directory containing gamelist.xml and images.',
      games: [],
      previewUrls: {},
      filterMode: 'matched',
      xmlRootTagName: 'gameList',
      showImageModal: false,
    };
  },
  methods: {
    handleDirectoryInput(event) {
      const items = Array.from(event.target.files || []);
      this.files = items;
      this.selectedFile = null;
      this.images = [];
      this.fileContent = '';
      this.directoryName = '';
      this.games = [];
      this.status = 'Select a directory containing gamelist.xml and images.';

      Object.values(this.previewUrls).forEach((url) => URL.revokeObjectURL(url));
      this.previewUrls = {};

      items.forEach((file) => {
        if (!this.selectedFile && file.name.toLowerCase().endsWith('.xml')) {
          this.selectedFile = file;
        }
        if (file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)) {
          this.images.push(file);
        }
        if (!this.directoryName && file.webkitRelativePath) {
          const parts = file.webkitRelativePath.split('/');
          parts.pop();
          this.directoryName = parts.join('/') || file.name;
        }
      });

      this.images.forEach((file) => {
        const key = file.name;
        const url = URL.createObjectURL(file);
        this.previewUrls[key] = url;
        if (file.name !== key) {
          this.previewUrls[file.name] = url;
        }
      });

      if (!this.selectedFile) {
        this.status = 'No gamelist.xml files found in the selected directory.';
      } else {
        this.status = `XML file found.`;
        this.readXmlFile();
      }
    },
    // xml2json(xml) {
    //   try {
    //     var obj = {};
    //     if (xml.children.length > 0) {
    //       for (var i = 0; i < xml.children.length; i++) {
    //         var item = xml.children.item(i);
    //         var nodeName = item.nodeName;

    //         if (typeof (obj[nodeName]) == "undefined") {
    //           obj[nodeName] = this.xml2json(item);
    //         } else {
    //           if (typeof (obj[nodeName].push) == "undefined") {
    //             var old = obj[nodeName];

    //             obj[nodeName] = [];
    //             obj[nodeName].push(old);
    //           }
    //           obj[nodeName].push(this.xml2json(item));
    //         }
    //       }
    //     } else {
    //       obj = xml.textContent;
    //     }
    //     return obj;
    //   } catch (e) {
    //       console.log(e.message);
    //   }
    // },
    // async xmlBlobToObject(blob) {
    //   try {
    //     const xmlString = await blob.text();
    //     const parser = new DOMParser();
    //     const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        
    //     if (xmlDoc.querySelector("parsererror")) {
    //       throw new Error("Invalid XML structure");
    //     }
        
    //     return xmlDoc; // This is your XML object
    //   } catch (err) {
    //     console.error(err);
    //   }
    // },
    async readXmlFile() {
      // const test = await this.xmlBlobToObject(file);
      // this.games
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result;
        this.parseXmlGames(reader.result);
      };
      reader.readAsText(this.selectedFile);
    },
    parseXmlGames(xmlText) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'application/xml');
      this.xmlRootTagName = doc.documentElement?.nodeName || 'gameList';
      const gameNodes = Array.from(doc.querySelectorAll('game'));
      this.games = gameNodes.map((node) => {
        const getValue = key => node.querySelector(key)?.textContent?.trim() || '';
        const gameid = getValue('gameid');
        const path = getValue('path');
        const image = getValue('image');
        const video_id = getValue('video_id');
        const class_type = getValue('class_type');
        const game_type = getValue('game_type');
        const timer = getValue('timer');
        const zh_CN = getValue('zh_CN');
        const en_US = getValue('en_US');
        const zh_TW = getValue('zh_TW');
        const ko_KR = getValue('ko_KR');
        const name = getValue('name');
        const match = this.files.some(file => './' + file.name === path);
        const imagePreviewUrl = this.previewUrls[image] || this.previewUrls[image.split('/').pop()] || '';
        return {
          gameid,
          path,
          image,
          video_id,
          class_type,
          game_type,
          timer,
          zh_CN,
          en_US,
          zh_TW,
          ko_KR,
          name,
          match,
          imagePreviewUrl
        };
      });
    },
    addMissingFilesToGames() {
      if (!this.selectedFile) {
        return;
      }

      const missingFiles = (this.missingFiles || []).filter((file) => {
        const relativePath = file.webkitRelativePath || file.name;
        return !this.games.some((game) => game.path.includes(relativePath) || game.path.includes(file.name));
      });

      if (!missingFiles.length) {
        this.status = 'No missing files to add.';
        return;
      }

      const newGames = missingFiles.map(file => {
        return {
          gameid: '',
          path: `./${file.name}`,
          image: '',
          video_id: '',
          class_type: '',
          game_type: '',
          timer: '',
          zh_CN: '',
          en_US: '',
          zh_TW: '',
          ko_KR: '',
          name: file.name.replace(/\.[^/.]+$/, ''),
          match: true,
          imagePreviewUrl: '',
        };
      });

      this.games = [...this.games, ...newGames];
      this.updateSelectedFileFromGames();
      this.status = `Added ${newGames.length} missing file(s) to the games list.`;
    },
    saveFile() {
      if (!this.selectedFile) {
        return;
      }
      const blob = new Blob([this.fileContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.selectedFile.name;
      a.click();
      URL.revokeObjectURL(url);
      this.status = `Downloaded edited ${this.selectedFile.name}.`;
    },
    updateSelectedFileFromGames() {
      if (!this.selectedFile) {
        return;
      }
      const xmlString = this.buildGamelistXml();
      this.fileContent = xmlString;
      this.selectedFile = new File([xmlString], this.selectedFile.name, {
        type: 'application/xml',
        lastModified: Date.now(),
      });
    },
    buildGamelistXml() {
      const rootName = this.xmlRootTagName || 'gameList';
      const fields = [
        'gameid',
        'path',
        'image',
        'video_id',
        'class_type',
        'game_type',
        'timer',
        'zh_CN',
        'en_US',
        'zh_TW',
        'ko_KR',
        'name',
      ];
      const escapeXml = (value) => {
        return String(value || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/,/g, '&comma;')
          .replace(/'/g, '&apos;');
      };
      const lines = ['<?xml version="1.0" encoding="utf-8"?>', `<${rootName}>`];
      this.games.forEach((game) => {
        lines.push('  <game>');
        fields.forEach((field) => {
          lines.push(`    <${field}>${escapeXml(game[field])}</${field}>`);
        });
        lines.push('  </game>');
      });
      lines.push(`</${rootName}>`);
      return lines.join('\n');
    },
    changeImage(game) {
      this.editingGame = game;
      this.showImageModal = true;
    },
    updateImage(blobUrl, key) {
      this.editingGame.image = './image/' + key;
      this.editingGame.imagePreviewUrl = blobUrl;
      this.closeImageModal();
    },
    closeImageModal() {
      this.showImageModal = false;
      this.editingGame = null;
    }
  },
  watch: {
    games: {
      handler() {
        this.updateSelectedFileFromGames();
      },
      deep: true,
    },
  },
  computed: {
    missingFiles() {
      if (this.selectedFile) {
        return this.files.filter(file =>
          !file.type.startsWith('image/')
          && !file.type.includes('xml')
          && !Object.values(this.games).some(game => game.path.includes(file.name))
        );
      }
    }
  },
  template,
};