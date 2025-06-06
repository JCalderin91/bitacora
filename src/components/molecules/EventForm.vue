<script setup>
import { ref } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { getCurrentDate, getCurrentTime } from '../../utils/dateFormatters'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const content = ref('')
const showCustomDate = ref(false)
const customDate = ref(getCurrentDate())
const customTime = ref(getCurrentTime())

const handleSubmit = () => {
  if (!content.value.trim()) return

  emit('submit', {
    content: content.value,
    date: showCustomDate.value ? `${customDate.value}T${customTime.value}` : new Date().toISOString()
  })

  content.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <BaseInput
        v-model="content"
        placeholder="¿Qué sucedió?"
        @enter="handleSubmit"
      />
      <BaseButton
        :loading="loading"
        :disabled="!content.trim()"
        @click="handleSubmit"
      >
        {{ loading ? 'Guardando...' : 'Guardar' }}
      </BaseButton>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="showCustomDate = !showCustomDate"
        class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
      >
        <svg
          class="h-4 w-4"
          :class="{ 'rotate-90': showCustomDate }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
        Personalizar fecha y hora
      </button>
    </div>

    <div v-if="showCustomDate" class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="custom-date" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Fecha
        </label>
        <BaseInput
          id="custom-date"
          v-model="customDate"
          type="date"
        />
      </div>
      <div class="flex-1">
        <label for="custom-time" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Hora
        </label>
        <BaseInput
          id="custom-time"
          v-model="customTime"
          type="time"
        />
      </div>
    </div>
  </div>
</template>