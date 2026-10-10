export default /*html*/`
  <template v-if="true">
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <main id="main" class="mx-auto px-6 py-8">
        <section class="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
          <h1 class="text-2xl font-semibold text-white mb-4">Gamelist editor</h1>
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

        <!-- Image selection modal -->
        <div v-if="showImageModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/60" @click="closeImageModal"></div>
          <div class="relative z-10 max-h-[80vh] w-11/12 overflow-auto rounded-2xl bg-zinc-900 p-6">
            <div class="sticky top-0 z-40 flex items-center justify-between mb-4 min-h-10 px-10 rounded-2xl bg-zinc-900">
              <h3 class="text-lg font-semibold text-white">Select an image</h3>
              <button @click="closeImageModal" class="cursor-pointer text-zinc-300 hover:text-white">Close</button>
            </div>
            <div v-if="images?.length" class="grid gap-3 sm:grid-cols-4">
              <div
                v-for="(value, key) in previewUrls"
                :key="key"
                class="cursor-pointer rounded-xl border border-zinc-700 p-3 text-left text-zinc-100 transition hover:border-zinc-500 bg-zinc-800"
                @click="updateImage(value, key)"
              >
                <img :src="value" alt="image" class="h-32 w-full object-contain mb-2" />
                <div class="text-sm text-zinc-300 break-all">{{ key }}</div>
              </div>
            </div>
            <div v-else class="rounded-xl border border-dashed border-zinc-700 p-4 text-zinc-500">
              No images found in directory.
            </div>
          </div>
        </div>
        
        <section v-if="selectedFile" class="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
          <div class="flex flex-wrap items-center gap-6">
            <label class="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-zinc-500">
              <input
                type="radio"
                value="all"
                v-model="filterMode"
                class="h-4 w-4 text-indigo-500"
              />
              All games ({{ games.length }})
            </label>
            <label class="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-zinc-500">
              <input
                type="radio"
                value="matched"
                v-model="filterMode"
                class="h-4 w-4 text-indigo-500"
              />
              Matched games ({{ games.filter(game => game.match).length }})
            </label>
            <label>
            Actions:
            </label>
            <button
              @click="games.sort((a,b) => (a.en_US || '').localeCompare(b.en_US || ''))"
              class="cursor-pointer ml-2 inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm font-semibold text-white transition hover:border-zinc-500"
            >
              Sort by name ↑ (en_US)
            </button>
            <button
              @click="games = games.filter(game => game.match)"
              class="cursor-pointer ml-2 inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm font-semibold text-white transition hover:border-zinc-500"
            >
              Keep only matched games
            </button>
          </div>
        </section>

        <section v-if="selectedFile" class="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
          <h2 class="text-xl font-semibold text-white mb-4">Games in {{ selectedFile.webkitRelativePath }}</h2>
          <div class="grid gap-3 sm:grid-cols-3">
            <div
              v-for="game in games.filter(game => filterMode === 'all' || game.match)"
              :key="game.path"
              class="rounded-xl border border-zinc-700 p-4 text-left text-zinc-100 transition hover:border-zinc-500"
              :class="game.match ? 'bg-zinc-950' : 'bg-zinc-700'"
            >
              <div v-if="!game.match">
                Game not found.
              </div>
              <div class="flex gap-2">
                <div class="mb-4">
                  <TextInput
                    :game="game"
                    prop="gameid"
                    small
                  />
                  <TextInput
                    :game="game"
                    prop="video_id"
                    small
                  />
                  <TextInput
                    :game="game"
                    prop="class_type"
                    small
                  />
                  <TextInput
                    :game="game"
                    prop="game_type"
                    small
                  />
                  <TextInput
                    :game="game"
                    prop="timer"
                    small
                  />
                </div>
                <img
                  :src="game.imagePreviewUrl"
                  alt="preview"
                  class="max-h-80 max-w-110 w-full border border-zinc-700 object-contain"
                  @click="changeImage(game)"
                />
              </div>
              <TextInput
                :game="game"
                prop="path"
              />
              <TextInput
                :game="game"
                prop="image"
                button
                @changeImage="changeImage"
              />
              <TextInput
                :game="game"
                prop="en_US"
              />
              <TextInput
                :game="game"
                prop="zh_CN"
              />
              <TextInput
                :game="game"
                prop="zh_TW"
              />
              <TextInput
                :game="game"
                prop="ko_KR"
              />
              <TextInput
                :game="game"
                prop="name"
              />
            </div>
          </div>
          <div v-if="!games.filter(game => filterMode === 'all' || game.match).length" class="rounded-xl border border-dashed border-zinc-700 p-4 text-zinc-500">
            No games files found for the selected filter.
          </div>
        </section>

        <section v-if="selectedFile" class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
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
              class="cursor-pointer inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Save Changes
            </button>
          </div>
          <div v-else class="rounded-xl border border-dashed border-zinc-700 p-6 text-zinc-500">
            Select an XML file from the list to view and edit its contents.
          </div>
        </section>

        <!-- New section: games in directory not present in the XML file -->
        <section v-if="missingFiles?.length" class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
          <h2 class="text-xl font-semibold text-white mb-4">Files in directory not listed in XML</h2>
          
          <button
            @click="addMissingFilesToGames()"
            class="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-zinc-500 mb-1"
          >
            Add missing files to XML
          </button>
          <div class="grid gap-3 sm:grid-cols-4">
            <div
              v-for="file in missingFiles"
              :key="file"
              class="cursor-pointer rounded-xl border border-zinc-700 p-4 text-left text-zinc-100 transition hover:border-zinc-500 bg-zinc-800"
              @click="addMissingFilesToGames(file)"
              title="add"
            >
              <div class="mb-2 font-medium text-white">{{ file.name }}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
`;