<template>
  <div class="w-screen max-w-[100vw] -mx-[calc((100vw-100%)/2)] px-6">
    <!-- Header with Submit Button -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">My Submitted Ideas</h2>
        <p class="text-gray-600 mt-1">Track the status of your initiative submissions</p>
      </div>
      <button
        @click="$emit('submit-new-idea')"
        class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-xl"
      >
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Submit New Idea
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6">
      <div class="flex space-x-2 p-1 bg-gray-200 rounded-lg">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          @click="currentFilter = filterOption.value"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            currentFilter === filterOption.value 
              ? 'bg-white shadow-md text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ filterOption.label }}
          <span 
            v-if="getFilterCount(filterOption.value) > 0"
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
              currentFilter === filterOption.value
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-300 text-gray-700'
            ]"
          >
            {{ getFilterCount(filterOption.value) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Ideas Table -->
    <div class="bg-white rounded-lg shadow-xl overflow-hidden">
      <LoadingSpinner v-if="isLoading" />
      <div v-else>
        <!-- Empty State -->
        <div v-if="filteredIdeas.length === 0" class="text-center py-16 px-4">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707m12.728 0l.707-.707M12 21v-1m0-8c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ currentFilter === 'all' ? 'No ideas submitted yet' : `No ${currentFilter.replace('_', ' ')} ideas` }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ currentFilter === 'all' ? 'Start by submitting your first initiative idea!' : 'Try changing the filter to see other ideas.' }}
          </p>
          <button
            v-if="currentFilter === 'all'"
            @click="$emit('submit-new-idea')"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Submit Your First Idea
          </button>
        </div>
        <table v-else class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200">Idea</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-20">BV Score</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-24">Value</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-28">Type</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-32">Status</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-32">Submitted By</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-28">Submitted</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-32">{{ currentFilter === 'rejected' ? 'Rejected By' : 'Approved By' }}</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-28">{{ currentFilter === 'rejected' ? 'Rejected On' : 'Approved On' }}</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-24">ADO Item</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="idea in filteredIdeas" :key="idea.id">
              <tr class="hover:bg-gray-50 cursor-pointer" @click="$emit('select-idea', idea)">
                <td class="px-4 py-4 align-top border-t border-gray-200 border-r">
                  <h3 class="text-sm font-semibold text-blue-700 truncate mb-1">
                    {{ idea.idea.title || idea.idea.businessObjective }}
                  </h3>
                  <p class="text-xs text-gray-600 line-clamp-2 mb-1">
                    {{ idea.idea.ideaDescription }}
                  </p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-20">
                  <p :class="['text-lg font-bold', getBusinessValueInfo(idea.aiAnalysis.businessValueScore).color]">
                    {{ idea.aiAnalysis.businessValueScore }}
                  </p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-24">
                  <p :class="['text-xs font-semibold', getBusinessValueInfo(idea.aiAnalysis.businessValueScore).color]">
                    {{ getBusinessValueInfo(idea.aiAnalysis.businessValueScore).range }}
                  </p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-28">
                  <span v-if="idea.aiAnalysis.costSaving === true" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Cost Saving
                  </span>
                  <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Value Gen.
                  </span>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-32">
                  <span :class="getStatusBadgeClass(idea.status)">
                    {{ getStatusLabel(idea.status) }}
                  </span>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-32">
                  <p class="text-xs font-medium text-gray-800 truncate" :title="idea.submittedBy">
                    {{ idea.submittedBy }}
                  </p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-28">
                  <p class="text-xs font-medium text-gray-800">
                    {{ formatDate(idea.submittedAt) }}
                  </p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-32">
                  <p class="text-xs font-medium text-gray-800 truncate" :title="(currentFilter === 'rejected' ? idea.rejectedBy : idea.approvedBy) || '-'">
                    {{ (currentFilter === 'rejected' ? idea.rejectedBy : idea.approvedBy) || '-' }}
                  </p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-28">
                  <p v-if="currentFilter === 'rejected' ? idea.rejectedAt : idea.approvedAt" :class="['text-xs font-medium', currentFilter === 'rejected' ? 'text-red-700' : 'text-green-700']">
                    {{ formatDate(currentFilter === 'rejected' ? idea.rejectedAt : idea.approvedAt) }}
                  </p>
                  <p v-else class="text-xs text-gray-400">-</p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-24">
                  <p v-if="idea.adoWorkItemId" class="text-xs font-semibold text-blue-600">
                    #{{ idea.adoWorkItemId }}
                  </p>
                  <p v-else class="text-xs text-gray-400">-</p>
                </td>
                <td class="px-2 py-4 text-center border-t border-gray-200 w-20" @click.stop>
                  <div class="flex items-center justify-center">
                    <button
                      v-if="idea.status === 'pending_approval' || (idea.status === 'rejected' && currentFilter === 'rejected')"
                      @click.stop="$emit('edit-idea', idea)"
                      :class="[
                        'inline-flex items-center justify-center h-8 w-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all',
                        idea.status === 'rejected' 
                          ? 'border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 focus:ring-orange-500' 
                          : 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500'
                      ]"
                      :title="idea.status === 'rejected' ? 'Edit & resubmit this idea' : 'Edit this idea'"
                      aria-label="Edit idea"
                    >
                      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Rejection Reason Row -->
              <tr v-if="idea.rejectionReason && currentFilter === 'rejected'" class="bg-red-50">
                <td colspan="11" class="px-6 py-3 text-sm border-t border-red-100">
                  <div class="flex items-start">
                    <svg class="h-5 w-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <span class="font-medium text-red-900">Reason for rejection:</span>
                      <p class="text-red-800 mt-1">{{ idea.rejectionReason }}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <!-- Approval Rationale Row -->
              <tr v-if="idea.approvalReason && currentFilter === 'approved'" class="bg-green-50">
                <td colspan="11" class="px-6 py-3 text-sm border-t border-green-100">
                  <div class="flex items-start">
                    <svg class="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span class="font-medium text-green-900">Approval rationale:</span>
                      <p class="text-green-800 mt-1">{{ idea.approvalReason }}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';
import { getBusinessValueInfo } from '../utils';

export default {
  name: 'MyIdeas',
  components: { LoadingSpinner },
  props: {
    initiatives: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
  emits: ['select-idea', 'submit-new-idea', 'edit-idea'],
  setup(props) {
    const currentFilter = ref('all');

    const filterOptions = [
      { label: 'All Ideas', value: 'all' },
      { label: 'Pending PO Review', value: 'pending_approval' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
    ];

    // Filter to show only current user's ideas
    const myIdeas = computed(() => {
      return props.initiatives.filter(
        init => init.submittedBy === props.currentUser.username
      );
    });

    const filteredIdeas = computed(() => {
      if (currentFilter.value === 'all') {
        return myIdeas.value;
      }
      return myIdeas.value.filter(idea => idea.status === currentFilter.value);
    });

    const getFilterCount = (filterValue) => {
      if (filterValue === 'all') {
        return myIdeas.value.length;
      }
      return myIdeas.value.filter(idea => idea.status === filterValue).length;
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        pending_approval: 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
        approved: 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
        rejected: 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800',
      };
      return classes[status] || 'px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
      const labels = {
        pending_approval: 'Pending PO Review',
        approved: 'Approved',
        rejected: 'Rejected',
      };
      return labels[status] || status;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    };

    return {
      currentFilter,
      filterOptions,
      filteredIdeas,
      getFilterCount,
      getStatusBadgeClass,
      getStatusLabel,
      formatDate,
      getBusinessValueInfo,
    };
  },
};
</script>
