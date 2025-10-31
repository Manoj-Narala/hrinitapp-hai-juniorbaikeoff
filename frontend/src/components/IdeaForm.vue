<template>
  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
    <div class="p-6 sm:p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">New Initiative</h2>
      <p class="text-gray-600 mb-6">Submit your idea for AI-powered analysis and review.</p>

      <MessageBox 
        v-if="error" 
        :message="error" 
        type="error" 
        @close="error = null" 
      />
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            v-model.trim="idea.title"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            placeholder="Concise initiative title (e.g., Automated Onboarding Portal)"
            required
          />
          <p class="text-xs text-gray-500 mt-1">Short, descriptive name used in listings & dashboards.</p>
          <p v-if="attemptedSubmit && !idea.title" class="text-xs text-red-600 mt-1">Title is required.</p>
        </div>
        <!-- Description of the Idea -->
        <div>
          <label for="ideaDescription" class="block text-sm font-medium text-gray-700 mb-1">
            Description of the Idea <span class="text-red-500">*</span>
          </label>
          <textarea
            id="ideaDescription"
            v-model="idea.ideaDescription"
            rows="4"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            placeholder="e.g., 'Create an automated onboarding portal that streamlines the new hire process and reduces manual HR tasks.'"
            required
          />
        </div>

        <!-- Principal Features -->
        <div>
          <label for="principalFeatures" class="block text-sm font-medium text-gray-700 mb-1">
            Principal Features <span class="text-gray-500 text-xs">(Optional)</span>
          </label>
          <textarea
            id="principalFeatures"
            v-model="idea.principalFeatures"
            rows="3"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            placeholder="List the key features or components (one per line or comma separated)"
          />
          <p class="text-xs text-gray-500 mt-1">Provide core feature bullets to enhance AI analysis quality.</p>
        </div>

        <!-- Business Objective -->
        <div>
          <label for="businessObjective" class="block text-sm font-medium text-gray-700 mb-1">
            Business Objective <span class="text-red-500">*</span>
          </label>
          <select
            id="businessObjective"
            v-model="idea.businessObjective"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            required
          >
            <option value="">-- Select Business Objective --</option>
            <option value="Audit & Compliance">Audit & Compliance</option>
            <option value="Capacity">Capacity</option>
            <option value="Customer Service">Customer Service</option>
            <option value="International">International</option>
            <option value="No Objective">No Objective</option>
            <option value="Profitability">Profitability</option>
            <option value="Total Platform">Total Platform</option>
          </select>
        </div>

        <!-- Total Platform Clients Impacted (Optional Multi-select via toggles) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Total Platform Clients Impacted <span class="text-gray-500 text-xs">(Toggle all that apply)</span></label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="client in platformClients" :key="client" class="flex items-center p-2 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                :id="'client-' + client"
                :value="client"
                v-model="idea.platformClientsImpacted"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label :for="'client-' + client" class="ml-2 text-sm text-gray-700">{{ client }}</label>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-1">If the initiative impacts multiple platform clients, toggle each relevant brand.</p>
        </div>

        <!-- Business Value (Optional) -->
        <div>
          <label for="businessValue" class="block text-sm font-medium text-gray-700 mb-1">
            Business Value (1-10) <span class="text-gray-500 text-xs">(Optional - AI will suggest if not provided)</span>
          </label>
          <input
            type="number"
            id="businessValue"
            v-model.number="idea.businessValue"
            min="1"
            max="10"
            step="1"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            placeholder="Rate business value from 1 (low) to 10 (high)"
          />
          <p class="text-xs text-gray-500 mt-1">Leave empty for AI to estimate based on your idea</p>
        </div>

        <!-- Monetary Value (Optional) -->
        <div>
          <label for="monetaryValue" class="block text-sm font-medium text-gray-700 mb-1">
            Estimated Monetary Value <span class="text-gray-500 text-xs">(Optional, in thousands £K)</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-gray-500">£</span>
            <input
              type="number"
              id="monetaryValue"
              v-model.number="idea.monetaryValue"
              min="0"
              step="1"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-8 pr-12 py-2 border"
              placeholder="e.g., 250 for £250K"
            />
            <span class="absolute right-3 top-2.5 text-gray-500">K</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Enter the estimated value in thousands (e.g., 500 = £500,000)</p>
        </div>

        <!-- Persons Affected (Optional) -->
        <div>
          <label for="personsAffected" class="block text-sm font-medium text-gray-700 mb-1">
            Persons Affected <span class="text-gray-500 text-xs">(Optional)</span>
          </label>
          <textarea
            id="personsAffected"
            v-model="idea.personsAffected"
            rows="2"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            placeholder="e.g., HR onboarding team, new hires (~1,200 annually)"
          />
          <p class="text-xs text-gray-500 mt-1">Describe key user groups or approximate number of people impacted.</p>
        </div>

        <!-- Business Areas Affected (Optional) -->
        <div>
          <label for="businessAreasAffected" class="block text-sm font-medium text-gray-700 mb-1">
            Business Areas Affected <span class="text-gray-500 text-xs">(Optional)</span>
          </label>
            <input
              id="businessAreasAffected"
              type="text"
              v-model.trim="idea.businessAreasAffected"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
              placeholder="e.g., HR, IT Support, Finance"
            />
          <p class="text-xs text-gray-500 mt-1">Comma-separated list of departments or business functions.</p>
        </div>
        
        <div class="pt-2">
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Analyzing Idea...' : 'Generate Analysis & SoW' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import MessageBox from './MessageBox.vue';

export default {
  name: 'IdeaForm',
  components: { MessageBox },
  props: {
    initialData: {
      type: Object,
      default: null,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const platformClients = [
      'Next',
      'Aubin and Wills',
      'GAP',
      'Laura Ashley',
      'Reiss',
      "Victoria's Secret",
      'JoJo Maman Bébé',
      'Lipsy',
      'Next Beauty',
      'Bath and Body',
      'Made',
      'Joules',
      'FatFace',
      'Cath Kidston'
    ];

    const idea = ref({
      title: '',
      ideaDescription: '',
      businessObjective: '',
      businessValue: null,
      monetaryValue: null,
      principalFeatures: '',
      personsAffected: '',
      businessAreasAffected: '',
      platformClientsImpacted: [],
    });

    const isLoading = ref(false);
    const error = ref(null);
  const attemptedSubmit = ref(false);

    // Watch for initialData changes
    watch(() => props.initialData, (newData) => {
      if (newData) {
        idea.value = { platformClientsImpacted: [], ...newData };
        if (!Array.isArray(idea.value.platformClientsImpacted)) {
          idea.value.platformClientsImpacted = [];
        }
      }
    }, { immediate: true });

    const isFormValid = computed(() => {
      return idea.value.title &&
        idea.value.ideaDescription && 
        idea.value.businessObjective;
    });

    const handleSubmit = async () => {
      error.value = null;
      attemptedSubmit.value = true;
      isLoading.value = true;
      try {
        await emit('submit', { ...idea.value });
      } catch (err) {
        console.error(err);
        error.value = `Failed to generate AI analysis. Please check your inputs or try again later. ${err.message}`;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      idea,
      platformClients,
      isLoading,
      error,
      isFormValid,
      handleSubmit,
      attemptedSubmit,
    };
  },
};
</script>
