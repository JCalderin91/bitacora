<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  autofocus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'enter'])

const input = ref(null)

const focus = () => {
  input.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <input
    ref="input"
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :autofocus="autofocus"
    class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:placeholder-gray-400 text-sm sm:text-base"
    @input="$emit('update:modelValue', $event.target.value)"
    @keyup.enter="$emit('enter')"
  />
</template>