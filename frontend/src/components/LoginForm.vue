<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <div>
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100">
          <svg class="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          HR Approval App for Initiative (HAI)
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to submit and manage initiatives
        </p>
      </div>

      <MessageBox v-if="error" type="error" :message="error" @close="error = null" />

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Sign in</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </div>

        <!-- Demo credentials info -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <p class="text-xs text-gray-600 text-center font-semibold mb-3">Demo Accounts:</p>
          <div class="space-y-2 text-xs">
            <div class="bg-indigo-50 border border-indigo-200 rounded p-3">
              <p class="font-semibold text-indigo-900 mb-1">Product Owner (PO)</p>
              <p class="text-gray-700"><strong>Username:</strong> po_admin</p>
              <p class="text-gray-700"><strong>Password:</strong> po123456</p>
              <p class="text-xs text-gray-600 mt-1">Can approve/reject initiatives</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
              <p class="font-semibold text-blue-900 mb-1">Regular User - John</p>
              <p class="text-gray-700"><strong>Username:</strong> john_user</p>
              <p class="text-gray-700"><strong>Password:</strong> user123456</p>
              <p class="text-xs text-gray-600 mt-1">Can submit ideas only</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded p-3">
              <p class="font-semibold text-green-900 mb-1">Regular User - Sarah</p>
              <p class="text-gray-700"><strong>Username:</strong> sarah_user</p>
              <p class="text-gray-700"><strong>Password:</strong> user456</p>
              <p class="text-xs text-gray-600 mt-1">Can submit ideas only</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import MessageBox from './MessageBox.vue';

export default {
  name: 'LoginForm',
  components: { MessageBox },
  emits: ['login-success'],
  setup(props, { emit }) {
    const username = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const error = ref(null);

    const handleLogin = async () => {
      error.value = null;
      isLoading.value = true;

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store token and user info
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.user));

        // Emit success event
        emit('login-success', data.user);
      } catch (err) {
        console.error('Login error:', err);
        error.value = err.message || 'Failed to sign in. Please check your credentials.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      password,
      isLoading,
      error,
      handleLogin,
    };
  },
};
</script>
