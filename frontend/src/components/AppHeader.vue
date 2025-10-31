<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0 flex items-center cursor-pointer" @click="$emit('change-page', 'home')">
          <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707m12.728 0l.707-.707M12 21v-1m0-8c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2z" />
          </svg>
          <span class="font-bold text-xl ml-2 text-gray-800">HR Approval App for Initiative (HAI)</span>
        </div>
          
          <!-- User Info & Logout -->
          <div v-if="user" class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{ user.name.charAt(0) }}</span>
                </div>
              </div>
              <div class="text-sm">
                <p class="font-medium text-gray-700">{{ user.name }}</p>
                <p class="text-xs text-gray-500">
                  <span :class="user.role === 'PO' ? 'text-indigo-600 font-semibold' : 'text-gray-500'">
                    {{ user.role === 'PO' ? 'Product Owner' : 'User' }}
                  </span>
                </p>
              </div>
            </div>
            <button
              @click="$emit('logout')"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    currentPage: String,
    user: Object,
  },
  emits: ['change-page', 'logout'],
};
</script>
