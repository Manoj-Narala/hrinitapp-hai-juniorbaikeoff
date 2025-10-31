<template>
  <div 
    :class="['p-4 rounded-lg my-4 relative', typeClasses]" 
    role="alert"
  >
    <span class="block sm:inline">{{ message }}</span>
    <button
      v-if="showClose"
      @click="$emit('close')"
      class="absolute top-0 bottom-0 right-0 px-4 py-3"
    >
      <span class="font-bold text-xl">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'error'].includes(value),
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  computed: {
    typeClasses() {
      const classes = {
        info: 'bg-blue-100 border border-blue-400 text-blue-700',
        success: 'bg-green-100 border border-green-400 text-green-700',
        error: 'bg-red-100 border border-red-400 text-red-700',
      };
      return classes[this.type];
    },
  },
};
</script>
