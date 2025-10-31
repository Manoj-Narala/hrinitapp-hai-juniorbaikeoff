<template>
  <div class="w-screen max-w-[100vw] -mx-[calc((100vw-100%)/2)] px-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900">Approval Dashboard</h2>
      <div class="flex space-x-2 p-1 bg-gray-200 rounded-lg">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          @click="currentFilter = filterOption.value"
          :class="[
            'px-4 py-1 rounded-md text-sm font-medium',
            currentFilter === filterOption.value 
              ? 'bg-white shadow' 
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ filterOption.label }}
        </button>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-xl overflow-hidden w-full">
      <LoadingSpinner v-if="isLoading" />
      <div v-else>
        <div v-if="filteredInitiatives.length === 0" class="text-center py-16 px-4">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707m12.728 0l.707-.707M12 21v-1m0-8c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No initiatives in this filter</h3>
          <p class="text-gray-500">Try choosing another status filter above.</p>
        </div>
        <table v-else class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200">Idea</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-20">BV Score</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-24">Value</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-28">Type</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-40">Status</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-32">Submitted By</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-28">Submitted</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-32">{{ currentFilter === 'rejected' ? 'Rejected By' : 'Approved By' }}</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-28">{{ currentFilter === 'rejected' ? 'Rejected On' : 'Approved On' }}</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 w-24">ADO Item</th>
              <th class="text-center px-2 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide w-16">Review</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="initiative in filteredInitiatives"
              :key="initiative.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="$emit('select-initiative', initiative)"
            >
              <td class="px-4 py-4 align-top border-t border-gray-200 border-r">
                <h3 class="text-sm font-semibold text-blue-700 truncate mb-1">
                  {{ initiative.idea.title || initiative.idea.businessObjective }}
                </h3>
                <p class="text-xs text-gray-600 line-clamp-2 mb-1">
                  {{ initiative.idea.ideaDescription }}
                </p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-20">
                <p :class="['text-lg font-bold', getBusinessValueInfo(initiative.aiAnalysis.businessValueScore).color]">
                  {{ initiative.aiAnalysis.businessValueScore }}
                </p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-24">
                <p :class="['text-xs font-semibold', getBusinessValueInfo(initiative.aiAnalysis.businessValueScore).color]">
                  {{ getBusinessValueInfo(initiative.aiAnalysis.businessValueScore).range }}
                </p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-28">
                <span v-if="initiative.aiAnalysis.costSaving === true" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Cost Saving
                </span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Value Gen.
                </span>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-40">
                <span :class="getStatusBadgeClass(initiative.status)">
                  {{ getStatusLabel(initiative.status) }}
                </span>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-32">
                <p class="text-xs font-medium text-gray-800 truncate" :title="initiative.submittedBy">
                  {{ initiative.submittedBy }}
                </p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-28">
                <p class="text-xs font-medium text-gray-800">
                  {{ formatDate(initiative.submittedAt) }}
                </p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-32">
                <p class="text-xs font-medium text-gray-800 truncate" :title="(currentFilter === 'rejected' ? initiative.rejectedBy : initiative.approvedBy) || '-'">
                  {{ (currentFilter === 'rejected' ? initiative.rejectedBy : initiative.approvedBy) || '-' }}
                </p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-28">
                <p v-if="currentFilter === 'rejected' ? initiative.rejectedAt : initiative.approvedAt" :class="['text-xs font-medium', currentFilter === 'rejected' ? 'text-red-700' : 'text-green-700']">
                  {{ formatDate(currentFilter === 'rejected' ? initiative.rejectedAt : initiative.approvedAt) }}
                </p>
                <p v-else class="text-xs text-gray-400">-</p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 border-r w-24">
                <p v-if="initiative.adoWorkItemId" class="text-xs font-semibold text-blue-600">
                  #{{ initiative.adoWorkItemId }}
                </p>
                <p v-else class="text-xs text-gray-400">-</p>
              </td>
              <td class="px-2 py-4 text-center border-t border-gray-200 w-16" @click.stop="$emit('select-initiative', initiative)">
                <svg
                  class="h-5 w-5 mx-auto text-blue-500 cursor-pointer hover:text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  title="Review initiative"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </td>
            </tr>
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
  name: 'ApprovalDashboard',
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
  },
  emits: ['select-initiative'],
  setup(props) {
    const currentFilter = ref('pending_approval');

    const filterOptions = [
      { label: 'Pending PO Review', value: 'pending_approval' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
      { label: 'All', value: 'all' },
    ];

    const filteredInitiatives = computed(() => {
      if (currentFilter.value === 'all') {
        return props.initiatives;
      }
      return props.initiatives.filter(init => init.status === currentFilter.value);
    });

    const getStatusBadgeClass = (status) => {
      const classes = 'px-3 py-1 rounded-full text-xs font-medium ';
      switch (status) {
        case 'pending_approval':
          return classes + 'bg-yellow-100 text-yellow-800';
        case 'approved':
          return classes + 'bg-green-100 text-green-800';
        case 'rejected':
          return classes + 'bg-red-100 text-red-800';
        default:
          return classes + 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusLabel = (status) => {
      const labels = {
        'pending_approval': 'Pending PO Review',
        'approved': 'Approved',
        'rejected': 'Rejected',
      };
      return labels[status] || 'Unknown';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };

    return {
      currentFilter,
      filterOptions,
      filteredInitiatives,
      getBusinessValueInfo,
      getStatusBadgeClass,
      getStatusLabel,
      formatDate,
    };
  },
};
</script>
