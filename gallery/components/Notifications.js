export default {
  template: /*html*/`
    <!-- Notification Container (Place at bottom-right of screen) -->
    <div class="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div class="p-4 w-full">
        <div class="flex items-start">
          <!-- Icon / Status Indicator -->
          <div class="flex-shrink-0">
            <svg v-if="!error" class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <!-- Content Section -->
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ message }}
            </p>
          </div>
          
          <!-- Close Button -->
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click.stop="close"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    notification: {
      type: Object,
      default: () => ({
        title: 'Notification',
        message: 'Ups...',
        isError: false
      })
    }
  },
  setup(props, { emit }) {
    return {
      close: () => emit('close'),
    }
  },
  computed: {
    title() {
      return this.notification.title;
    },
    message() {
      return this.notification.message;
    },
    error() {
      return this.notification.error;
    }
  },
}