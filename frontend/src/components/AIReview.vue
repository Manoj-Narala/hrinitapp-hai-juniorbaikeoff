<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 mb-4 text-center">
      {{ idea.originalStatus === 'rejected' ? 'Resubmit Your Idea' : (idea.initiativeId ? 'Edit Your Idea' : 'AI Analysis Complete') }}
    </h2>
    <p class="text-center text-gray-600 mb-8">
      {{ idea.originalStatus === 'rejected' 
        ? 'Your idea was previously rejected. You can edit it and regenerate the AI analysis before resubmitting for approval.' 
        : (idea.initiativeId 
          ? 'You can edit your idea and regenerate the AI analysis before resubmitting.' 
          : 'Please review the AI-generated Statement of Work and Business Value before submitting for approval.')
      }}
    </p>

    <MessageBox 
      v-if="error" 
      :message="error" 
      type="error" 
      @close="error = null" 
    />

    <div class="bg-white rounded-lg shadow-xl overflow-hidden space-y-8 p-6 sm:p-8">
      <!-- AI Analysis Section -->
      <section>
        <h3 class="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">AI-Generated Proposal</h3>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Business Value Score (from AI)</label>
            <div class="flex items-start gap-8">
              <!-- Business Value Score -->
              <div>
                <p class="text-sm text-gray-600 mb-1">Business Value Score (from AI)</p>
                <p :class="['text-5xl font-bold', bvInfo.color]">
                  {{ aiResult.businessValueScore }}/10
                </p>
                <p :class="['text-base font-medium mt-1', bvInfo.color]">{{ bvInfo.range }}</p>
              </div>
              
              <!-- Monetary Value Display -->
              <div v-if="idea.monetaryValue">
                <p class="text-sm text-gray-600 mb-1">Estimated Monetary Value</p>
                <p class="text-5xl font-bold text-green-600">£{{ idea.monetaryValue }}K</p>
                <p class="text-base font-medium text-gray-600 mt-1">User Provided</p>
              </div>
            </div>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium', bvInfo.bgColor, bvInfo.textColor]">
                {{ bvInfo.text }}
              </span>
              
              <!-- User Provided or AI Generated Badge -->
              <span v-if="aiResult.userProvidedScore" class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <svg class="-ml-1 mr-1.5 h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                BV Score: User Provided
              </span>
              <span v-else class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <svg class="-ml-1 mr-1.5 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707m12.728 0l.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                BV Score: AI Generated
              </span>
            
              <!-- Cost Saving / Value Generation Badge -->
              <span v-if="aiResult.costSaving === true" class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg class="-ml-1 mr-1.5 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                Cost Saving
              </span>
              <span v-else-if="aiResult.costSaving === false" class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <svg class="-ml-1 mr-1.5 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Value Generation
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Value Justification (from AI)</label>
            <p class="text-gray-800 text-base leading-relaxed">{{ aiResult.businessValueJustification }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Statement of Work (SoW)</label>
            <p class="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{{ aiResult.statementOfWork }}</p>
          </div>
        </div>
      </section>

      <!-- Original Idea Section (Collapsible) -->
      <section>
        <details class="bg-gray-50 rounded-lg p-4">
          <summary class="text-lg font-medium text-gray-700 cursor-pointer">View Your Original Idea</summary>
          <div class="mt-4 space-y-4 pt-4 border-t">
            <div>
              <label class="block text-sm font-medium text-gray-500">Description of the Idea</label>
              <p class="text-gray-800">{{ idea.ideaDescription }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Business Objective</label>
              <p class="text-gray-800">{{ idea.businessObjective }}</p>
            </div>
            <div v-if="idea.businessValue">
              <label class="block text-sm font-medium text-gray-500">Business Value (User Provided)</label>
              <p class="text-gray-800">{{ idea.businessValue }}/10</p>
            </div>
            <div v-if="idea.monetaryValue">
              <label class="block text-sm font-medium text-gray-500">Monetary Value</label>
              <p class="text-gray-800">£{{ idea.monetaryValue }}K</p>
            </div>
          </div>
        </details>
      </section>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <button
          @click="$emit('edit')"
          :disabled="isLoading"
          class="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit My Idea
        </button>
        <button
          @click="handleSubmit"
          :disabled="isLoading"
          class="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading 
            ? (idea.initiativeId ? 'Updating...' : 'Submitting...') 
            : (idea.originalStatus === 'rejected' 
              ? 'Resubmit for Approval' 
              : (idea.initiativeId ? 'Save Idea' : 'Looks Good, Submit for Approval'))
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import MessageBox from './MessageBox.vue';
import { getBusinessValueInfo } from '../utils';

export default {
  name: 'AIReview',
  components: { MessageBox },
  props: {
    idea: {
      type: Object,
      required: true,
    },
    aiResult: {
      type: Object,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  emits: ['confirm', 'edit'],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const error = ref(null);

    const bvInfo = getBusinessValueInfo(props.aiResult.businessValueScore);

    const handleSubmit = async () => {
      error.value = null;
      isLoading.value = true;
      try {
        await emit('confirm');
      } catch (err) {
        console.error(err);
        error.value = `Failed to save your submission. Please try again. ${err.message}`;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      error,
      bvInfo,
      handleSubmit,
    };
  },
};
</script>
