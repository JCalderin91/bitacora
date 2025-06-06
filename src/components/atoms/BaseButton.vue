<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'rounded-md font-medium transition-colors',
      {
        'bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400': variant === 'primary',
        'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-500': variant === 'danger',
        'opacity-50 cursor-not-allowed': disabled || loading,
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg'
      }
    ]"
  >
    <slot>{{ loading ? 'Cargando...' : 'Botón' }}</slot>
  </button>
</template>