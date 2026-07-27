export default {
  data() {
    return {
      files: [],
      xmlFiles: [],
      images: [],
      selectedFile: null,
      selectedImage: null,
      fileContent: '',
      directoryName: '',
      status: 'Select a directory containing gamelist.xml and images.',
      games: [],
      previewUrls: {},
    };
  },
  methods: {
    handleDirectoryInput(event) {
      const items = Array.from(event.target.files || []);
      this.files = items;
      this.xmlFiles = [];
      this.images = [];
      this.selectedFile = null;
      this.selectedImage = null;
      this.fileContent = '';
      this.directoryName = '';

      items.forEach((file) => {
        if (file.name.toLowerCase().endsWith('.xml')) {
          this.xmlFiles.push(file);
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

      if (!this.xmlFiles.length) {
        this.status = 'No gamelist.xml files found in the selected directory.';
      } else {
        this.status = `${this.xmlFiles.length} XML file(s) found. Select one to view or edit.`;
      }
    },
    selectXmlFile(file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result;
      };
      reader.readAsText(file);
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
    selectImage(file) {
      this.selectedImage = file;
    },
  },
  template: /*html*/`
    <template v-if="true">
      <div class="min-h-screen bg-zinc-950 text-zinc-100">
        <main id="main" class="max-w-7xl mx-auto px-6 py-8">
          <section class="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <h1 class="text-2xl font-semibold text-white mb-4">Gamelist Editor</h1>
            <p class="text-sm text-zinc-400 mb-4">Select a directory and review matching XML files and image assets.</p>
            <label class="block mb-4">
              <span class="text-zinc-200">Directory</span>
              <input
                type="file"
                webkitdirectory
                directory
                multiple
                @change="handleDirectoryInput"
                class="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
              />
            </label>
            <div class="space-y-2 text-zinc-300">
              <div>Selected directory: <span class="font-medium text-white">{{ directoryName || 'none' }}</span></div>
              <div>Status: <span class="font-medium text-white">{{ status }}</span></div>
            </div>
          </section>

          <div class="grid gap-6 lg:grid-cols-2">
            <section class="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
              <h2 class="text-xl font-semibold text-white mb-4">XML Files</h2>
              <div class="space-y-3">
                <button
                  v-for="file in xmlFiles"
                  :key="file.name + file.lastModified"
                  @click="selectXmlFile(file)"
                  class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-left text-zinc-100 transition hover:border-zinc-500"
                >
                  <div class="font-medium">{{ file.name }}</div>
                  <div class="text-sm text-zinc-400">{{ file.webkitRelativePath || file.name }}</div>
                </button>
                <div v-if="!xmlFiles.length" class="rounded-xl border border-dashed border-zinc-700 p-4 text-zinc-500">
                  No XML files found. Use the directory input above.
                </div>
              </div>
            </section>

            <section class="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
              <h2 class="text-xl font-semibold text-white mb-4">Image Files</h2>
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  v-for="file in images"
                  :key="file.name + file.lastModified"
                  @click="selectImage(file)"
                  class="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-left text-zinc-100 transition hover:border-zinc-500"
                >
                  <div class="font-medium">{{ file.name }}</div>
                  <div class="text-sm text-zinc-400">{{ file.webkitRelativePath || file.name }}</div>
                </button>
              </div>
              <div v-if="!images.length" class="rounded-xl border border-dashed border-zinc-700 p-4 text-zinc-500">
                No image files found in the selected directory.
              </div>
            </section>
          </div>

          <section class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-white mb-4">Editor</h2>
            <div v-if="selectedFile" class="space-y-4">
              <div class="text-zinc-300">Editing: <span class="font-medium text-white">{{ selectedFile.name }}</span></div>
              <textarea
                v-model="fileContent"
                rows="16"
                class="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-100 outline-none focus:border-indigo-500"
              ></textarea>
              <button
                @click="saveFile"
                class="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Download Edited XML
              </button>
            </div>
            <div v-else class="rounded-xl border border-dashed border-zinc-700 p-6 text-zinc-500">
              Select an XML file from the list to view and edit its contents.
            </div>
          </section>

          <section class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-white mb-4">Preview</h2>
            <div v-if="selectedImage" class="space-y-4">
              <div class="text-zinc-300">Selected image: <span class="font-medium text-white">{{ selectedImage.name }}</span></div>
              <img :src="URL.createObjectURL(selectedImage)" alt="Selected preview" class="max-h-96 rounded-3xl border border-zinc-700 object-contain" />
            </div>
            <div v-else class="rounded-xl border border-dashed border-zinc-700 p-6 text-zinc-500">
              Select an image from the list to preview it here.
            </div>
          </section>
        </main>
      </div>
    </template>
  `,
};