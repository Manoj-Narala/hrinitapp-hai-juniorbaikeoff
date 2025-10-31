<template>
  <div class="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
        <h3 class="text-xl font-semibold text-gray-900">Review Initiative</h3>
        <button
          @click="$emit('close')"
          :disabled="isLoading"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-6">
        <MessageBox 
          v-if="error" 
          :message="error" 
          type="error" 
          @close="error = null" 
        />
      
  <h4 class="text-2xl font-bold text-blue-700">{{ initiative.idea.title || initiative.idea.businessObjective }}</h4>

        <!-- Business Value Scale Reference - Full Width for PO, Prominent Display -->
        <div v-if="isPO" class="mb-6">
          <BusinessValueScaleReference :expanded="true" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <!-- Left Column: AI Analysis - Takes 3 columns -->
          <div class="md:col-span-3 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Statement of Work (SoW)</label>
              <p class="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{{ initiative.aiAnalysis.statementOfWork }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Description of the Idea</label>
              <p class="text-gray-800 text-base leading-relaxed">{{ initiative.idea.ideaDescription }}</p>
            </div>
            <div v-if="initiative.idea.principalFeatures">
              <label class="block text-sm font-medium text-gray-500 mb-1">Principal Features</label>
              <p class="text-gray-800 text-sm whitespace-pre-line">{{ initiative.idea.principalFeatures }}</p>
            </div>
          </div>
          
          <!-- Right Column: Meta - Takes 2 columns -->
          <div class="md:col-span-2 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border-2 border-blue-200 shadow-lg">
            <!-- Compact BV Scale for non-PO users -->
            <div v-if="!isPO">
              <BusinessValueScaleReference :expanded="false" />
            </div>

            <div class="bg-white rounded-lg p-4 shadow-md border border-blue-200">
              <label class="block text-sm font-medium text-gray-500 mb-2">Business Value Score 
                <span v-if="initiative.businessValueOverriddenBy">(PO Edited)</span>
                <span v-else-if="initiative.aiAnalysis.userProvidedScore">(User Provided)</span>
                <span v-else>(AI Estimated)</span>
              </label>
              <div v-if="!isEditingBV" class="flex items-center justify-center mb-3">
                <p :class="['text-6xl font-bold', bvInfo.color]">
                  {{ initiative.aiAnalysis.businessValueScore }}
                </p>
                <span class="text-3xl text-gray-400 ml-1">/10</span>
              </div>
              
              <!-- Edit Mode for BV Score (PO Only) -->
              <div v-if="isPO && isEditingBV" class="mb-3">
                <input
                  type="number"
                  v-model.number="editedBVScore"
                  min="1"
                  max="10"
                  class="w-full px-4 py-3 text-center text-5xl font-bold border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <p :class="['text-xl font-semibold text-center mb-3', bvInfo.color]">{{ bvInfo.range }}</p>
              <div class="flex justify-center">
                <span :class="['inline-flex items-center px-4 py-2 rounded-full text-base font-medium shadow-md', bvInfo.bgColor, bvInfo.textColor]">
                  {{ bvInfo.text }}
                </span>
              </div>

              <!-- PO Edit Buttons -->
              <div v-if="isPO" class="flex gap-2 mt-4">
                <button
                  v-if="!isEditingBV"
                  @click="startEditBV"
                  class="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100"
                >
                  Edit Score
                </button>
                <template v-else>
                  <button
                    @click="saveBVScore"
                    :disabled="isLoading"
                    class="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelEditBV"
                    :disabled="isLoading"
                    class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </template>
              </div>

              <!-- Cost Saving / Value Generation Badge -->
              <div class="flex justify-center mt-4">
                <span v-if="initiative.aiAnalysis.costSaving === true" class="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-green-100 text-green-800 shadow-md border-2 border-green-300">
                  <svg class="-ml-1 mr-2 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  Cost Saving Initiative
                </span>
                <span v-else-if="initiative.aiAnalysis.costSaving === false" class="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-blue-100 text-blue-800 shadow-md border-2 border-blue-300">
                  <svg class="-ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Value Generation Initiative
                </span>
              </div>
            </div>

            <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <label class="block text-sm font-medium text-gray-500 mb-2">Value Justification (AI Analysis)</label>
              <p class="text-gray-800 text-sm leading-relaxed">{{ initiative.aiAnalysis.businessValueJustification }}</p>
            </div>
            
            <div class="pt-4 border-t-2 border-blue-200 space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Business Objective</label>
                <p class="text-gray-800 text-sm">{{ initiative.idea.businessObjective }}</p>
              </div>
              <div v-if="initiative.idea.personsAffected">
                <label class="block text-sm font-medium text-gray-500 mb-1">Persons Affected</label>
                <p class="text-gray-800 text-sm whitespace-pre-line">{{ initiative.idea.personsAffected }}</p>
              </div>
              <div v-if="initiative.idea.businessAreasAffected">
                <label class="block text-sm font-medium text-gray-500 mb-1">Business Areas Affected</label>
                <p class="text-gray-800 text-sm">{{ initiative.idea.businessAreasAffected }}</p>
              </div>
              <div v-if="initiative.idea.platformClientsImpacted && initiative.idea.platformClientsImpacted.length">
                <label class="block text-sm font-medium text-gray-500 mb-1">Total Platform Clients Impacted</label>
                <ul class="list-disc list-inside text-gray-800 text-sm space-y-0.5">
                  <li v-for="c in initiative.idea.platformClientsImpacted" :key="c">{{ c }}</li>
                </ul>
              </div>
              <div v-if="initiative.idea.businessValue">
                <label class="block text-sm font-medium text-gray-500 mb-1">Business Value (User Provided)</label>
                <p class="text-gray-800 text-sm">{{ initiative.idea.businessValue }}/10</p>
              </div>
              <div v-if="initiative.idea.monetaryValue">
                <label class="block text-sm font-medium text-gray-500 mb-1">Monetary Value</label>
                <p class="text-gray-800 text-sm">£{{ initiative.idea.monetaryValue }}K</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Submitted By</label>
                <p class="text-gray-800 text-xs break-words">{{ initiative.submittedBy }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rejection Form -->
        <div v-if="isRejecting" class="pt-4 border-t">
          <label for="rejectionReason" class="block text-sm font-medium text-gray-700 mb-1">
            Reason for Rejection (Required)
          </label>
          <textarea
            id="rejectionReason"
            v-model="rejectionReason"
            rows="3"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 px-3 py-2 border"
            placeholder="Provide a clear reason..."
          />
          <div class="flex justify-end gap-3 mt-3">
            <button
              @click="isRejecting = false"
              :disabled="isLoading"
              class="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleReject"
              :disabled="isLoading || !rejectionReason"
              class="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
            >
              {{ isLoading ? 'Rejecting...' : 'Confirm Rejection' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div 
        v-if="initiative.status === 'pending_approval' && !isRejecting" 
        class="p-5 border-t bg-gray-50 rounded-b-lg"
      >
        <div v-if="isPO" class="flex flex-col gap-4">
          <!-- Initial action buttons -->
          <div v-if="!isApproving" class="flex justify-end gap-4">
            <button
              @click="isRejecting = true"
              :disabled="isLoading"
              class="py-2 px-5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-red-600 bg-white hover:bg-gray-50"
            >
              Reject
            </button>
            <button
              @click="startApprove"
              :disabled="isLoading"
              class="py-2 px-5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              Approve
            </button>
          </div>
          <!-- Approval Reason Form -->
          <div v-else class="bg-white border border-green-300 rounded-lg p-4 shadow-inner">
            <label for="approvalReason" class="block text-sm font-medium text-gray-700 mb-1">Approval Reason (Required)</label>
            <textarea
              id="approvalReason"
              v-model="approvalReason"
              rows="3"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2 border text-sm"
              placeholder="Provide a clear rationale explaining why this initiative is being approved..."
            />
            <div class="flex justify-end gap-3 mt-3">
              <button
                @click="cancelApprove"
                :disabled="isLoading"
                class="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="confirmApprove"
                :disabled="isLoading || !approvalReason.trim()"
                class="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                {{ isLoading ? 'Approving...' : 'Confirm Approval' }}
              </button>
            </div>
            <p v-if="!approvalReason.trim()" class="text-xs text-red-600 mt-2">Approval reason is required.</p>
          </div>
        </div>
        <!-- Show message for non-PO users -->
        <div v-else class="flex items-center text-gray-600">
          <svg class="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Only Product Owners can approve or reject initiatives.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import MessageBox from './MessageBox.vue';
import BusinessValueScaleReference from './BusinessValueScaleReference.vue';
import { getBusinessValueInfo } from '../utils';

export default {
  name: 'InitiativeDetailModal',
  components: { MessageBox, BusinessValueScaleReference },
  props: {
    initiative: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
  emits: ['approve', 'reject', 'close', 'update-bv-score'],
  setup(props, { emit }) {
    const rejectionReason = ref('');
  const approvalReason = ref('');
  const isApproving = ref(false);
    const isRejecting = ref(false);
    const isLoading = ref(false);
    const error = ref(null);

    // BV Score editing
    const isEditingBV = ref(false);
    const editedBVScore = ref(props.initiative.aiAnalysis.businessValueScore);

    const bvInfo = getBusinessValueInfo(props.initiative.aiAnalysis.businessValueScore);
    const isPO = props.currentUser?.role === 'PO';

    const startEditBV = () => {
      editedBVScore.value = props.initiative.aiAnalysis.businessValueScore;
      isEditingBV.value = true;
    };

    const cancelEditBV = () => {
      isEditingBV.value = false;
      editedBVScore.value = props.initiative.aiAnalysis.businessValueScore;
    };

    const saveBVScore = async () => {
      if (editedBVScore.value < 1 || editedBVScore.value > 10) {
        error.value = 'Business Value Score must be between 1 and 10.';
        return;
      }

      error.value = null;
      isLoading.value = true;
      try {
        await emit('update-bv-score', props.initiative.id, editedBVScore.value);
        isEditingBV.value = false;
      } catch (err) {
        console.error('Failed to update BV score:', err);
        error.value = `Failed to update score. Please try again. ${err.message}`;
      } finally {
        isLoading.value = false;
      }
    };

    const handleApprove = async () => {
      error.value = null;
      isLoading.value = true;
      try {
        await emit('approve', props.initiative.id);
      } catch (err) {
        console.error('Failed to approve:', err);
        error.value = `Approval failed. Please try again. ${err.message}`;
        isLoading.value = false;
      }
    };

    const startApprove = () => {
      isApproving.value = true;
    };

    const cancelApprove = () => {
      isApproving.value = false;
      approvalReason.value = '';
    };

    const confirmApprove = async () => {
      if (!approvalReason.value.trim()) {
        error.value = 'Approval reason is required.';
        return;
      }
      error.value = null;
      isLoading.value = true;
      try {
        await emit('approve', props.initiative.id, approvalReason.value.trim());
      } catch (err) {
        console.error('Failed to approve:', err);
        error.value = `Approval failed. Please try again. ${err.message}`;
        isLoading.value = false;
      }
    };

    const handleReject = async () => {
      if (!rejectionReason.value) {
        error.value = 'Please provide a reason for rejection.';
        return;
      }
      error.value = null;
      isLoading.value = true;
      try {
        await emit('reject', props.initiative.id, rejectionReason.value);
      } catch (err) {
        console.error('Failed to reject:', err);
        error.value = `Rejection failed. Please try again. ${err.message}`;
        isLoading.value = false;
      }
    };

    return {
      rejectionReason,
      isRejecting,
      isLoading,
      error,
      bvInfo,
      isPO,
      isEditingBV,
      editedBVScore,
      startEditBV,
      cancelEditBV,
      saveBVScore,
      handleApprove,
  startApprove,
  cancelApprove,
  confirmApprove,
      handleReject,
  approvalReason,
  isApproving,
    };
  },
};
</script>
