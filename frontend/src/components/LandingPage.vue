<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- Welcome Message -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome, {{ user?.name }}!
        </h1>
        <p class="text-xl text-gray-600">
          {{ user?.role === 'PO' 
            ? 'Manage and approve initiative submissions' 
            : 'Submit your innovative ideas and track their progress' 
          }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Submit New Idea Button -->
        <button
          @click="$emit('navigate', 'form')"
          class="group relative bg-white hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 p-12 border-2 border-gray-200"
        >
          <div class="flex flex-col items-center space-y-6">
            <div class="transition-transform group-hover:scale-110">
              <img 
                src="../assets/submit-idea.png" 
                alt="Submit Idea" 
                class="h-48 w-auto"
              />
            </div>
            <div>
              <h2 class="text-3xl font-bold mb-2 text-gray-800">Submit New Idea</h2>
              <p class="text-gray-600">
                Share your innovative initiative and let AI help you build a proposal
              </p>
            </div>
            <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </button>

        <!-- View Dashboard Button -->
        <button
          v-if="user?.role === 'PO'"
          @click="$emit('navigate', 'dashboard')"
          class="group relative bg-white hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 p-12 border-2 border-gray-200"
        >
          <div class="flex flex-col items-center space-y-6">
            <div class="transition-transform group-hover:scale-110">
              <img 
                src="../assets/view-ideas.png" 
                alt="View Ideas" 
                class="h-48 w-auto"
              />
            </div>
            <div>
              <h2 class="text-3xl font-bold mb-2 text-gray-800">Approval Dashboard</h2>
              <p class="text-gray-600">
                Review and approve submitted initiatives from your team
              </p>
            </div>
            <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </button>

        <!-- My Ideas Button (for regular users) -->
        <button
          v-else
          @click="$emit('navigate', 'my-ideas')"
          class="group relative bg-white hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 p-12 border-2 border-gray-200"
        >
          <div class="flex flex-col items-center space-y-6">
            <div class="transition-transform group-hover:scale-110">
              <img 
                src="../assets/view-ideas.png" 
                alt="View Ideas" 
                class="h-48 w-auto"
              />
            </div>
            <div>
              <h2 class="text-3xl font-bold mb-2 text-gray-800">My Submitted Ideas</h2>
              <p class="text-gray-600">
                Track the status and progress of your initiative submissions
              </p>
            </div>
            <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <!-- Quick Stats for Regular Users -->
      <div v-if="user?.role !== 'PO'" class="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-gray-900">{{ userStats.total }}</div>
          <div class="text-sm text-gray-600 mt-1">My Ideas</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-yellow-600">{{ userStats.pending }}</div>
          <div class="text-sm text-gray-600 mt-1">Pending PO Review</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ userStats.approved }}</div>
          <div class="text-sm text-gray-600 mt-1">Approved</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-red-600">{{ userStats.rejected }}</div>
          <div class="text-sm text-gray-600 mt-1">Rejected</div>
        </div>
      </div>

      <!-- Global Stats for PO Users -->
      <div v-else class="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-gray-900">{{ poStats.total }}</div>
          <div class="text-sm text-gray-600 mt-1">Total Ideas</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-yellow-600">{{ poStats.pending }}</div>
          <div class="text-sm text-gray-600 mt-1">Pending PO Review</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ poStats.approved }}</div>
          <div class="text-sm text-gray-600 mt-1">Approved</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-red-600">{{ poStats.rejected }}</div>
          <div class="text-sm text-gray-600 mt-1">Rejected</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-indigo-600">{{ poStats.costSaving }}</div>
          <div class="text-sm text-gray-600 mt-1">Cost Saving</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'LandingPage',
  props: {
    user: {
      type: Object,
      required: true,
    },
    initiatives: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['navigate'],
  setup(props) {
    const userStats = computed(() => {
      const mine = props.initiatives.filter(i => i.submittedBy === props.user?.username);
      return {
        total: mine.length,
        pending: mine.filter(i => i.status === 'pending_approval').length,
        approved: mine.filter(i => i.status === 'approved').length,
        rejected: mine.filter(i => i.status === 'rejected').length,
      };
    });

    const poStats = computed(() => {
      if (props.user?.role !== 'PO') return null;
      const all = props.initiatives;
      return {
        total: all.length,
        pending: all.filter(i => i.status === 'pending_approval').length,
        approved: all.filter(i => i.status === 'approved').length,
        rejected: all.filter(i => i.status === 'rejected').length,
        costSaving: all.filter(i => i.aiAnalysis?.costSaving === true).length,
      };
    });

    return {
      userStats,
      poStats,
    };
  },
};
</script>
