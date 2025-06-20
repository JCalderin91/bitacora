<script setup>
import { ref, nextTick } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { formatDate } from '../../utils/dateFormatters'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

const isEditing = ref(false)
const editedContent = ref('')

const startEditing = async () => {
  editedContent.value = props.event.content
  isEditing.value = true
  await nextTick()
  const inputElement = document.getElementById(`edit-input-${props.event.id}`)
  if (inputElement) inputElement.focus()
}

const cancelEditing = () => {
  isEditing.value = false
  editedContent.value = ''
}

const handleSave = () => {
  if (!editedContent.value.trim()) return
  emit('edit', { id: props.event.id, content: editedContent.value })
  isEditing.value = false
}
</script>

<template>
  <div class="group bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow dark:shadow-gray-700/20">
    <div v-if="isEditing" class="flex flex-col gap-3">
      <BaseInput
        :id="`edit-input-${event.id}`"
        v-model="editedContent"
        placeholder="¿Qué sucedió?"
        @enter="handleSave"
        @keyup.esc="cancelEditing"
      />
      <div class="flex justify-end gap-2">
        <BaseButton
          variant="secondary"
          size="sm"
          @click="cancelEditing"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          size="sm"
          :loading="loading"
          :disabled="!editedContent.trim()"
          @click="handleSave"
        >
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </BaseButton>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-between items-start gap-4">
        <p class="text-gray-900 dark:text-white text-sm sm:text-base">
          {{ event.content }}
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="startEditing"
            class="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400"
            title="Editar evento"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </button>
          <button
            @click="$emit('delete', event)"
            class="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            title="Eliminar evento"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {{ formatDate(event.created_at) }}
      </p>
    </div>
  </div>
</template>