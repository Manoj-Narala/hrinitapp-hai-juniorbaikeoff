<template>
  <div :class="[
    'border-2 rounded-lg p-4',
    expanded ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'
  ]">
    <h5 :class="[
      'font-bold mb-4 text-center',
      expanded ? 'text-base text-blue-900' : 'text-sm text-gray-800'
    ]">
      Business Value Scale Reference
    </h5>
    
    <!-- Value Range Headers -->
    <div class="flex w-full rounded-t-lg overflow-hidden shadow-sm">
      <div class="w-[20%] bg-orange-500 p-3 text-white text-xs font-bold text-center">
        <div class="mb-1">Legal/Compliance</div>
        <div class="text-xs opacity-90">Critical Priority</div>
      </div>
      <div class="w-[20%] bg-blue-700 p-3 text-white text-xs font-bold text-center">
        <div class="mb-1">&gt; £1m</div>
        <div class="text-xs opacity-90">Very High Value</div>
      </div>
      <div class="w-[20%] bg-blue-500 p-3 text-white text-xs font-bold text-center">
        <div class="mb-1">£500k - £1m</div>
        <div class="text-xs opacity-90">High Value</div>
      </div>
      <div class="w-[20%] bg-gray-600 p-3 text-white text-xs font-bold text-center">
        <div class="mb-1">£250k - £500k</div>
        <div class="text-xs opacity-90">Medium Value</div>
      </div>
      <div class="w-[20%] bg-gray-400 p-3 text-white text-xs font-bold text-center">
        <div class="mb-1">&lt; £250k</div>
        <div class="text-xs opacity-90">Lower Value</div>
      </div>
    </div>

    <!-- Score Numbers -->
    <div class="flex w-full items-center bg-white border-x border-gray-300">
      <!-- 10-9 -->
      <div class="w-[20%] p-2 border-r border-gray-200">
        <div class="flex justify-center space-x-2">
          <div class="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">10</div>
          <div class="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">9</div>
        </div>
      </div>
      <!-- 8-7 -->
      <div class="w-[20%] p-2 border-r border-gray-200">
        <div class="flex justify-center space-x-2">
          <div class="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">8</div>
          <div class="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">7</div>
        </div>
      </div>
      <!-- 6-5 -->
      <div class="w-[20%] p-2 border-r border-gray-200">
        <div class="flex justify-center space-x-2">
          <div class="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">6</div>
          <div class="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">5</div>
        </div>
      </div>
      <!-- 4-3 -->
      <div class="w-[20%] p-2 border-r border-gray-200">
        <div class="flex justify-center space-x-2">
          <div class="bg-gray-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">4</div>
          <div class="bg-gray-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">3</div>
        </div>
      </div>
      <!-- 2-1 -->
      <div class="w-[20%] p-2">
        <div class="flex justify-center space-x-2">
          <div class="bg-gray-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">2</div>
          <div class="bg-gray-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow">1</div>
        </div>
      </div>
    </div>

    <!-- Descriptions -->
    <div :class="[
      'flex w-full rounded-b-lg overflow-hidden text-center leading-tight shadow-sm',
      expanded ? 'text-sm min-h-[100px]' : 'text-xs min-h-[60px]'
    ]">
      <div class="w-[20%] bg-orange-100 text-orange-900 p-3 border-2 border-orange-300 flex flex-col items-center justify-center">
        <span class="font-bold block mb-1">Critical Priority</span>
        <span class="text-xs">Must be done for legal/compliance requirements</span>
      </div>
      <div class="w-[20%] bg-blue-100 text-blue-900 p-3 border-2 border-blue-300 flex flex-col items-center justify-center">
        <span class="font-bold block mb-1">Very High Value</span>
        <span class="text-xs">Offers significant value with high ROI potential</span>
      </div>
      <div class="w-[20%] bg-blue-100 text-blue-900 p-3 border-2 border-blue-200 flex flex-col items-center justify-center">
        <span class="font-bold block mb-1">High Value</span>
        <span class="text-xs">Brings substantial value to the organization</span>
      </div>
      <div class="w-[20%] bg-gray-200 text-gray-900 p-3 border-2 border-gray-400 flex flex-col items-center justify-center">
        <span class="font-bold block mb-1">Medium Value</span>
        <span class="text-xs">Moderate value, benefits may vary</span>
      </div>
      <div class="w-[20%] bg-gray-200 text-gray-800 p-3 border-2 border-gray-300 flex flex-col items-center justify-center">
        <span class="font-bold block mb-1">Lower Value</span>
        <span class="text-xs">Minor improvements or functional changes</span>
      </div>
    </div>

    <!-- Additional Context for Expanded View -->
    <div v-if="expanded" class="mt-4 pt-4 border-t-2 border-blue-200">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
        <h6 class="font-semibold text-sm text-blue-900 mb-3">Scoring Guidelines:</h6>
        <div class="space-y-2 text-xs text-gray-700">
          <div class="flex items-start">
            <span class="inline-block w-12 font-bold text-orange-700 flex-shrink-0">10-9:</span>
            <span>Legal compliance, regulatory requirements, or critical business mandates</span>
          </div>
          <div class="flex items-start">
            <span class="inline-block w-12 font-bold text-blue-700 flex-shrink-0">8-7:</span>
            <span>Major revenue generation (&gt;£1m), significant cost savings, or strategic priorities</span>
          </div>
          <div class="flex items-start">
            <span class="inline-block w-12 font-bold text-blue-600 flex-shrink-0">6-5:</span>
            <span>Notable value delivery (£500k-£1m), clear benefits to multiple teams</span>
          </div>
          <div class="flex items-start">
            <span class="inline-block w-12 font-bold text-gray-700 flex-shrink-0">4-3:</span>
            <span>Moderate improvements (£250k-£500k), benefits to specific teams</span>
          </div>
          <div class="flex items-start">
            <span class="inline-block w-12 font-bold text-gray-600 flex-shrink-0">2-1:</span>
            <span>Minor enhancements (&lt;£250k), nice-to-have improvements</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessValueScaleReference',
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
