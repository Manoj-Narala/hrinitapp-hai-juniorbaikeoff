<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <!-- Login Page -->
    <LoginForm v-if="!isAuthenticated" @login-success="handleLoginSuccess" />

    <!-- Authenticated App -->
    <template v-else>
      <!-- Header -->
      <AppHeader 
        :current-page="currentPage" 
        :user="currentUser"
        @change-page="handlePageChange"
        @logout="handleLogout"
      />

      <!-- Success Message -->
      <div v-if="successMessage" class="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <MessageBox 
          :message="successMessage" 
          type="success" 
          @close="successMessage = null" 
        />
      </div>

      <!-- Main Content -->
      <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner v-if="isInitializing" message="Initializing Application..." />
        
        <!-- Landing Page (Home) -->
        <LandingPage
          v-else-if="currentPage === 'home'"
          :user="currentUser"
          :initiatives="initiatives"
          @navigate="handlePageChange"
        />
        
        <IdeaForm 
          v-else-if="currentPage === 'form'" 
          :initial-data="currentIdea"
          @submit="handleGenerateAnalysis" 
        />

        <AIReview 
          v-else-if="currentPage === 'review'" 
          :idea="currentIdea"
          :ai-result="aiResult"
          :user="currentUser"
          @confirm="handleConfirmSubmission"
          @edit="handleEditIdea"
        />

        <!-- My Ideas (for regular users) -->
        <MyIdeas
          v-else-if="currentPage === 'my-ideas'"
          :initiatives="initiatives"
          :is-loading="isLoadingInitiatives"
          :current-user="currentUser"
          @select-idea="handleSelectInitiative"
          @submit-new-idea="handlePageChange('form')"
          @edit-idea="handleEditExistingIdea"
        />

        <!-- Approval Dashboard (for POs) -->
        <ApprovalDashboard 
          v-else-if="currentPage === 'dashboard'" 
          :initiatives="initiatives"
          :is-loading="isLoadingInitiatives"
          :current-user="currentUser"
          @select-initiative="handleSelectInitiative"
        />
      </main>

      <!-- Initiative Detail Modal -->
      <InitiativeDetailModal
        v-if="selectedInitiative"
        :initiative="selectedInitiative"
        :current-user="currentUser"
        @approve="handleApprove"
        @reject="handleReject"
        @update-bv-score="handleUpdateBVScore"
        @close="selectedInitiative = null"
      />
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from './api';
import AppHeader from './components/AppHeader.vue';
import LandingPage from './components/LandingPage.vue';
import IdeaForm from './components/IdeaForm.vue';
import AIReview from './components/AIReview.vue';
import ApprovalDashboard from './components/ApprovalDashboard.vue';
import MyIdeas from './components/MyIdeas.vue';
import InitiativeDetailModal from './components/InitiativeDetailModal.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import MessageBox from './components/MessageBox.vue';
import LoginForm from './components/LoginForm.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    LandingPage,
    IdeaForm,
    AIReview,
    ApprovalDashboard,
    MyIdeas,
    InitiativeDetailModal,
    LoadingSpinner,
    MessageBox,
    LoginForm,
  },
  setup() {
    const currentPage = ref('home');
    const isAuthenticated = ref(false);
    const currentUser = ref(null);
    const currentIdea = ref(null);
    const aiResult = ref(null);
    const initiatives = ref([]);
    const selectedInitiative = ref(null);
    const isInitializing = ref(true);
    const isLoadingInitiatives = ref(false);
    const successMessage = ref(null);

    // Initialize app
    onMounted(async () => {
      try {
        // Check if user is already logged in
        const token = localStorage.getItem('auth_token');
        const userInfo = localStorage.getItem('user_info');

        if (token && userInfo) {
          currentUser.value = JSON.parse(userInfo);
          isAuthenticated.value = true;

          // Verify token is still valid
          try {
            await api.getCurrentUser();
          } catch (error) {
            // Token invalid, clear and show login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            isAuthenticated.value = false;
            currentUser.value = null;
          }
        }
        
        // Check API health
        try {
          await api.healthCheck();
        } catch (healthError) {
          console.error('Backend health check failed:', healthError);
          if (isAuthenticated.value) {
            successMessage.value = 'Warning: Backend server is not running. Please start it with: cd backend && npm run dev';
          }
        }
        
        // Load initiatives if authenticated
        if (isAuthenticated.value) {
          await loadInitiatives();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        isInitializing.value = false;
      }
    });

    // Handle login success
    const handleLoginSuccess = async (user) => {
      currentUser.value = user;
      isAuthenticated.value = true;
      successMessage.value = `Welcome, ${user.name}!`;
      
      // Always land on the universal landing page after login
      currentPage.value = 'home';
      
      // Load initiatives
      await loadInitiatives();
    };

    // Handle logout
    const handleLogout = async () => {
      try {
        await api.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        isAuthenticated.value = false;
        currentUser.value = null;
        currentPage.value = 'form';
        initiatives.value = [];
      }
    };

    // Load initiatives from API
    const loadInitiatives = async () => {
      isLoadingInitiatives.value = true;
      try {
        const response = await api.getInitiatives();
        // Ensure we got an array
        if (Array.isArray(response.data)) {
          initiatives.value = response.data;
        } else {
          console.error('Invalid response format:', response.data);
          initiatives.value = [];
          successMessage.value = 'Error: Backend server may not be running. Please start the backend server.';
        }
      } catch (error) {
        console.error('Error loading initiatives:', error);
        initiatives.value = [];
        successMessage.value = 'Error: Cannot connect to backend server. Please ensure backend is running on port 3000.';
      } finally {
        isLoadingInitiatives.value = false;
      }
    };

    // Handle page changes
    const handlePageChange = (page) => {
      currentPage.value = page;
      if (page === 'dashboard' || page === 'my-ideas') {
        loadInitiatives();
      }
    };

    // Generate AI analysis
    const handleGenerateAnalysis = async (idea) => {
      currentIdea.value = idea;
      try {
        const response = await api.generateAnalysis(idea);
        aiResult.value = response.data;
        currentPage.value = 'review';
      } catch (error) {
        console.error('Error generating analysis:', error);
        throw error;
      }
    };

    // Confirm and submit initiative
    const handleConfirmSubmission = async () => {
      try {
        // Check if we're updating an existing initiative
        if (currentIdea.value?.initiativeId) {
          // Update existing initiative
          await api.updateInitiative(currentIdea.value.initiativeId, {
            idea: {
              ideaDescription: currentIdea.value.ideaDescription,
              businessObjective: currentIdea.value.businessObjective,
              businessValue: currentIdea.value.businessValue,
              monetaryValue: currentIdea.value.monetaryValue
            },
            aiAnalysis: aiResult.value,
          });
          
          successMessage.value = 'Your idea has been successfully updated!';
        } else {
          // Create new initiative
          await api.createInitiative({
            idea: currentIdea.value,
            aiAnalysis: aiResult.value,
            submittedBy: currentUser.value?.username || 'unknown',
          });
          
          successMessage.value = 'Your idea has been successfully submitted for approval!';
        }
        
        // Go to appropriate page based on role
        if (currentUser.value?.role === 'PO') {
          currentPage.value = 'dashboard';
        } else {
          currentPage.value = 'my-ideas';
        }
        
        currentIdea.value = null;
        aiResult.value = null;
        
        // Reload initiatives
        await loadInitiatives();
      } catch (error) {
        console.error('Error submitting initiative:', error);
        throw error;
      }
    };

    // Edit idea (go back to form)
    const handleEditIdea = () => {
      currentPage.value = 'form';
    };

    // Edit existing idea (from My Ideas page)
    const handleEditExistingIdea = async (initiative) => {
      try {
        // Load the idea data into the form
        currentIdea.value = initiative.idea;
        aiResult.value = initiative.aiAnalysis;
        
        // Store the initiative ID and original status for updating later
        currentIdea.value.initiativeId = initiative.id;
        currentIdea.value.originalStatus = initiative.status;
        
        // Go to review page so user can edit and regenerate
        currentPage.value = 'review';
      } catch (error) {
        console.error('Error loading idea for edit:', error);
      }
    };

    // Select initiative for viewing
    const handleSelectInitiative = (initiative) => {
      selectedInitiative.value = initiative;
    };

    // Approve initiative (with optional reason)
    const handleApprove = async (id, reason) => {
      try {
        const payload = { status: 'approved' };
        if (reason) {
          payload.approvalReason = reason;
        }
        const response = await api.updateInitiative(id, payload);
        successMessage.value = `Initiative approved! ADO Work Item #${response.data.adoWorkItemId} created.`;
        selectedInitiative.value = null;
        await loadInitiatives();
      } catch (error) {
        console.error('Error approving initiative:', error);
        throw error;
      }
    };

    // Reject initiative
    const handleReject = async (id, reason) => {
      try {
        await api.updateInitiative(id, { 
          status: 'rejected',
          rejectionReason: reason 
        });
        selectedInitiative.value = null;
        await loadInitiatives();
      } catch (error) {
        console.error('Error rejecting initiative:', error);
        throw error;
      }
    };

    // Update Business Value Score (PO only)
    const handleUpdateBVScore = async (id, newScore) => {
      try {
        await api.updateInitiative(id, { 
          'aiAnalysis.businessValueScore': newScore,
          businessValueOverriddenBy: currentUser.value?.username
        });
        successMessage.value = `Business Value Score updated to ${newScore}/10`;
        // Refresh the selected initiative
        await loadInitiatives();
        const updated = initiatives.value.find(i => i.id === id);
        if (updated) {
          selectedInitiative.value = updated;
        }
      } catch (error) {
        console.error('Error updating BV score:', error);
        throw error;
      }
    };

    return {
      currentPage,
      isAuthenticated,
      currentUser,
      currentIdea,
      aiResult,
      initiatives,
      selectedInitiative,
      isInitializing,
      isLoadingInitiatives,
      successMessage,
      handleLoginSuccess,
      handleLogout,
      handlePageChange,
      handleGenerateAnalysis,
      handleConfirmSubmission,
      handleEditIdea,
      handleEditExistingIdea,
      handleSelectInitiative,
      handleApprove,
      handleReject,
      handleUpdateBVScore,
    };
  },
};
</script>
